import { getAuth } from 'firebase/auth';
import { getDatabase, ref, child, onValue, set, push, remove } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { httpsCallable } from './functions-lite';
import { globals } from './globals';
import { throwExcept } from './utils';

interface answer {
    answer: string | null;
    correct: boolean;
}
interface questionObject {
    questionName: string;
    shortAnswer: boolean;
    timeLimit: string | boolean;
    Answers: [answer, answer, answer, answer];
}
interface quizObject {
    quizID: string;
    quizName: string;
    isShared: boolean;
    questionObjects: questionObject[];
}
interface functionObject {
    message: string | number;
    code: number;
}
// Configuration for firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAFnj_KFkypyRhlBLceV7FIQwLBOk-13ek',
    authDomain: 'mamklearn.com',
    databaseURL: 'https://mamaroneck-learn-default-rtdb.firebaseio.com',
    projectId: 'mamaroneck-learn',
    storageBucket: 'mamaroneck-learn.appspot.com',
    messagingSenderId: '917106980205',
    appId: '1:917106980205:web:6d36bd431bbc3d91fa5664',
    measurementId: 'G-G1J2MYS1LJ',
};
initializeApp(firebaseConfig);
const auth = getAuth();
auth.useDeviceLanguage();
const database = getDatabase();
// Init analytics
getAnalytics();
// Init perf
getPerformance();
/**
 * Updates the data of a specified quiz (this handles sharing and name changes as well).
 *
 * @param {string} quizID The internal id of the quiz.
 * @param {(quizObject | null)} quizObject The new quiz object.
 * @param {() => void} callback The callback that gets called once the quiz data has been updated on the server.
 */
export const setQuiz = (quizID: string, quizObject: quizObject | null, callback: () => void) => {
    set(child(child(ref(database, `userProfiles/${getAuth().currentUser!.uid}`), 'quizData'), quizID), quizObject)
        .then(() => {
            if (!quizObject || quizObject.isShared) {
                set(ref(database, `sharedQuizzes/${auth.currentUser!.uid}/${quizID.replace('quizID_', '')}`), quizObject)
                    .then(() => {
                        callback();
                    })
                    .catch((error) => {
                        throwExcept(error);
                    });
            } else {
                callback();
            }
        })
        .catch((error) => {
            throwExcept(error);
        });
};

/**
 * Leaves the current game.
 */
export const leaveGame = () => {
    httpsCallable('leaveGame')()
        .then((value) => {
            const val = value.data as functionObject;
            if (val.code !== 200) {
                throwExcept(`@LeaveGame: ${val.code}: ${val.message}`);
            }
        })
        .catch(() => {
            setTimeout(() => {
                leaveGame();
            }, 4000);
        });
};

/**
 * Join a specified game as a student.
 *
 * @param {string} userInput A game code that the user inputted. Ex: '12345-678'.
 * @param {(exists: boolean, message: string) => void} callback A callback that is called once the player joins the game.
 */
export const networkJoinGameStudent = (userInput: string, callback: (exists: boolean, message: string) => void) => {
    const unsub = onValue(ref(database, `currentGames/${userInput.slice(0, 5)}/${userInput.slice(6)}`), (snap) => {
        if (!!snap.val()) {
            if (globals.currentGameState) {
                globals.currentGameState.location = snap.val();
            } else {
                globals.currentGameState = {} as { isInGame: boolean; code: number; isTeacher: boolean; location: string };
                globals.currentGameState.location = snap.val();
            }
            globals.alreadyInGame = true;
            if (globals.currentGameState && globals.currentGameState.isInGame) {
                callback(true, '');
            } else {
                const functionHandle = () => {
                    httpsCallable('joinGameStudent')(userInput)
                        .then((value) => {
                            const val = value.data as functionObject;
                            if (val.code == 200) {
                                callback(true, '');
                            } else if (val.code == 302) {
                                callback(false, 'Game Already Started');
                            } else {
                                throwExcept(`@JoinGameStudent: ${val.code}: ${val.message}`);
                            }
                        })
                        .catch(() => {
                            setTimeout(() => {
                                functionHandle();
                            }, 4000);
                        });
                };
                functionHandle();
            }
        } else {
            callback(false, 'Invalid ID');
        }
        unsub();
    });
};

/**
 * Kicks a player from the current game. This only works for teachers.
 *
 * @param {string} playerToKick The unique id assigned to the player that the teacher wants to kick.
 */
export const networkKickPlayer = (playerToKick: string) => {
    httpsCallable('kickPlayer')(playerToKick)
        .then((response) => {
            const data = response.data as functionObject;
            if (data.code !== 200) {
                throwExcept(`@KickPlayer: ${data.code}: ${data.message}`);
            }
        })
        .catch(() => {
            setTimeout(() => {
                networkKickPlayer(playerToKick);
            }, 4000);
        });
};

/**
 * Updates the users quiz list.
 *
 * @param {string} changedQuiz The name you want to give to the quiz.
 * @param {() => void} callback The callback called once the quiz list has been updated.
 * @param {string} [changedQuizId=''] If an empty string a new quiz entry is added to the quiz list. Otherwise updates the name of the quiz with the specified id.
 */
export const setQuizList = (changedQuiz: string, callback: () => void, changedQuizId: string = '') => {
    if (changedQuiz !== null && changedQuiz !== undefined) {
        if (changedQuizId == '') {
            push(child(ref(database, `userProfiles/${getAuth().currentUser!.uid}`), 'quizList'), changedQuiz).then(() => {
                callback();
            });
        } else {
            set(child(child(ref(database, `userProfiles/${getAuth().currentUser!.uid}`), 'quizList'), changedQuizId.toString()), changedQuiz).then(() => {
                callback();
            });
        }
    } else {
        remove(child(child(ref(database, `userProfiles/${getAuth().currentUser!.uid}`), 'quizList'), changedQuizId.toString()));
    }
};

/**
 * Creates a new game.
 *
 * @param {(value: functionObject) => void} callback The callback called once the game is created.
 * @param {string} quizID The id of the quiz you want to use during the game.
 */
export const startGame = (callback: (value: functionObject) => void, quizID: string) => {
    if (!globals.currentGameState) {
        httpsCallable('initGame')(quizID)
            .then((value) => {
                const val = value.data as functionObject;
                if (val.code == 200 || val.code == 300) {
                    callback(val);
                } else {
                    throwExcept(`@StartGame: ${val.code}: ${val.message}`);
                }
            })
            .catch(() => {
                setTimeout(() => {
                    startGame(callback, quizID);
                }, 4000);
            });
    } else {
        callback({
            code: 300,
            message: globals.currentGameState.code,
        });
    }
    globals.alreadyInGame = true;
};

/**
 * Gets the specified quizzes content.
 *
 * @param {string} quizID The id of the quiz.
 * @param {(value: quizObject) => void} callback The callback called once the data is retrieved.
 */
export const getQuizData = (quizID: string, callback: (value: quizObject) => void) => {
    const currentQuizObject = child(child(ref(database, `userProfiles/${auth.currentUser!.uid}`), 'quizData'), quizID);
    const unsub = onValue(currentQuizObject, (snap) => {
        callback(snap.val());
        unsub();
    });
};

/**
 * Starts a game (this is what happens after you press the start game button and what kicks off the countdown).
 *
 * @param {() => void} callback A callback called after the game has been started by the server.
 */
export const actuallyStartGame = (callback: () => void) => {
    globals.isMain = true;
    httpsCallable('startGame')()
        .then((response) => {
            const data = response.data as functionObject;
            if (data.code !== 200) {
                throwExcept(`@ActuallyStartGame: ${data.code}: ${data.message}`);
            } else {
                callback();
            }
            globals.isMain = false;
        })
        .catch(() => {
            setTimeout(() => {
                actuallyStartGame(callback);
            }, 4000);
        });
};

/**
 * Submits a question.
 *
 * @param {(number | string)} input The users input, if it is a number it is assumed to be multiple choice, otherwise it is considered to be a short answer response. This is validated server side.
 */
export const networkSubmitQuestion = (input: number | string) => {
    input = !isNaN(input as number) ? Number.parseInt(input.toString()) - 1 : input;
    httpsCallable('submitQuestion')(input)
        .then((response) => {
            const data = response.data as functionObject;
            if (data.code !== 200) {
                throwExcept(`@SubmitQuestion: ${data.code}: ${data.message}`);
            }
        })
        .catch(() => {
            setTimeout(() => {
                networkSubmitQuestion(!isNaN(input as number) ? Number.parseInt(input.toString()) + 1 : input);
            }, 4000);
        });
};

/**
 * An event listener which gives you the games results once they're ready.
 *
 * @param {(returnData: { [key: string]: { place: number; name: string; playerConfig: number[] } }) => void} input
 */
export const onGameEnd = (input: (returnData: { [key: string]: { place: number; name: string; playerConfig: number[] } }) => void, location?: string) => {
    const gameEnd = onValue(ref(database, `${location ? location : globals.currentGameState.location}finalResults/`), (snap) => {
        if (snap.val() && snap.val().hasRendered) {
            input(snap.val());
            gameEnd();
        }
    });
};
