import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, Unsubscribe } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, Reference, child, onValue, set, push, remove, onChildAdded, onChildRemoved } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { setCharImage } from './app';
import { throwExcept } from './utils';
import { $ } from './utils';

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
interface studentQuestion {
    questionName: string;
    answers: string[];
    startTime: number;
    endTime: number;
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
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
let provider = new GoogleAuthProvider();
auth.useDeviceLanguage();
const database = getDatabase();
const functions = getFunctions();
/* Cloud Functions */
const initGame = httpsCallable(functions, 'initGame');
const leaveGame = httpsCallable(functions, 'leaveGame');
const joinGameStudent = httpsCallable(functions, 'joinGameStudent');
const kickPlayer = httpsCallable(functions, 'kickPlayer');
const timeSync = httpsCallable(functions, 'timeSync');
const startGame = httpsCallable(functions, 'startGame');
/* Cloud Functions */
let charConfig: Reference;
let currentUser: Reference;
let quizList: Reference;
let newValue: { [key: string]: string } = {};
let errorHasBeenThrown = false;
let hasInitialized = false;
let alreadyInGame = false;

const listener = onAuthStateChanged(auth, (user) => {
    if (!hasInitialized) {
        networkManager.onReady();
        hasInitialized = true;
    }
    if (user) {
        if (user!.email!.endsWith('mamkschools.org')) {
            currentUser = ref(database, `userProfiles/${getAuth().currentUser!.uid}`);
            charConfig = child(currentUser, 'charConfig');
            quizList = child(currentUser, 'quizList');
            monitorUserState();
            networkManager.onLoginSuccess();
            listener();
        } else {
            networkManager.onLoginFail();
            getAuth().signOut();
        }
    }
});

const monitorUserState = () => {
    onValue(
        charConfig,
        (snap) => {
            if (!errorHasBeenThrown && auth.currentUser) {
                if (snap.val()) {
                    window.currentUserConfig = snap.val();
                    if ($('currentUserArms')) {
                        setCharImage('currentUser', window.currentUserConfig);
                    }
                } else {
                    for (let index = 0; index < 5; index++) {
                        set(child(charConfig, index.toString()), 0);
                    }
                }
            }
        },
        (error) => {
            throwExcept(`@MonitorUserState: ${error.message}`);
            errorHasBeenThrown = true;
        }
    );
    onValue(child(currentUser, 'currentGameState/'), (snap) => {
        if (!alreadyInGame) {
            if (snap.val() && snap.val().isInGame) {
                if ($('modal-bg').style.display !== 'block') {
                    $('title').style.display = 'none';
                    $('rejoinGame').style.display = 'block';
                }
            } else {
                $('rejoinGame').classList.add('handleOutTransition');
                setTimeout(() => {
                    $('quitGameConfirm').disabled = false;
                    $('rejoinGameConfirm').disabled = false;
                    $('title').style.display = 'block';
                    $('rejoinGame').style.display = 'none';
                    $('rejoinGame').classList.remove('handleOutTransition');
                }, 300);
            }
        } else if (!snap.val()) {
            alreadyInGame = false;
            if (window.currentGameState.isTeacher) {
                networkManager.quitQuizTeacher ? networkManager.quitQuizTeacher() : null;
            } else {
                networkManager.quitQuizStudent ? networkManager.quitQuizStudent() : null;
            }
        }
        window.currentGameState = snap.val();
    });
};

export class networkManager {
    static onLoginSuccess: () => void;
    static onLoginFail: () => void;
    static onInit: () => void;
    static onReady: () => void;
    static quitQuizTeacher: () => void;
    static removeStudentHandler: Unsubscribe;
    static otherStudentHandler: Unsubscribe;
    static quitQuizStudent: () => void;
    static unsubHandler: Unsubscribe;
    static leaderboardHandler: Unsubscribe;
    static _setClientQuizList: (quizList: { [key: string]: string }) => void;
    static studentPlayListener: Unsubscribe;
    private static currentQuizObject: Reference;
    static authInstance = getAuth();
    static hasBeenInitialized = false;
    private static prevLeaderboardValues: { [key: string]: { currentQuestion: number; playerName: string } };
    private static alreadyAware: { [key: string]: { playerName: string; playerConfig: number[] } };

    static set setClientQuizList(newFunction: () => void) {
        this._setClientQuizList = newFunction;
        networkManager._setClientQuizList(newValue);
    }

    static startLogin() {
        signInWithPopup(auth, provider).catch((error) => {
            $('loginError1').textContent = `${error.code}: ${error.message}`;
        });
    }

    static setCharImage(newChar: number[]) {
        for (let index = 0; index < 5; index++) {
            set(child(charConfig, index.toString()), newChar[index]);
        }
    }

    static setQuizList(changedQuiz: string, callback: () => void, changedQuizId: string = '') {
        if (changedQuiz !== null && changedQuiz !== undefined) {
            if (changedQuizId == '') {
                push(quizList, changedQuiz).then(() => {
                    callback();
                });
            } else {
                set(child(quizList, changedQuizId.toString()), changedQuiz).then(() => {
                    callback();
                });
            }
        } else {
            remove(child(quizList, changedQuizId.toString()));
        }
    }

    static initQuizList(callback: () => void) {
        if (this.hasBeenInitialized) {
            callback();
        }
        onValue(
            quizList,
            (snap) => {
                newValue = {};
                if (!errorHasBeenThrown && auth.currentUser) {
                    if (!this.hasBeenInitialized) {
                        callback();
                        this.hasBeenInitialized = true;
                    }
                    if (snap.val()) {
                        let newSnap = Object.keys(snap.val());
                        const values = Object.values(snap.val());
                        newSnap.forEach((el: string, index: number) => {
                            if (values[index]) {
                                newValue[`quizID_${el}`] = values[index] as string;
                            }
                        });
                    }
                    networkManager._setClientQuizList ? networkManager._setClientQuizList(newValue) : false;
                }
            },
            (error) => {
                throwExcept(`@InitQuizList: ${error.message}`);
                errorHasBeenThrown = true;
            }
        );
    }

    static setQuiz(quizID: string, quizObject: quizObject | null, callback: () => void) {
        set(child(child(currentUser, 'quizData'), quizID), quizObject).then(() => {
            if (!quizObject || quizObject.isShared) {
                set(ref(database, `sharedQuizzes/${this.authInstance.currentUser!.uid}/${quizID.replace('quizID_', '')}`), quizObject).then(() => {
                    callback();
                });
            } else {
                callback();
            }
        });
    }

    static handleCurrentQuiz(quizID: string, callback: (value: any) => void) {
        this.currentQuizObject = child(child(currentUser, 'quizData'), quizID);
        const unsub = onValue(this.currentQuizObject, (snap) => {
            callback(snap.val());
            unsub();
        });
    }

    static getSharedQuiz(shareUser: string, actualQuiz: string, callback: () => void) {
        const reference = ref(database, `sharedQuizzes/${shareUser}/${actualQuiz}`);
        const unsub = onValue(
            reference,
            (snap) => {
                if (snap.val()) {
                    push(child(currentUser, 'quizList'), snap.val().quizName).then((object) => {
                        const newQuizObject: quizObject = snap.val();
                        newQuizObject.isShared = false;
                        this.setQuiz(object.key!, newQuizObject, () => {
                            callback();
                        });
                        unsub();
                    });
                } else {
                    throwExcept('@GetSharedQuiz: quiz does not exist');
                }
            },
            (error) => {
                throwExcept(`@GetSharedQuiz: ${error.message}`);
            }
        );
    }

    static shareQuiz(quizId: string, quizObject: quizObject, callback: (obj: string) => void) {
        set(ref(database, `sharedQuizzes/${this.authInstance.currentUser!.uid}/${quizId}`), quizObject).then(() => {
            set(child(child(child(currentUser, 'quizData'), quizId), 'isShared'), true).then(() => {
                callback(quizId);
            });
        });
    }

    static startGame(callback: (value: functionObject) => void, data: string) {
        if (!window.currentGameState) {
            alreadyInGame = true;
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
                        this.startGame(callback, data);
                    }, 4000);
                });
        } else {
            alreadyInGame = true;
            callback({
                code: 300,
                message: window.currentGameState.code,
            });
        }
    }

    static leaveGame(callback: () => void) {
        leaveGame()
            .then((value) => {
                const val = value.data as functionObject;
                if (val.code == 200) {
                    callback();
                } else {
                    throwExcept(`@LeaveGame: ${val.code}: ${val.message}`);
                }
            })
            .catch(() => {
                setTimeout(() => {
                    this.leaveGame(callback);
                }, 4000);
            });
    }

    static joinGameStudent(userInput: string, callback: (exists: boolean, message: string) => void) {
        const unsub = onValue(ref(database, `currentGames/${userInput.toString().slice(0, 5)}/${userInput.toString().slice(6)}`), (snap) => {
            if (!!snap.val()) {
                window.currentGameState.location = snap.val();
                alreadyInGame = true;
                if (window.currentGameState && window.currentGameState.isInGame) {
                    callback(true, '');
                } else {
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
                                this.joinGameStudent(userInput, callback);
                            }, 4000);
                        });
                }
            } else {
                callback(false, 'Invalid ID');
            }
            unsub();
        });
    }

    static studentHandler(appendStudent: (newStudent: { playerName: string; playerConfig: number[] }, studentID: string) => void, removeStudent: (studentToRemove: string) => void) {
        this.alreadyAware = {};
        this.removeStudentHandler = onChildAdded(ref(database, `actualGames/${auth.currentUser!.uid}/players/`), (snap) => {
            if (this.alreadyAware[snap.key!] !== null) {
                appendStudent(snap.val(), snap.key!);
            }
            this.alreadyAware[snap.key!] = snap.val();
        });

        this.otherStudentHandler = onChildRemoved(ref(database, `actualGames/${auth.currentUser!.uid}/players/`), (snap) => {
            if (this.alreadyAware[snap.key!] !== snap.val()) {
                removeStudent(snap.key!);
            }
            this.alreadyAware[snap.key!] = snap.val();
        });
    }

    static kickPlayer(playerToKick: string) {
        kickPlayer(playerToKick)
            .then((response) => {
                const data = response.data as functionObject;
                if (data.code !== 200) {
                    throwExcept(`@KickPlayer: ${data.code}: ${data.message}`);
                }
            })
            .catch(() => {
                setTimeout(() => {
                    this.kickPlayer(playerToKick);
                }, 4000);
            });
    }

    static async getTime() {
        return ((await timeSync()).data as functionObject).message as number;
    }

    static actuallyStartGame(callback: () => void) {
        startGame()
            .then((response) => {
                const data = response.data as functionObject;
                if (data.code !== 200) {
                    throwExcept(`@ActuallyStartGame: ${data.code}: ${data.message}`);
                } else {
                    callback();
                }
            })
            .catch(() => {
                setTimeout(() => {
                    this.actuallyStartGame(callback);
                }, 4000);
            });
    }

    static handleGameState(location: string, callback: (state: { isRunning: boolean; totalQuestions: number }) => void) {
        this.unsubHandler = onValue(ref(database, `${location}globalState`), (snap) => {
            callback(snap.val());
        });
    }

    static trackLeaderboards(
        createInitialList: (playerData: { key: string; currentQuestion: number; playerName: string }[]) => void,
        removePlayer: (playerID: string) => void,
        updateList: (playerData: { key: string; currentQuestion: number; playerName: string }[]) => void
    ) {
        let firstTime = true;
        this.prevLeaderboardValues = {};
        this.leaderboardHandler = onValue(ref(database, `actualGames/${this.authInstance.currentUser!.uid}/leaderboards`), (snap) => {
            if (!snap.val()) {
                this.quitQuizTeacher();
                this.leaderboardHandler();
                return;
            }
            if (firstTime) {
                createInitialList(sortArray(snap.val()));
            } else {
                let check = false;
                Object.keys(this.prevLeaderboardValues).forEach((key) => {
                    if (!snap.val()[key]) {
                        removePlayer(key);
                        check = true;
                    }
                });
                if (check) {
                    setTimeout(() => {
                        updateList(sortArray(snap.val()));
                    }, 1000);
                } else {
                    updateList(sortArray(snap.val()));
                }
            }
            this.prevLeaderboardValues = snap.val();
            firstTime = false;
        });
    }

    static studentListener(initialRender: (currentQuestion: number, questionObject: studentQuestion) => void, secondRender: (currentQuestion: number, questionObject: studentQuestion) => void) {
        let firstTime = true;
        this.studentPlayListener = onValue(ref(database, `${window.currentGameState.location}players/${auth.currentUser!.uid}/`), (snap) => {
            firstTime ? initialRender(snap.val().currentQuestionNumber, snap.val().currentQuestion) : secondRender(snap.val().currentQuestionNumber, snap.val().currentQuestion);
            firstTime = false;
        });
    }
}

function sortArray(input: { [key: string]: { currentQuestion: number; playerName: string } }) {
    let tempArray: { key: string; currentQuestion: number; playerName: string }[] = [];
    for (const [key, value] of Object.entries(input)) {
        tempArray.push({
            key: key,
            currentQuestion: value.currentQuestion,
            playerName: value.playerName,
        });
    }
    return tempArray.sort((a, b) => {
        const firstEl = a as { currentQuestion: number; playerName: string };
        const secondEl = b as { currentQuestion: number; playerName: string };
        return secondEl.currentQuestion - firstEl.currentQuestion;
    });
}
