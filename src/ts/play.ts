import { $, mathClamp, throwExcept, getID, ordinalSuffix, clearChildren } from './utils';
import { setCharImage, goBack } from './app';
window.studentGameProcessor = studentGameProcessor;

window.quizStartTestCase = ' {"gameStart": true, "totalQuestions": 5, "currentQuestion": "TTTTTTTHHTHHTHTHTHTTHTTTTTTTHTHHHHTHTTTTTHHTTHHTHTTTTTTHTTTHTTTHTHHHTTTTHTHTHHT HHTTHHHTHT", "choices": [ null ], "currentQuestionTime": 69, "questionID": 0 }';
window.anotherTestCase = '{ "isQuestionCorrect": false, "nextQuestion": null, "choices": [ null ], "currentQuestionTime": 20 }';
window.anotherTestCase2 = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ "a", "a2", "a3", "a4" ], "currentQuestionTime": 69 }';
window.anotherTestCase3 = '{ "gameFinish": true, "timeTillEnd": 180}';
window.anotherTestCase4 = '{ "gameEnd": true, "CharacterConfig1": [0,0,0,0,0], "CharacterConfig2": [9,9,9,9,9], "CharacterConfig3": [0,1,2,3,4], "userPlace": 12}';
let otherInterval: number;
let timerInterval: number;
let finishUpInterval: number;

interface gameStateInterface {
    currentQuestion: number;
    totalQuestions: number;
    gameErrorState: boolean;
    timeLeft: boolean | number;
    currentQuestionData: {
        question: string;
        answers: [];
        timeLimit: number;
    };
}

let gameStateStudent: gameStateInterface;
const root = document.documentElement;
let bottomBarOffset: number;
let resettableTime: number;
let resettableTime2: number;
let resettableTime3: number;
let resettableTime4: number;

let clickListeners = {
    shortAnswerSubmitButton: () => {
        submitShortAnswer();
    },
};

let clickIncludesListeners = {
    studentQuizButton: (event: Event) => {
        submitMultipleChoice(getID(event));
    },
};

let keyboardIncludesListeners = {
    studentShortAnswerText: (event: KeyboardEvent) => {
        if(event.key == 'Enter') {
            submitShortAnswer();
        }
    },
};

export const initEvents = () => {
    window.clickEvents = { ...window.clickEvents, ...clickListeners };
    window.clickIncludesEvents = { ...window.clickIncludesEvents, ...clickIncludesListeners };
    window.keyboardIncludesEvents = { ...window.keyboardIncludesEvents, ...keyboardIncludesListeners };
};

function studentGameProcessor(input: string) {
    let inputInternal = JSON.parse(input);
    if (inputInternal.hasOwnProperty('gameStart')) {
        kickPlayer();
        if (inputInternal.gameStart == true) {
            clearInterval(timerInterval);
            clearInterval(finishUpInterval);
            clearInterval(otherInterval);
            setCharImage('player', window.currentUserConfig);
            bottomBarOffset = 15;
            gameStateStudent = {
                currentQuestion: inputInternal.questionID,
                totalQuestions: inputInternal.totalQuestions,
                gameErrorState: false,
                timeLeft: false,
                currentQuestionData: {
                    question: inputInternal.currentQuestion,
                    answers: inputInternal.choices,
                    timeLimit: inputInternal.currentQuestionTime,
                },
            };
            let studentRaceBoxNumbers = document.createDocumentFragment();
            for (let i = 1; i <= gameStateStudent.totalQuestions; i++) {
                let node = document.createElement('th');
                node.textContent = i.toString();
                studentRaceBoxNumbers.appendChild(node);
            }
            let node = document.createElement('th');
            node.textContent = 'finish';
            studentRaceBoxNumbers.appendChild(node);
            clearChildren('studentRaceNumbers');
            $('studentRaceNumbers').appendChild(studentRaceBoxNumbers);
            $('gameStartScreenStudent').style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                $('gameStartScreenStudent').style.display = 'none';
                $('gameStartScreenStudent').style.animation = '';
            }, 500);
            $('mainLoader').classList.remove('loader--active');
            $('title').style.display = 'none';
            $('studentPlayScreen').style.display = 'block';
            setQuestion();
            setTimeout(() => {
                $('loader-1').style.display = 'none';
                $('errorMessageA').style.display = 'none';
            }, 1000);
        }
    } else if (inputInternal.hasOwnProperty('error')) {
        throwExcept(`@playQuiz: ${inputInternal.error}`);
        gameStateStudent.gameErrorState = inputInternal.gameErrorState;
    } else if (inputInternal.hasOwnProperty('kickPlayer')) {
        kickPlayer(true);
    } else if (inputInternal.hasOwnProperty('isQuestionCorrect')) {
        clearInterval(timerInterval);
        clearInterval(otherInterval);
        if (inputInternal.isQuestionCorrect && gameStateStudent.currentQuestion < gameStateStudent.totalQuestions - 1) {
            gameStateStudent.currentQuestion++;
            gameStateStudent.currentQuestionData.question = inputInternal.nextQuestion;
            gameStateStudent.currentQuestionData.answers = inputInternal.choices;
            gameStateStudent.currentQuestionData.timeLimit = inputInternal.currentQuestionTime;
            Array.from($('studentAnswersFlex').children).forEach((object) => {
                object.classList.add('transitionQuestionB');
                setTimeout(() => {
                    while (object.firstElementChild!.firstChild) object.firstElementChild!.removeChild(object.firstElementChild!.lastChild!);
                    object.disabled = false;
                    object.classList.remove('transitionQuestionB');
                    object.classList.add('transitionQuestionC');
                    setTimeout(() => {
                        object.classList.remove('transitionQuestionC');
                    }, 400);
                }, 400);
            });
            $('titleButtonStudent').classList.add('transitionQuestionA');
            $('studentShortAnswer').classList.add('transitionQuestionB');
            setTimeout(() => {
                setQuestion();
            }, 400);
            // Separate timeout to get on a separate thread and fix random flickering
            setTimeout(() => {
                $('studentShortAnswer').classList.add('transitionQuestionC');
                $('studentShortAnswer').classList.remove('transitionQuestionB');
            }, 400);
            setTimeout(() => {
                $('titleButtonStudent').classList.remove('transitionQuestionA');
                $('studentShortAnswer').classList.remove('transitionQuestionC');
            }, 800);
        } else if (inputInternal.isQuestionCorrect) {
            gameStateStudent.currentQuestion++;
            updateStudentLocation(gameStateStudent.currentQuestion);
            $('errorMessageB').style.display = 'block';
        } else if (!inputInternal.isQuestionCorrect) {
            let start = Date.now();
            let init = inputInternal.currentQuestionTime;
            otherInterval = window.setInterval(() => {
                let delta = (Date.now() - start) / 1000;
                let internal = init - delta;
                if (internal < 0) {
                    internal = 0;
                }
                $('mistakeQuestion').textContent = `You can try again in ${Math.floor(internal)} seconds`;
            }, 100);
            Array.from($('studentAnswersFlex').children).forEach((object) => {
                object.classList.add('transitionQuestionB');
                setTimeout(() => {
                    object.style.display = 'none';
                    while (object.firstElementChild!.firstChild) object.firstElementChild!.removeChild(object.firstElementChild!.lastChild!);
                    object.disabled = false;
                    object.classList.remove('transitionQuestionB');
                    resettableTime = window.setTimeout(() => {
                        object.style.display = 'block';
                        object.classList.add('transitionQuestionC');
                        setTimeout(() => {
                            object.classList.remove('transitionQuestionC');
                        }, 400);
                    }, inputInternal.currentQuestionTime * 1000);
                }, 400);
            });
            $('titleButtonStudent').classList.add('transitionQuestionB');
            $('studentShortAnswer').classList.add('transitionQuestionB');
            setTimeout(() => {
                $('titleButtonStudent').classList.remove('transitionQuestionB');
                $('studentShortAnswer').classList.remove('transitionQuestionB');
                $('titleButtonStudent').style.display = 'none';
                $('studentShortAnswer').style.display = 'none';
                $('userNotifyPlay').style.display = 'block';
                resettableTime2 = window.setTimeout(() => {
                    $('userNotifyPlay').classList.add('fadeOutThingy');
                    $('titleButtonStudent').classList.add('transitionQuestionC');
                    $('studentShortAnswer').classList.add('transitionQuestionC');
                    $('titleButtonStudent').style.display = 'block';
                    setQuestion();
                    setTimeout(() => {
                        $('studentShortAnswer').classList.remove('transitionQuestionC');
                        $('titleButtonStudent').classList.remove('transitionQuestionC');
                    }, 400);
                    setTimeout(() => {
                        clearInterval(otherInterval);
                        $('userNotifyPlay').style.display = 'none';
                    }, 100);
                }, inputInternal.currentQuestionTime * 1000);
            }, 400);
        }
    } else if (inputInternal.hasOwnProperty('gameFinish')) {
        $('gameFinishNotify').style.display = 'block';
        gameStateStudent.timeLeft = inputInternal.timeTillEnd;
        $('gameFinishNotify').textContent = `The game will end in ${gameStateStudent.timeLeft}s`;
        let start = Date.now();
        let init = gameStateStudent.timeLeft;
        finishUpInterval = window.setInterval(() => {
            let delta = (Date.now() - start) / 1000;
            let internal = (init as number) - delta;
            if (internal < 0) {
                internal = 0;
            }
            gameStateStudent.timeLeft = internal;
            $('gameFinishNotify').textContent = `The game will end in ${Math.floor(gameStateStudent.timeLeft)}s`;
        }, 100);
        resettableTime3 = window.setTimeout(() => {
            clearInterval(finishUpInterval);
            $('gameFinishNotify').style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                $('gameFinishNotify').style.display = 'none';
                $('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
            }, 300);
        }, (gameStateStudent.timeLeft as number) * 1000);
    } else if (inputInternal.hasOwnProperty('gameEnd')) {
        $('gameResults').style.display = 'block';
        setCharImage('firstPlace', inputInternal.CharacterConfig1);
        setCharImage('secondPlace', inputInternal.CharacterConfig2);
        setCharImage('thirdPlace', inputInternal.CharacterConfig3);
        $('userEndPlaceNumber').textContent = inputInternal.userPlace;
        $('currentUserEndPlaceSup').textContent = ordinalSuffix(inputInternal.userPlace);
        setTimeout(() => {
            $('errorMessageB').style.display = 'none';
        }, 500);
        resettableTime4 = window.setTimeout(() => {
            $('imageObjectContainer').style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                $('imageObjectContainer').style.display = 'none';
                $('currentUserEndPlace').style.display = 'block';
                setTimeout(() => {
                    $('currentUserEndPlace').classList.remove('titleTransitionBack');
                    $('currentUserEndPlace').classList.add('btnTransitionA');
                    setTimeout(() => {
                        $('currentUserEndPlace').style.display = 'none';
                        kickPlayer(true, 'Game Has Ended');
                    }, 300);
                }, 5000);
            }, 200);
        }, 7000);
    }
}

function kickPlayer(special: boolean = false, specialText: string = 'Kicked From Game') {
    if (special) {
        $('errorActual').textContent = specialText;
        $('errorMessageA').style.display = 'block';
        setTimeout(() => {
            $('loader-1').style.display = 'none';
            $('errorMessageA').style.display = 'none';
        }, 1000);
        $('gameStartScreenStudent').style.display = 'none';
        goBack();
    }
    clearInterval(timerInterval);
    clearTimeout(resettableTime);
    clearTimeout(resettableTime2);
    clearTimeout(resettableTime3);
    clearTimeout(resettableTime4);
    $('currentUserEndPlace').style.display = 'none';
    $('gameResults').style.display = 'none';
    $('currentUserEndPlace').classList.add('titleTransitionBack');
    $('currentUserEndPlace').classList.remove('btnTransitionA');
    $('imageObjectContainer').style.display = 'block';
    $('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
    $('titleButtonStudent').style.display = 'block';
    $('studentShortAnswer').classList.remove('transitionQuestionC');
    $('titleButtonStudent').classList.remove('transitionQuestionC');
    $('studentShortAnswer').style.display = 'block';
    $('imageObjectContainer').style.animation = '';
    $('titleButtonStudent').style.display = 'block';
    Array.from($('studentAnswersFlex').children).forEach((object) => {
        object.classList.remove('transitionQuestionB');
        object.style.display = 'block';
        object.classList.remove('transitionQuestionC');
    });
    $('errorMessageB').style.display = 'none';
    $('userNotifyPlay').style.display = 'none';
    $('studentPlayScreen').style.display = 'none';
    $('mainLoader').classList.remove('loader--active');
    $('title').style.display = 'block';
    $('gameFinishNotify').style.display = 'none';
    clearInterval(finishUpInterval);
    gameStateStudent = {
        currentQuestion: 0,
        totalQuestions: 0,
        gameErrorState: false,
        timeLeft: false,
        currentQuestionData: {
            question: '',
            answers: [],
            timeLimit: 0,
        },
    };
}

function setQuestion() {
    if (!gameStateStudent) return;
    else {
        updateStudentLocation(gameStateStudent.currentQuestion);
    }
    $('studentAnswersFlex').style.display = 'flex';
    $('titleButtonStudent').firstElementChild!.textContent = decodeURI(gameStateStudent.currentQuestionData.question);
    let options = $('studentAnswersFlex').children;
    for (let i = 0; i < options.length; i++) {
        if (!gameStateStudent.currentQuestionData.answers[i]) {
            options[i].style.display = 'none';
        } else {
            options[i].disabled = false;
            options[i].style.display = 'block';
            options[i].firstElementChild!.textContent = decodeURI(gameStateStudent.currentQuestionData.answers[i]);
        }
    }
    if (gameStateStudent.currentQuestionData.answers.join('').length == 0) {
        $('resettableCharLimited').textContent = '0/180';
        $('studentAnswersFlex').style.display = 'none';
        $('studentShortAnswer').style.display = 'block';
        $('studentShortAnswerText').textContent = null;
        $('studentShortAnswerText').classList.remove('contentEditableDisabled');
        $('studentShortAnswerText').contentEditable = 'true';
        $('shortAnswerSubmitButton').disabled = false;
    } else {
        $('studentShortAnswer').style.display = 'none';
    }
    if (((gameStateStudent.currentQuestionData.timeLimit as unknown) as boolean) == false) {
        $('timeLeftCounter').style.display = 'none';
    } else {
        $('timeLeftCounter').style.display = 'block';
        $('timeLeftCounter').textContent = `(Time Left: ${gameStateStudent.currentQuestionData.timeLimit}s)`;
        let start = Date.now();
        let init = gameStateStudent.currentQuestionData.timeLimit;
        timerInterval = window.setInterval(() => {
            let delta = (Date.now() - start) / 1000;
            gameStateStudent.currentQuestionData.timeLimit = init - delta;
            if (gameStateStudent.currentQuestionData.timeLimit < 0 && gameStateStudent.currentQuestionData.timeLimit > -999) {
                $('timeLeftCounter').textContent = `(Time Penalty: ${Math.abs(Math.floor(gameStateStudent.currentQuestionData.timeLimit))}s)`;
            } else if (gameStateStudent.currentQuestionData.timeLimit < -999) {
                $('timeLeftCounter').textContent = `(You're very slow)`;
            } else {
                $('timeLeftCounter').textContent = `(Time Left: ${Math.floor(gameStateStudent.currentQuestionData.timeLimit)}s)`;
            }
        }, 10);
    }
}

function updateStudentLocation(studentLocation: number) {
    let internalPercentage = mathClamp((studentLocation * 114) / window.innerWidth, 0, 1);
    if (internalPercentage > 0.75) {
        bottomBarOffset -= 114;
    }
    studentLocation = studentLocation - Math.abs((bottomBarOffset - 15) / 114);
    root.style.setProperty('--questionOffset', studentLocation.toString());
    root.style.setProperty('--bottomBarOffset', bottomBarOffset + 'px');
}

function answerQuestion(answer: string) {
    console.log(answer);
}

function submitMultipleChoice(event: string) {
    let response = event.charAt(event.length - 1);
    answerQuestion(response);
    clearInterval(timerInterval);
    Array.from($('studentAnswersFlex').children).forEach((object, index) => {
        object.disabled = true;
        if ((index + 1).toString() == response) {
            while (object.firstElementChild!.firstChild) object.firstElementChild!.removeChild(object.firstElementChild!.lastChild!);
            object.firstElementChild!.appendChild($('svgLoader').content.cloneNode(true));
        }
    });
}

function submitShortAnswer() {
    $('studentShortAnswerText').contentEditable = 'false';
    $('shortAnswerSubmitButton').disabled = true;
    $('studentShortAnswerText').classList.add('contentEditableDisabled');
    answerQuestion($('studentShortAnswerText').textContent!);
    clearInterval(timerInterval);
}

window.addEventListener('resize', () => {
    if (gameStateStudent) {
        bottomBarOffset = 15;
        for (let i = 0; i <= gameStateStudent.currentQuestion; i++) {
            updateStudentLocation(i);
        }
    }
});
