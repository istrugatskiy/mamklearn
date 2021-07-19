/**
 * @license mamkLearn Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, child, onValue, set, push, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { httpsCallable } from './firebaseFunctionsLite';
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

// Configures firebase authentication
initializeApp(firebaseConfig);
const auth = getAuth();
auth.useDeviceLanguage();
const database = getDatabase();
/* Cloud Functions */
const initGame = httpsCallable('initGame');
const leaveGameFunction = httpsCallable('leaveGame');
const joinGameStudent = httpsCallable('joinGameStudent');
const kickPlayer = httpsCallable('kickPlayer');
const startGameFunction = httpsCallable('startGame');
const submitQuestion = httpsCallable('submitQuestion');
/* Cloud Functions */

export const setQuiz = (quizID: string, quizObject: quizObject | null, callback: () => void) => {
    set(child(child(ref(database, `userProfiles/${getAuth().currentUser!.uid}`), 'quizData'), quizID), quizObject).then(() => {
        if (!quizObject || quizObject.isShared) {
            set(ref(database, `sharedQuizzes/${auth.currentUser!.uid}/${quizID.replace('quizID_', '')}`), quizObject).then(() => {
                callback();
            });
        } else {
            callback();
        }
    });
};

export const leaveGame = () => {
    leaveGameFunction()
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

export const networkJoinGameStudent = (userInput: string, callback: (exists: boolean, message: string) => void) => {
    const unsub = onValue(ref(database, `currentGames/${userInput.slice(0, 5)}/${userInput.slice(6)}`), (snap) => {
        if (!!snap.val()) {
            if (window.currentGameState) {
                window.currentGameState.location = snap.val();
            } else {
                window.currentGameState = {} as { isInGame: boolean; code: number; isTeacher: boolean; location: string };
                window.currentGameState.location = snap.val();
            }
            globals.alreadyInGame = true;
            if (window.currentGameState && window.currentGameState.isInGame) {
                callback(true, '');
            } else {
                const functionHandle = () => {
                    joinGameStudent(userInput)
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

export const networkKickPlayer = (playerToKick: string) => {
    kickPlayer(playerToKick)
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

export const startGame = (callback: (value: functionObject) => void, data: string) => {
    if (!window.currentGameState) {
        initGame(data)
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
                    startGame(callback, data);
                }, 4000);
            });
    } else {
        callback({
            code: 300,
            message: window.currentGameState.code,
        });
    }
    globals.alreadyInGame = true;
};

export const handleCurrentQuiz = (quizID: string, callback: (value: quizObject) => void) => {
    const currentQuizObject = child(child(ref(database, `userProfiles/${getAuth().currentUser!.uid}`), 'quizData'), quizID);
    const unsub = onValue(currentQuizObject, (snap) => {
        callback(snap.val());
        unsub();
    });
};

export const actuallyStartGame = (callback: () => void) => {
    globals.isMain = true;
    startGameFunction()
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

export const networkSubmitQuestion = (input: number | string) => {
    input = !isNaN(input as number) ? Number.parseInt(input.toString()) - 1 : input;
    submitQuestion(input)
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

export const onGameEnd = (input: (returnData: { [key: string]: { place: number; name: string; playerConfig: number[] } }) => void) => {
    const gameEnd = onValue(ref(database, `${window.currentGameState.location}finalResults/`), (snap) => {
        if (snap.val() && snap.val().hasRendered) {
            input(snap.val());
            gameEnd();
        }
    });
};
