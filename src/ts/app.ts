/**
 * @license mamkLearn Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */
import '../css/globals.css';
import '../css/button.css';
import '../css/loader.css';
import '../css/style.css';
import { $, createTemplate, setTitle, logOut, clearChildren, loadChonk } from './utils';
import { eventHandle } from './events';
import { initParticles } from './loadParticles';
import { networkManager } from './networkEngine';

interface eventList {
    [key: string]: (event: Event) => void;
}
interface keyboardEventList {
    [key: string]: (event: KeyboardEvent) => void;
}
declare global {
    interface Window {
        currentUserConfig: number[];
        customOptionsIncrement: number;
        clickEvents: eventList;
        clickIncludesEvents: eventList;
        keyboardIncludesEvents: keyboardEventList;
        submitEvents: eventList;
        currentGameState: { isInGame: boolean; code: number; isTeacher: boolean; location: string };
    }
}
window.customOptionsIncrement = 0;
window.currentUserConfig = [0, 0, 0, 0, 0];
let prevRejected = false;
const customOptions = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];
let makeObj: typeof import('./make');

// Creates a console message that rickrolls you
console.log('%cUse link to get quiz answers:https://bit.ly/31Apj2U', 'font-size: 32px;');

// If the user is logged in initiliaze appropriate code
networkManager.onReady = () => {
    initializeApp();
    eventHandle();
};
networkManager.onLoginSuccess = completeLoginFlow;
networkManager.onLoginFail = () => {
    const error = $('loginError1');
    error.style.display = 'block';
    error.textContent = "Please use an account that ends in 'mamkschools.org' or an approved developer account.";
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

const initializeApp = () => {
    $('mainLoader').classList.remove('loader--active');
    initParticles();
    const search = new URLSearchParams(window.location.search);
    const data = search.get('shareUser');
    const otherData = search.get('shareQuiz');
    if (data && otherData && networkManager.authInstance.currentUser) {
        networkManager.getSharedQuiz(data, otherData, onShareQuiz);
    } else if (data && otherData) {
        prevRejected = true;
        $('loginInstructionsText').textContent = 'Please login with your mamkschools.org account to copy the quiz.';
    }
};

window.clickEvents = {
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
        if (window.currentGameState.isTeacher) {
            // Handles differently based on your location
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
                $('gameID').value = `${window.currentGameState.code.toString().slice(0, 5)}-${window.currentGameState.code.toString().slice(5)}`;
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
        networkManager.leaveGame(() => {});
    },
};

// These are the events that include the text in the elements id.
window.clickIncludesEvents = {};

window.submitEvents = {
    joinQuizForm: JoinGame,
};

window.keyboardIncludesEvents = {};

const login = () => {
    networkManager.startLogin();
};

function completeLoginFlow() {
    $('title').classList.add('handleOutTransition');
    setTimeout(() => {
        if (prevRejected) {
            const search = new URLSearchParams(window.location.search);
            const data = search.get('shareUser');
            const otherData = search.get('shareQuiz');
            networkManager.getSharedQuiz(data!, otherData!, onShareQuiz);
        }
        $('title').classList.remove('handleOutTransition');
        setTitle('homeScreen');
        $('title').style.top = '15%';
        $('title').style.height = '800px';
        setCharImage('currentUser', window.currentUserConfig);
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
        networkManager.initQuizList(() => {
            $('title').classList.add('handleOutTransition');
            setTimeout(() => {
                $('title').classList.remove('handleOutTransition');
                setTitle('makeMenu');
                networkManager.setClientQuizList = obj.quizSetter as () => void;
                $('title').style.top = '100px';
            }, 300);
        });
    });
}

function handleGameState(obj: typeof import('./make')) {
    let alreadyRun: boolean = false;
    networkManager.handleGameState(`actualGames/${networkManager.authInstance.currentUser!.uid}/`, (snap) => {
        if (snap && snap.isRunning && !networkManager.isMain) {
            obj.startGameTeacher(true);
            networkManager.unsubHandler();
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
    networkManager.joinGameStudent($('gameID').value, (exists, message) => {
        if (exists) {
            loadChonk('play', (obj: typeof import('./play')) => {
                $('mainLoader').classList.add('loader--active');
                obj.initEvents();
                setTimeout(() => {
                    $('loader-1').style.display = 'none';
                    $('gameStartScreenStudent').style.display = 'block';
                    let firstTime = true;
                    networkManager.handleGameState(window.currentGameState.location, (val) => {
                        if (val && val.isRunning) {
                            networkManager.unsubHandler();
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
        setCharImage('currentUser', window.currentUserConfig);
        window.customOptionsIncrement = 0;
    }, 300);
}

function arrowButtonPress() {
    window.customOptionsIncrement = window.customOptionsIncrement + 1;
    if (window.customOptionsIncrement > 4) {
        window.customOptionsIncrement = 0;
    }
    $('customButtonChange').textContent = customOptions[window.customOptionsIncrement];
    $('customButtonChange').focus();
}

function updateImageState(data: boolean) {
    if (data) {
        window.currentUserConfig[window.customOptionsIncrement]++;
        if (window.currentUserConfig[window.customOptionsIncrement] > 9) {
            window.currentUserConfig[window.customOptionsIncrement] = 0;
        }
    } else {
        window.currentUserConfig[window.customOptionsIncrement]--;
        if (window.currentUserConfig[window.customOptionsIncrement] < 0) {
            window.currentUserConfig[window.customOptionsIncrement] = 9;
        }
    }
    setCharImage('currentUser', window.currentUserConfig);
    networkManager.setCharImage(window.currentUserConfig);
}

/**
 * Sets the specified character image with a specified configuration.
 *
 * @export
 * @param {string} charID The characters ID.
 * @param {number[]} currentUserConfig The new configuration.
 */
export function setCharImage(charID: string, currentUserConfig: number[]) {
    $(charID + 'Eyes').src = `img/eyes-${currentUserConfig[0]}.png`;
    $(charID + 'Nose').src = `img/nose-${currentUserConfig[1]}.png`;
    $(charID + 'Mouth').src = `img/mouth-${currentUserConfig[2]}.png`;
    $(charID + 'Shirt').src = `img/shirt-${currentUserConfig[3]}.png`;
    $(charID + 'Arms').src = `img/arms-${currentUserConfig[4]}.svg`;
}
