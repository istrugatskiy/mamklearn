/**
 * @license mamkLearn Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */
import '../css/globals.css';
import '../css/button.css';
import '../css/loader.css';
import '../css/style.css';
import { $, createTemplate, setTitle, logOut, clearChildren, loadChonk, timeHandler, throwExcept, call } from './utils';
import { eventHandle } from './events';
import { initParticles } from './loadParticles';
import { child, getDatabase, onValue, push, ref, Reference, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { globals } from './globals';
import { leaveGame, networkJoinGameStudent, setQuiz } from './networkEngine';

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
let prevRejected = false;
const customOptions = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];
const provider = new GoogleAuthProvider();
let currentUser: Reference;
let charConfig: Reference;
let quizList: Reference;
let makeMenuInitialized = false;
let newQuizData: { [key: string]: string } = {};
let makeObj: typeof import('./make');
let customOptionsIncrement: number = 0;

// Creates a console message that rickrolls you
console.log('%cUse link to get quiz answers:https://bit.ly/31Apj2U', 'font-size: 32px;');

const database = getDatabase();
const auth = getAuth();
const isNonMainPage = window.location.pathname !== '/index.html' && window.location.pathname !== '/';

// If the user is logged in initiliaze appropriate code

const onReady = () => {
    initApp();
    eventHandle();
};

let hasInitialized = false;

const listener = onAuthStateChanged(
    auth,
    (user) => {
        if (isNonMainPage) {
            onReady();
            listener();
            return;
        }
        if (user) {
            if (/.*@mamkschools.org$/.test(user.email!) || /.*@student.mamkschools.org$/.test(user.email!) || /.*@mamklearn.com$/.test(user.email!) || user.email == 'ilyastrug@gmail.com') {
                currentUser = ref(database, `userProfiles/${getAuth().currentUser!.uid}`);
                charConfig = child(currentUser, 'charConfig');
                quizList = child(currentUser, 'quizList');
                monitorUserState();
                timeHandler().then(() => {
                    if (!hasInitialized) {
                        onReady();
                        hasInitialized = true;
                    }
                    completeLoginFlow();
                });
                listener();
            } else {
                const error = $('loginError1');
                error.style.display = 'block';
                error.textContent = "Please use an account that ends in 'mamkschools.org' or an approved developer account.";
                getAuth().signOut();
            }
        } else if (!hasInitialized) {
            onReady();
            hasInitialized = true;
        }
    },
    () => {
        const error = $('loginError1');
        error.style.display = 'block';
        error.textContent = 'A communication error occurred.';
    }
);

const monitorUserState = () => {
    if (isNonMainPage) return;
    onValue(
        charConfig,
        (snap) => {
            if (auth.currentUser) {
                if (snap.val()) {
                    globals.currentUserConfig = snap.val();
                    if ($('currentUserArms')) {
                        setCharImage('currentUser', globals.currentUserConfig);
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
        }
    );
    onValue(child(currentUser, 'currentGameState/'), (snap) => {
        if (!globals.alreadyInGame) {
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
            globals.alreadyInGame = false;
            if (globals.currentGameState.isTeacher) {
                call(globals.quitQuizTeacher);
            } else {
                call(globals.quitQuizStudent);
            }
        }
        const temp = globals.currentGameState ? globals.currentGameState.location : '';
        globals.currentGameState = snap.val();
        if (globals.currentGameState) {
            globals.currentGameState.location = temp;
        }
    });
};

const onShareQuiz = () => {
    $('errorActual').textContent = 'Quiz Copied';
    $('errorMessageA').style.display = 'block';
    setTimeout(() => {
        makeCode();
        $('errorMessageA').style.display = 'none';
        window.history.pushState(null, 'mamkLearn', '/');
    }, 1000);
};

const getSharedQuiz = (shareUser: string, actualQuiz: string) => {
    const unsub = onValue(
        ref(database, `sharedQuizzes/${shareUser}/${actualQuiz}`),
        (snap) => {
            if (snap.val()) {
                push(child(currentUser, 'quizList'), snap.val().quizName).then((object) => {
                    const newQuizObject: quizObject = snap.val();
                    newQuizObject.isShared = false;
                    setQuiz(object.key!, newQuizObject, () => {
                        onShareQuiz();
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
};

const initApp = () => {
    $('mainLoader').classList.remove('loader--active');
    initParticles();
    const search = new URLSearchParams(window.location.search);
    const data = search.get('shareUser');
    const otherData = search.get('shareQuiz');
    if (data && otherData && auth.currentUser) {
        getSharedQuiz(data, otherData);
    } else if (data && otherData) {
        prevRejected = true;
        $('loginInstructionsText').textContent = 'Please login with your mamkschools.org account to copy the quiz.';
    }
};

const charCustomize = () => {
    $('customButtonChange').textContent = customOptions[customOptionsIncrement];
};

globals.clickEvents = {
    btn2: playCode,
    makebtn: makeCode,
    signOutbtn: logOut,
    loginBtn: () => login(),
    charCustomize: charCustomize,
    customButtonChange: arrowButtonPress,
    customButtonChange2: () => updateImageState(false),
    leftCustomizeArrow: () => updateImageState(false),
    arrowCustomizeRight: () => updateImageState(true),
    playMenuBack: goBack,
    AboutLink: (event: Event) => {
        event.preventDefault();
        userClick('about.html');
    },
    aboutWindowButton: () => userClick('/', 'aboutWindowButton'),
    PrivacyPolicyLink: (event: Event) => {
        event.preventDefault();
        userClick('privacy.html');
    },
    TermsOfServiceLink: (event: Event) => {
        event.preventDefault();
        userClick('tos.html');
    },
    rejoinGameConfirm: () => {
        if (globals.currentGameState.isTeacher) {
            // Handles differently based on your location within the app
            if ($('makebtn')) {
                makeCode(true);
            } else if ($('gameID')) {
                goBack();
                setTimeout(() => {
                    makeCode(true);
                }, 600);
            } else {
                handleGameState(makeObj);
            }
        } else {
            $('title').style.display = 'block';
            playCode();
            setTimeout(() => {
                $('gameID').value = `${globals.currentGameState.code.toString().slice(0, 5)}-${globals.currentGameState.code.toString().slice(5)}`;
                JoinGame();
            }, 300);
        }
        $('rejoinGame').classList.add('handleOutTransition');
        setTimeout(() => {
            $('rejoinGame').style.display = 'none';
            $('rejoinGame').classList.remove('handleOutTransition');
        }, 300);
    },
    quitGameConfirm: () => {
        $('quitGameConfirm').disabled = true;
        $('rejoinGameConfirm').disabled = true;
        leaveGame();
    },
};

// These are the events that include the text in the elements id.
globals.clickIncludesEvents = {};

globals.submitEvents = {
    joinQuizForm: JoinGame,
};

globals.keyboardIncludesEvents = {};

const login = () => {
    signInWithPopup(auth, provider).catch((error) => {
        $('loginError1').textContent = `${error.code}: ${error.message}`;
    });
};

function completeLoginFlow() {
    $('title').classList.add('handleOutTransition');
    setTimeout(() => {
        if (prevRejected) {
            const search = new URLSearchParams(window.location.search);
            const data = search.get('shareUser');
            const otherData = search.get('shareQuiz');
            getSharedQuiz(data!, otherData!);
        }
        $('title').classList.remove('handleOutTransition');
        setTitle('homeScreen');
        $('title').style.top = '15%';
        $('title').style.height = '800px';
        setCharImage('currentUser', globals.currentUserConfig);
    }, 300);
}

function userClick(link: string, disableObject?: string) {
    $('mainLoader').classList.add('loader--active');
    if (disableObject) {
        $(disableObject).disabled = true;
    }
    setTimeout(() => {
        window.location.href = link;
    }, 1000);
}

// make and play on button click functions here!
function makeCode(isInGame: boolean | Event = false) {
    $('makebtn').disabled = true;
    $('btn2').disabled = true;
    clearChildren('makebtn');
    createTemplate('svgLoader', 'makebtn');
    loadChonk('make', (obj: typeof import('./make')) => {
        obj.initEvents();
        if (isInGame === true) {
            handleGameState(obj);
            makeObj = obj;
        }
        const renderQuizList = (newQuizData: { [key: string]: string }) => {
            $('title').classList.add('handleOutTransition');
            setTimeout(() => {
                $('title').classList.remove('handleOutTransition');
                setTitle('makeMenu');
                $('title').style.top = '100px';
                obj.quizSetter(newQuizData);
            }, 300);
        };
        if (makeMenuInitialized) {
            renderQuizList(newQuizData);
            return;
        }
        onValue(
            quizList,
            (snap) => {
                newQuizData = {};
                if (auth.currentUser) {
                    if (snap.val()) {
                        let newSnap = Object.keys(snap.val());
                        const values = Object.values(snap.val());
                        newSnap.forEach((el: string, index: number) => {
                            if (values[index]) {
                                newQuizData[`quizID_${el}`] = values[index] as string;
                            }
                        });
                    }
                    if (!makeMenuInitialized) {
                        renderQuizList(newQuizData);
                        makeMenuInitialized = true;
                    } else {
                        obj.quizSetter(newQuizData);
                    }
                }
            },
            (error) => {
                throwExcept(`@InitQuizList: ${error.message}`);
            }
        );
    });
}

function handleGameState(obj: typeof import('./make')) {
    let alreadyRun: boolean = false;
    const unsubHandler = onValue(ref(database, `actualGames/${auth.currentUser!.uid}/globalState`), (snap) => {
        const val = snap.val() as { isRunning: boolean; totalQuestions: number; gameEnd: number };
        if (val && val.isRunning && !globals.isMain) {
            obj.startGameTeacher(true);
            unsubHandler();
        } else if (!alreadyRun) {
            obj.playQuiz();
        }
        alreadyRun = true;
    });
}

function playCode() {
    $('makebtn').disabled = true;
    $('btn2').disabled = true;
    $('title').classList.add('handleOutTransition');
    setTimeout(() => {
        $('title').classList.remove('handleOutTransition');
        setTitle('playMenu');
        $('gameID').focus();
        $('title').style.height = '250px';
        $('title').style.top = '30%';
    }, 300);
}

function JoinGame() {
    $('gameID').disabled = true;
    $('submitID').disabled = true;
    $('playMenuBack').classList.add('disabled');
    clearChildren('submitID');
    createTemplate('svgLoader', 'submitID');
    joinGameStudent();
}

function joinGameStudent() {
    if ($('gameID').value.length == 8) {
        $('gameID').value = $('gameID').value.slice(0, 5) + '-' + $('gameID').value.slice(5);
    }
    networkJoinGameStudent($('gameID').value, (exists, message) => {
        if (exists) {
            loadChonk('play', (obj: typeof import('./play')) => {
                $('mainLoader').classList.add('loader--active');
                obj.initEvents();
                setTimeout(() => {
                    $('loader-1').style.display = 'none';
                    $('gameStartScreenStudent').style.display = 'block';
                    let firstTime = true;
                    const unsubHandler = onValue(ref(database, `${globals.currentGameState.location}globalState`), (snap) => {
                        const val = snap.val() as { isRunning: boolean; totalQuestions: number; gameEnd: number };
                        if (val && val.isRunning) {
                            unsubHandler();
                            // This is for dealing with the countdown.
                            // We do it on clientside because doing it server side would be a pain.
                            // Plus its only four seconds.
                            setTimeout(() => obj.initQuestionHandler(val.totalQuestions), firstTime ? 0 : 4100);
                        }
                        firstTime = false;
                    });
                }, 1000);
            });
        } else {
            $('errorActual').textContent = message;
            $('gameID').disabled = false;
            $('submitID').disabled = false;
            $('errorMessageA').style.display = 'block';
            $('playMenuBack').classList.remove('disabled');
            setTimeout(() => {
                $('errorMessageA').style.display = 'none';
            }, 1000);
            $('submitID').textContent = 'Join';
        }
    });
}

export function goBack() {
    $('title').classList.add('handleOutTransition');
    setTimeout(() => {
        $('title').classList.remove('handleOutTransition');
        setTitle('homeScreen');
        $('title').style.height = '800px';
        $('title').style.top = '15%';
        setCharImage('currentUser', globals.currentUserConfig);
        customOptionsIncrement = 0;
    }, 300);
}

function arrowButtonPress() {
    customOptionsIncrement = customOptionsIncrement + 1;
    if (customOptionsIncrement > 4) {
        customOptionsIncrement = 0;
    }
    $('customButtonChange').textContent = customOptions[customOptionsIncrement];
    $('customButtonChange').focus();
}

function updateImageState(data: boolean) {
    if (data) {
        globals.currentUserConfig[customOptionsIncrement]++;
        if (globals.currentUserConfig[customOptionsIncrement] > 9) {
            globals.currentUserConfig[customOptionsIncrement] = 0;
        }
    } else {
        globals.currentUserConfig[customOptionsIncrement]--;
        if (globals.currentUserConfig[customOptionsIncrement] < 0) {
            globals.currentUserConfig[customOptionsIncrement] = 9;
        }
    }
    setCharImage('currentUser', globals.currentUserConfig);
    globals.currentUserConfig.forEach((value, index) => {
        set(child(charConfig, index.toString()), value);
    });
}

/**
 * Sets the specified character image with a specified configuration.
 *
 * @export
 * @param {string} charID The characters ID.
 * @param {number[]} currentUserConfig The new configuration.
 */
export function setCharImage(charID: string, currentUserConfig: number[]) {
    $(`${charID}Eyes`).src = `img/eyes-${currentUserConfig[0]}.png`;
    $(`${charID}Nose`).src = `img/nose-${currentUserConfig[1]}.png`;
    $(`${charID}Mouth`).src = `img/mouth-${currentUserConfig[2]}.png`;
    $(`${charID}Shirt`).src = `img/shirt-${currentUserConfig[3]}.png`;
    $(`${charID}Arms`).src = `img/arms-${currentUserConfig[4]}.svg`;
    // Handles edge case where player doesn't have character config denoted by negative value for last number.
    if (currentUserConfig[4] !== -1) {
        ($(`${charID}Eyes`).parentElement!.lastElementChild! as HTMLElement).src = 'img/base.svg';
    } else {
        ($(`${charID}Eyes`).parentElement!.lastElementChild! as HTMLElement).src = 'img/qIcon-0.svg';
        $(`${charID}Arms`).src = `img/arms-5.svg`;
    }
}
