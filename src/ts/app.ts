// Defines imports and globals
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
        studentGameProcessor: (inputConfig: string) => void;
        quizStartTestCase: string;
        anotherTestCase: string;
        anotherTestCase2: string;
        anotherTestCase3: string;
        anotherTestCase4: string;
        currentGameState: { isInGame: boolean; code: number; isTeacher: boolean };
    }
}
window.customOptionsIncrement = 0;
window.currentUserConfig = [0, 0, 0, 0, 0];
let prevRejected = false;
const customOptions = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];

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
    error.textContent = "Please use an account that ends in 'mamkschools.org' or 'student.mamkschools.org'";
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
    loginBtn: () => {
        login();
    },
    customButtonChange: arrowButtonPress,
    customButtonChange2: () => {
        updateImageState(false);
    },
    leftCustomizeArrow: () => {
        updateImageState(false);
    },
    arrowCustomizeRight: () => {
        updateImageState(true);
    },
    playMenuBack: goBack,
    AboutLink: (event: Event) => {
        event.preventDefault();
        userClick('about.html');
    },
    aboutWindowButton: () => {
        userClick('index.html', 'aboutWindowButton');
    },
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
            makeCode(true);
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
    loadChonk('make', (obj) => {
        obj.initEvents();
        if (isInGame === true) {
            networkManager.handleGameState(`actualGames/${networkManager.authInstance.currentUser!.uid}/`, (snap) => {
                if (snap && snap.isRunning) {
                    obj.startGameTeacher();
                } else {
                    obj.playQuiz();
                }
                networkManager.unsubHandler();
            });
        }
        networkManager.initQuizList(() => {
            $('title').classList.add('handleOutTransition');
            setTimeout(() => {
                $('title').classList.remove('handleOutTransition');
                setTitle('makeMenu');
                networkManager.setClientQuizList = obj.quizSetter;
                $('title').style.top = '100px';
            }, 300);
        });
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
    networkManager.joinGameStudent($('gameID').value, (exists, message) => {
        if (exists) {
            loadChonk('play', (obj) => {
                $('mainLoader').classList.add('loader--active');
                obj.initEvents();
                setTimeout(() => {
                    $('loader-1').style.display = 'none';
                    $('gameStartScreenStudent').style.display = 'block';
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

export function setCharImage(charID: string, currentUserConfig: number[]) {
    $(charID + 'Eyes').src = `img/eyes-${currentUserConfig[0]}.png`;
    $(charID + 'Nose').src = `img/nose-${currentUserConfig[1]}.png`;
    $(charID + 'Mouth').src = `img/mouth-${currentUserConfig[2]}.png`;
    $(charID + 'Shirt').src = `img/shirt-${currentUserConfig[3]}.png`;
    $(charID + 'Arms').src = `img/arms-${currentUserConfig[4]}.svg`;
}
