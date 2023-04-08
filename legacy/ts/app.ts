import '../css/globals.css';
import '../css/button.css';
import '../css/loader.css';
import '../css/style.css';
import './trolls';
import './components/character/mamk-char.lit';
import { $, createTemplate, setTitle, logOut, timeHandler, throwExcept, call } from './old-utils';
import { eventHandle } from './events';
import { init_particles } from '../../src/scripts/load-particles';
import { child, DatabaseReference, getDatabase, onValue, push, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { globals } from './globals';
import { leaveGame, networkJoinGameStudent, setQuiz } from './networkEngine';
import { Player } from './components/student.lit';
import { StudentList } from './components/student-list.lit';
import { Leaderboard } from './components/leaderboards';

declare global {
    interface Window {
        WIZ_global_data: string;
        jQuery: {
            fn: {
                jquery: string;
            };
        };
        React: {
            version: string;
            Component: string;
        };
        __mamkVersion: string;
    }
}
// Mamklearn version (used for analytics)
window.__mamkVersion = 'v2.0.0#' + document.currentScript?.src;
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
let currentUser: DatabaseReference;
let charConfig: DatabaseReference;
let quizList: DatabaseReference;
let makeMenuInitialized = false;
let newQuizData: { [key: string]: string } = {};
let makeObj: typeof import('./make');
let customOptionsIncrement: number = 0;

const database = getDatabase();
const auth = getAuth();
const isHome = window.location.pathname !== '/index.html' && window.location.pathname !== '/';

// If the user is logged in initiliaze appropriate code

const onReady = () => {
    initApp();
    eventHandle();
};

let hasInitialized = false;

const listener = onAuthStateChanged(
    auth,
    (user) => {
        if (isHome) {
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
    if (isHome) return;
    onValue(
        charConfig,
        (snap) => {
            if (auth.currentUser) {
                if (snap.val()) {
                    globals.currentUserConfig = snap.val();
                    if ($('currentUserArms')) {
                        setCharImage('user-char', globals.currentUserConfig);
                    }
                } else {
                    globals.currentUserConfig ??= [0, 0, 0, 0, 0];
                    set(charConfig, globals.currentUserConfig);
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
    init_particles();
    customElements.define('teacher-screen-player', Player);
    customElements.define('teacher-intro', StudentList);
    customElements.define('game-leaderboard', Leaderboard);
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

globals.clickEvents = {
    btn2: playCode,
    makebtn: makeCode,
    signOutbtn: logOut,
    loginBtn: () => login(),
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
                makeObj.playQuiz();
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
    signInWithPopup(auth, provider).catch(({ code, message }) => {
        $('loginError1').textContent = `${code}: ${message}`;
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
        setCharImage('user-char', globals.currentUserConfig);
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
// The reason why it can accept events is because by defualt eventHandle will pass an event object to any function that it calls.
function makeCode(isInGame: boolean | Event = false) {
    $('makebtn').disabled = true;
    $('btn2').disabled = true;
    $('makebtn').replaceChildren();
    customOptionsIncrement = 0;
    createTemplate('svgLoader', 'makebtn');
    const loadMake = () => {
        import(`./make`)
            .then((obj) => {
                obj.initEvents();
                if (isInGame === true) {
                    makeObj = obj;
                    makeObj.playQuiz();
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
                                const newSnap = Object.keys(snap.val());
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
            })
            .catch((error) => {
                console.warn(`Failed to fetch chonk (${error})! Retrying...`);
                setTimeout(() => {
                    loadMake();
                }, 2000);
            });
    };
    loadMake();
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
    $('submitID').replaceChildren();
    createTemplate('svgLoader', 'submitID');
    joinGameStudent();
}

function joinGameStudent() {
    if ($('gameID').value.length == 8) {
        $('gameID').value = $('gameID').value.slice(0, 5) + '-' + $('gameID').value.slice(5);
    }
    networkJoinGameStudent($('gameID').value, (exists, message) => {
        if (exists) {
            const loadPlay = () => {
                import(`./play`)
                    .then((obj) => {
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
                    })
                    .catch((error) => {
                        console.warn(`Failed to fetch chonk (${error})! Retrying...`);
                        setTimeout(() => {
                            loadPlay();
                        }, 2000);
                    });
            };
            loadPlay();
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
        setCharImage('user-char', globals.currentUserConfig);
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
    setCharImage('user-char', globals.currentUserConfig);
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
    $(charID).dataset.character = JSON.stringify(currentUserConfig);
}
