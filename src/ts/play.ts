/**
 * @license mamkLearn Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */
import { $, mathClamp, getID, ordinalSuffix, clearChildren, call, getCurrentDate } from './utils';
import { setCharImage, goBack } from './app';
import { networkManager } from './networkEngine';

interface studentQuestion {
    questionName: string;
    answers: string[];
    startTime: number;
    endTime: number;
}

const root = document.documentElement;
let [otherInterval, timerInterval, finishUpInterval, bottomBarOffset, currentQuestion, totalQuestions]: number[] = [];
let isGameLive: boolean;
let timeouts: number[] = [];
let hasGameEnded = false;

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
        if (event.key == 'Enter') {
            submitShortAnswer();
        }
    },
};

export const initEvents = () => {
    window.clickEvents = { ...window.clickEvents, ...clickListeners };
    window.clickIncludesEvents = { ...window.clickIncludesEvents, ...clickIncludesListeners };
    window.keyboardIncludesEvents = { ...window.keyboardIncludesEvents, ...keyboardIncludesListeners };
};

export const initQuestionHandler = (questionAmount: number) => {
    networkManager.handleGameState(window.currentGameState.location, (val) => {
        if (val && val.gameEnd) {
            gameFinish((val.gameEnd + 15000 - getCurrentDate()) / 1000);
        }
    });
    networkManager.studentListener(
        (questionNumber, question, isCorrect) => {
            currentQuestion = questionNumber;
            totalQuestions = questionAmount;
            bottomBarOffset = 15;
            for (let i = 0; i <= currentQuestion; i++) {
                updateStudentLocation(i);
            }
            isGameLive = true;
            if (isCorrect) {
                kickPlayer();
                clearInterval(timerInterval);
                clearInterval(finishUpInterval);
                clearInterval(otherInterval);
            }
            setCharImage('player', window.currentUserConfig);
            let studentRaceBoxNumbers = document.createDocumentFragment();
            for (let i = 1; i <= totalQuestions; i++) {
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
            if (questionNumber > totalQuestions && isCorrect) {
                updateStudentLocation(currentQuestion);
                $('errorMessageB').style.display = 'block';
                return;
            }
            $('mainLoader').classList.remove('loader--active');
            $('title').style.display = 'none';
            $('studentPlayScreen').style.display = 'block';
            setQuestion(question);
            setTimeout(() => {
                $('loader-1').style.display = 'none';
                $('errorMessageA').style.display = 'none';
            }, 1000);
        },
        (questionNumber, question) => {
            currentQuestion = questionNumber;
            clearInterval(timerInterval);
            clearInterval(otherInterval);
            if (questionNumber <= totalQuestions) {
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
                    setQuestion(question);
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
            } else {
                updateStudentLocation(currentQuestion);
                $('errorMessageB').style.display = 'block';
            }
        },
        (question, endTime) => {
            questionValidationFailed(question, endTime);
        }
    );
    networkManager.onGameEnd((input) => {
        hasGameEnded = true;
        let firstThreePlayers: number[][] = [];
        Object.values(input).forEach((element) => {
            if (element.place <= 3) {
                firstThreePlayers[element.place - 1] = element.playerConfig;
            }
        });
        gameEnd(firstThreePlayers[0], firstThreePlayers[1], firstThreePlayers[2], input[networkManager.authInstance.currentUser!.uid].place);
    });
};

networkManager.quitQuizStudent = () => {
    if (!hasGameEnded) {
        kickPlayer(true);
    }
};

function questionValidationFailed(question: studentQuestion, endTime: number) {
    clearInterval(timerInterval);
    clearInterval(otherInterval);
    let start = Date.now();
    const timeToWait = (endTime - getCurrentDate()) / 1000;
    otherInterval = window.setInterval(() => {
        let delta = (Date.now() - start) / 1000;
        let internal = timeToWait - delta;
        if (internal < 0) {
            internal = 0;
        }
        $('mistakeQuestion').textContent = `You can try again in ${Math.ceil(internal)} seconds`;
    }, 100);
    Array.from($('studentAnswersFlex').children).forEach((object) => {
        object.classList.add('transitionQuestionB');
        setTimeout(() => {
            object.style.display = 'none';
            while (object.firstElementChild!.firstChild) object.firstElementChild!.removeChild(object.firstElementChild!.lastChild!);
            object.disabled = false;
            object.classList.remove('transitionQuestionB');
            timeouts[0] = window.setTimeout(() => {
                object.classList.add('transitionQuestionC');
                setTimeout(() => {
                    object.classList.remove('transitionQuestionC');
                }, 400);
            }, timeToWait * 1000);
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
        timeouts[1] = window.setTimeout(() => {
            $('userNotifyPlay').classList.add('fadeOutThingy');
            $('titleButtonStudent').classList.add('transitionQuestionC');
            $('studentShortAnswer').classList.add('transitionQuestionC');
            $('titleButtonStudent').style.display = 'block';
            setQuestion(question);
            setTimeout(() => {
                $('studentShortAnswer').classList.remove('transitionQuestionC');
                $('titleButtonStudent').classList.remove('transitionQuestionC');
                // Layout engine thinks that there's more stuff to the right while there is nothing
                // This scuffed hack should take care of that
                const scuffedElement = document.createElement('div');
                scuffedElement.style.visibility = 'hidden';
                $('studentPlayScreen').appendChild(scuffedElement);
                setTimeout(() => {
                    $('studentPlayScreen').lastElementChild!.remove();
                }, 3000);
            }, 400);
            setTimeout(() => {
                clearInterval(otherInterval);
                $('userNotifyPlay').style.display = 'none';
            }, 100);
        }, timeToWait * 1000);
    }, 400);
}

function gameFinish(timeLeft: number) {
    $('gameFinishNotify').style.display = 'block';
    $('gameFinishNotify').textContent = `The game will end in ${timeLeft}s`;
    let start = Date.now();
    let init = timeLeft;
    finishUpInterval = window.setInterval(() => {
        let delta = (Date.now() - start) / 1000;
        let internal = init - delta;
        if (internal < 0) {
            internal = 0;
        }
        $('gameFinishNotify').textContent = `The game will end in ${Math.floor(internal)}s`;
    }, 100);
    timeouts[2] = window.setTimeout(() => {
        clearInterval(finishUpInterval);
        $('gameFinishNotify').style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            $('gameFinishNotify').style.display = 'none';
            $('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
        }, 300);
    }, (timeLeft as number) * 1000);
}

function gameEnd(firstPlace: number[], secondPlace: number[], thirdPlace: number[], yourPlace: number) {
    clearInterval(timerInterval);
    clearInterval(otherInterval);
    $('gameResults').style.display = 'block';
    setCharImage('firstPlace', firstPlace);
    secondPlace ? setCharImage('secondPlace', secondPlace) : setCharImage('secondPlace', [1, 2, 2, 2, -1]);
    thirdPlace ? setCharImage('thirdPlace', thirdPlace) : setCharImage('thirdPlace', [1, 2, 2, 2, -1]);
    $('userEndPlaceNumber').textContent = yourPlace.toString();
    $('currentUserEndPlaceSup').textContent = ordinalSuffix(yourPlace);
    setTimeout(() => {
        $('gameFinishNotify').style.display = 'none';
        clearInterval(finishUpInterval);
        $('errorMessageB').style.display = 'none';
        clearTimeout(timeouts[2]);
    }, 500);
    timeouts[3] = window.setTimeout(() => {
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

function kickPlayer(special: boolean = false, specialText: string = 'Kicked From Game') {
    hasGameEnded = false;
    if (special) {
        $('errorActual').textContent = specialText;
        $('errorMessageA').style.display = 'block';
        setTimeout(() => {
            $('loader-1').style.display = 'none';
            $('errorMessageA').style.display = 'none';
        }, 1000);
        $('gameStartScreenStudent').style.display = 'none';
        call(networkManager.studentPlayListener);
        call(networkManager.unsubHandler);
        isGameLive = false;
        goBack();
        clearTimeout(timeouts[3]);
        $('currentUserEndPlace').style.display = 'none';
    }
    clearInterval(timerInterval);
    for (let i = 0; i < 3; i++) {
        clearTimeout(timeouts[i]);
    }
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
}

function setQuestion(question: studentQuestion) {
    if (!isGameLive) return;
    else {
        updateStudentLocation(currentQuestion);
    }
    $('studentAnswersFlex').style.display = 'flex';
    $('titleButtonStudent').firstElementChild!.textContent = question.questionName;
    const options = $('studentAnswersFlex').children;
    for (let i = 0; i < 4; i++) {
        (options[i] as HTMLElement).blur();
        options[i].style.minHeight = '';

        if (!question.answers || !question.answers[i]) {
            options[i].style.display = 'none';
        } else {
            options[i].disabled = false;
            options[i].style.display = 'block';
            options[i].firstElementChild!.textContent = question.answers[i];
        }
    }
    if (!question.answers || question.answers.join('').length == 0) {
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
    if (question.startTime == -1) {
        $('timeLeftCounter').style.display = 'none';
    } else {
        const timeLimit = (question.endTime - getCurrentDate()) / 1000;
        $('timeLeftCounter').style.display = 'block';
        $('timeLeftCounter').textContent = `(Time Left: ${timeLimit}s)`;
        let start = Date.now();
        timerInterval = window.setInterval(() => {
            let delta = (Date.now() - start) / 1000;
            const timeLeft = timeLimit - delta;
            if (timeLeft < 0 && timeLeft > -999) {
                $('timeLeftCounter').textContent = `(Time Penalty: ${Math.abs(Math.floor(timeLeft))}s)`;
            } else if (timeLeft < -999) {
                $('timeLeftCounter').textContent = `(You're very slow)`;
            } else {
                $('timeLeftCounter').textContent = `(Time Left: ${Math.floor(timeLeft)}s)`;
            }
        }, 10);
    }
}

function updateStudentLocation(studentLocation: number) {
    studentLocation = studentLocation - 1;
    let internalPercentage = mathClamp((studentLocation * 114) / window.innerWidth, 0, 1);
    if (internalPercentage > 0.75) {
        bottomBarOffset -= 114;
    }
    studentLocation = studentLocation - Math.abs((bottomBarOffset - 15) / 114);
    root.style.setProperty('--questionOffset', studentLocation.toString());
    root.style.setProperty('--bottomBarOffset', bottomBarOffset + 'px');
}

function answerQuestion(answer: string) {
    networkManager.submitQuestion(answer);
}

function submitMultipleChoice(event: string) {
    let response = event.charAt(event.length - 1);
    answerQuestion(response);
    clearInterval(timerInterval);
    Array.from($('studentAnswersFlex').children).forEach((object, index) => {
        object.disabled = true;
        if ((index + 1).toString() == response) {
            object.style.minHeight = object.clientHeight + 'px';
            while (object.firstElementChild!.firstChild) object.firstElementChild!.removeChild(object.firstElementChild!.lastChild!);
            object.firstElementChild!.appendChild($('svgLoader').content.cloneNode(true));
        }
    });
}

function submitShortAnswer() {
    const answerText = $('studentShortAnswerText');
    if (answerText.textContent && !/^\s*$/.test(answerText.textContent)) {
        answerText.contentEditable = 'false';
        $('shortAnswerSubmitButton').disabled = true;
        answerText.classList.add('contentEditableDisabled');
        answerQuestion(answerText.textContent!);
        clearInterval(timerInterval);
    }
}

window.addEventListener('resize', () => {
    if (isGameLive) {
        bottomBarOffset = 15;
        for (let i = 0; i <= currentQuestion; i++) {
            updateStudentLocation(i);
        }
    }
});
