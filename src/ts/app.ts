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

declare global {
    interface Window {
        currentUserConfig: number[];
        customOptionsIncrement: number;
        clickEvents: eventList;
        clickIncludesEvents: eventList;
        keyboardIncludesEvents: eventList;
        submitEvents: eventList;
        studentGameProcessor: (inputConfig: string) => void;
        quizStartTestCase: string;
        anotherTestCase: string;
        anotherTestCase2: string;
        anotherTestCase3: string;
        anotherTestCase4: string;
    }
}
window.customOptionsIncrement = 0;
window.currentUserConfig = [0, 0, 0, 0, 0];
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

const initializeApp = () => {
    /* alert(`[WARNING: THIS IS A DEV BUILD YOUR DATA MAY GET DELETED AND STUFF MAY NOT WORK!]
	(This message will be removed as soon as the app goes live.)
	Changelog: 
	1.0.1: Added support for logging out and improved character customization ui!
    1.0.2: Fixed flicker when typing into some input fields and fixed a bug where text could get smooshed
           whenever playing on mobile
    `); */
    $('mainLoader').classList.remove('loader--active');
    initParticles();
    if (new URLSearchParams(window.location.search).get('shareQuiz')) {
        setTimeout(() => {
            $('errorActual').textContent = 'Quiz Copied';
            $('errorMessageA').style.display = 'block';
            setTimeout(() => {
                $('errorMessageA').style.display = 'none';
                window.history.pushState(null, 'mamkLearn', 'index.html');
            }, 1000);
        }, 500);
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
    AboutLink: () => {
        userClick('about.html');
    },
    aboutWindowButton: () => {
        userClick('index.html', 'aboutWindowButton');
    },
    PrivacyPolicyLink: () => {
        userClick('privacy.html');
    },
    TermsOfServiceLink: () => {
        userClick('tos.html');
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
function makeCode() {
    $('makebtn').disabled = true;
    $('btn2').disabled = true;
    clearChildren('makebtn');
    createTemplate('svgLoader', 'makebtn');
    loadChonk('make', (obj) => {
        obj.initEvents();
        $('title').classList.add('handleOutTransition');
        setTimeout(() => {
            $('title').classList.remove('handleOutTransition');
            setTitle('makeMenu');
            $('title').style.top = '100px';
            obj.addQuiz();
        }, 300);
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
    if ($('gameID').value == '2794') {
        loadChonk('play', (obj) => {
            $('mainLoader').classList.add('loader--active');
            obj.initEvents();
            setTimeout(() => {
                $('loader-1').style.display = 'none';
                $('gameStartScreenStudent').style.display = 'block';
                setTimeout(() => {
                    $('mainLoader').classList.remove('loader--active');
                }, 1000);
            }, 1000);
            setTimeout(() => {
                window.studentGameProcessor(window.quizStartTestCase);
            }, 2000);
        });
    } else {
        setTimeout(() => {
            $('errorActual').textContent = 'Invalid ID';
            $('gameID').disabled = false;
            $('submitID').disabled = false;
            $('errorMessageA').style.display = 'block';
            $('playMenuBack').classList.remove('disabled');
            setTimeout(() => {
                $('errorMessageA').style.display = 'none';
            }, 1000);
            $('submitID').textContent = 'Join';
        }, 1000);
    }
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
