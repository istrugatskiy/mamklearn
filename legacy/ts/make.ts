// Contains code related to making quizzes
import '../css/make.css';
import { dragula } from './dragula';
import { $, characterCount, deepEqual, createTemplate, setTitle, getID, AudioManager, download, call } from './old-utils';
import { setCharImage } from './app';
import { getDatabase, ref, set, Unsubscribe } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { globals } from './globals';
import { getQuizData, networkKickPlayer, setQuiz, setQuizList, startGame } from './networkEngine';
import { DragulaJS } from './dragulaTypes';

let editState = false;
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
let quizObject2: { [key: string]: quizObject } = {};
const quizObject = {
    quizID: '',
    quizName: '',
    isShared: false,
    questionObjects: [],
};
let drake: DragulaJS;
let currentQuizEdit: string;
let iconIterate = 0;
let activeArea: number | null;
let highestQuestion = 0;
let tempQuiz: quizObject;
let allowState2 = true;
let quizList: { [key: string]: string } = {};
let checkOnce = true;
let mainAudio: AudioManager;
let clearableTimeout: number;
let clearableTimeout2: number;
let otherInterval: number;
let finishUpInterval: number;
const database = getDatabase();
const auth = getAuth();
let unsubHandler: Unsubscribe;
let leaderboardHandler: Unsubscribe;
let otherTimeout: number;
let hasGameEnded = false;

const clickListeners = {
    deleteQuizConfirm: () => {
        deleteQuizConfirm();
    },
    deleteQuiz: () => {
        deleteQuiz();
    },
    editQuiz: () => {
        editQuiz();
    },
    addQuestionButton: () => {
        addQuestion();
    },
    playQuiz: () => {
        playQuiz();
    },
    doneButtonA: () => {
        doneButtonA();
    },
    shareQuiz: () => {
        shareQuiz();
    },
    backButtonEditQuiz: () => {
        exitModalPopupF(true);
    },
    backButtonC: () => {
        goBackMakeA();
    },
    backButtonC2: () => {
        goBackMakeA();
    },
    copyShareLink: () => {
        copyShareLink();
    },
    'modal-bg': () => {
        exitModalPopupTemplate('createQuizMenu');
    },
    backButtonZ: () => {
        exitModalPopupTemplate('createQuizMenu');
    },
    backButtonY: () => {
        exitModalPopupTemplate('manageQuizMenu');
    },
    backButtonShareQuiz: () => {
        backButtonShareQuiz();
    },
    createButtonA: () => {
        createQuiz();
    },
    createButtonA2: () => {
        createQuiz();
    },
    backButtonDeleteConfirm: () => {
        exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm');
    },
    exportQuizButton: () => {
        parseActiveQuiz();
        download(`${tempQuiz.quizName}-exported.json`, JSON.stringify(tempQuiz, null, 4));
    },
    actuallyShareQuiz: () => {
        actuallyShareQuiz();
    },
};

const clickIncludesListeners = {
    collapseSubArea: (event: Event) => {
        collapseSubArea(getID(event) as unknown as number);
    },
    deleteQuestion: (event: Event) => {
        deleteQuestion(getID(event));
    },
    shortAnswerToggle: (event: Event) => {
        shortAnswerToggle(getID(event));
    },
    toggleTime: (event: Event) => {
        toggleTime(getID(event));
    },
    quizID_: (event: Event) => {
        quizButtonOnClick(event);
    },
    isCorrectQuestion: (event: Event) => {
        const target = (event.target! as HTMLElement).id;
        $(`actualIsCorrectQuestion${getID(target)}`).checked = !$(`actualIsCorrectQuestion${getID(target)}`).checked;
    },
};

const submitListeners = {
    editQuizForm: () => {
        editQuizForm();
    },
    quizCreateForm: () => {
        createNewQuiz();
    },
};

const keyboardIncludesListeners = {
    deleteQuestion: (event: Event) => {
        deleteQuestion(getID(event));
    },
    keyboardNavAnswer: (event: Event) => {
        shortAnswerToggle(getID(event));
    },
    keyboardNavTime: (event: Event) => {
        toggleTime(getID(event));
    },
    isCorrectQuestion: (event: Event) => {
        const target = (event.target! as HTMLElement).id;
        $(`actualIsCorrectQuestion${getID(target)}`).checked = !$(`actualIsCorrectQuestion${getID(target)}`).checked;
    },
    studentCharacterImage: (event: Event) => {
        const studentID = (event.target as HTMLElement).id.replace('studentCharacterImage_', '');
        (event.target as HTMLElement).disabled = true;
        (event.target as HTMLElement).tabIndex = -1;
        (event.target as HTMLElement).style.pointerEvents = 'none';
        networkKickPlayer(studentID);
    },
};

export const initEvents = () => {
    globals.clickEvents = { ...globals.clickEvents, ...clickListeners };
    globals.clickIncludesEvents = { ...globals.clickIncludesEvents, ...clickIncludesListeners };
    globals.submitEvents = { ...globals.submitEvents, ...submitListeners };
    globals.keyboardIncludesEvents = { ...globals.keyboardIncludesEvents, ...keyboardIncludesListeners };
};

window.addEventListener('beforeunload', (event) => {
    if (editState) {
        event.preventDefault();
        event.returnValue = ' ';
    }
});

function createQuiz() {
    if (checkOnce) {
        document.querySelector('.createButtonA')!.disabled = true;
        $('QuizName').disabled = false;
        globals.clickEvents['modal-bg'] = () => {
            exitModalPopupTemplate('createQuizMenu');
        };
        $('submitQuizID').disabled = false;
        $('QuizName').value = '';
        document.querySelector('.createButtonA')!.classList.add('btnTransitionA');
        document.querySelector('.backButtonC')!.disabled = true;
        document.querySelector('.backButtonC')!.classList.add('btnTransitionA');
        $('submitQuizID').textContent = 'Create';
        $('modal-bg').style.animation = 'fadeIn 0.5s';
        $('modal-bg').style.display = 'block';
        $('homeText2').classList.add('btnTransitionA');
        $('createQuizMenu').style.animation = 'modalPopin 0.3s';
        $('manageQuizMenu').style.display = 'none';
        $('createQuizMenu').style.display = 'block';
        $('modal-popupA').style.display = 'block';
        $('modal-popupA').classList.add('modal-popupActive');
        if (Object.keys(quizList).length > 0) {
            for (let key in quizList) {
                if (quizList[key]) {
                    $(key).classList.add('btnTransitionA');
                }
            }
        }
    }
}

function goBackMakeA() {
    document.querySelector('.backButtonC')!.disabled = true;
    $('title').classList.add('handleOutTransition');
    setTimeout(() => {
        $('title').classList.remove('handleOutTransition');
        $('title').replaceChildren();
        setTitle('homeScreen');
        $('title').style.height = '800px';
        $('title').style.top = '15%';
        setCharImage('user-char', globals.currentUserConfig);
    }, 300);
}

function createNewQuiz() {
    checkOnce = false;
    let button = $('submitQuizID');
    $('QuizName').disabled = true;
    const quizName = $('QuizName').value;
    button.disabled = true;
    button.textContent = '';
    createTemplate('svgLoader', button.id);
    quizList[`quizID_${Object.keys(quizList).length}`] = quizName;
    setQuizList(quizName, () => {
        setTimeout(() => {
            checkOnce = true;
            exitModalPopupTemplate('createQuizMenu');
        }, 300);
    });
}

function backButtonShareQuiz() {
    $('actuallyShareQuiz').classList.remove('btnTransitionA');
    $('actuallyShareQuiz').style.display = 'inline-block';
    $('whenActuallyShared').style.display = 'none';
    exitModalPopupTemplate('shareQuizMenu', 'shareQuizMenu');
}

function addQuestion() {
    addquestionToDOM();
    reorderProper();
    $(`collapseSubArea${highestQuestion}`).focus();
}

function doneButtonA() {
    if (allowState2) {
        $('modal-popupB').style.animation = 'modalPopout 0.5s';
        $('editQuizMenu').style.animation = 'fadein 0.5s';
        $('editQuizMenu').style.visibility = 'visible';
        $('saveQuizButton').disabled = false;
        $('backButtonEditQuiz').disabled = false;
        $('quizNameUpdate').disabled = false;
        $('addQuestionButton').disabled = false;
        $('exportQuizButton').disabled = false;
        reorderProper();
        setTimeout(() => {
            ($('modal-popupB') as HTMLDivElement).removeAttribute('style');
            $('modal-popupB').style.visibility = 'none';
            $('modal-popupA').style.pointerEvents = 'all';
        }, 500);
    }
}

function collapseSubArea(a: number) {
    const area = $(`collapseSubArea${a}`);
    const objm = $(`collapsableContent${a}`);
    area.classList.toggle('arrowBRight');
    area.classList.toggle('arrowBDown');
    objm.classList.toggle('contentA1');
    objm.classList.toggle('contentA2');
    if (activeArea && activeArea !== a) {
        let area = $(`collapseSubArea${activeArea}`);
        let objm = $(`collapsableContent${activeArea}`);
        area.classList.add('arrowBRight');
        area.classList.remove('arrowBDown');
        objm.classList.add('contentA2');
        objm.classList.remove('contentA1');
    }
    activeArea = a;
}

function collapseAllArea() {
    if (activeArea && $(`collapseSubArea${activeArea}`) != null) {
        let area = $(`collapseSubArea${activeArea}`);
        let objm = $(`collapsableContent${activeArea}`);
        area.classList.add('arrowBRight');
        area.classList.remove('arrowBDown');
        objm.classList.add('contentA2');
        objm.classList.remove('contentA1');
        activeArea = null;
    }
}

function deleteQuestion(a: string) {
    collapseAllArea();
    $(`draggableQuestion${a}`).style.pointerEvents = 'none';
    $(`draggableQuestion${a}`).classList.add('btnTransitionA');
    setTimeout(() => {
        $(`draggableQuestion${a}`).remove();
        reorderProper();
    }, 300);
}

function reorderProper() {
    let test = 0;
    for (let i = 0; i <= $('draggableDiv').children.length - 1; i++) {
        $('draggableDiv').children[i]!.firstElementChild!.children[1].textContent = `Question ${i + 1}:`;
        test = i;
    }
    if (test >= 24) {
        $('addQuestionButton').disabled = true;
        $('addQuestionButton').textContent = '25/25 questions';
        $('addQuestionButton').style.cursor = 'no-drop';
    } else {
        $('addQuestionButton').disabled = false;
        $('addQuestionButton').textContent = 'add question...';
        $('addQuestionButton').style.cursor = 'pointer';
    }
}

function shortAnswerToggle(endMe: string | number) {
    $(`actualShortAnswerToggle${endMe}`).checked = !$(`actualShortAnswerToggle${endMe}`).checked;
    $(`answerContainerObject${endMe}`).classList.toggle('shortAnswerEditorStyles');
    $(`collapsableContent${endMe}`).classList.toggle('noSpaceEditor');
}

function toggleTime(order: string | number) {
    $(`Question${order}Time`).classList.toggle('displayTimeLimit');
    $(`actualToggleTime${order}`).checked = !$(`actualToggleTime${order}`).checked;
}

function parseActiveQuiz() {
    tempQuiz = JSON.parse(JSON.stringify(quizObject));
    tempQuiz.quizName = $('quizNameUpdate').value;
    tempQuiz.quizID = currentQuizEdit;
    quizObject2[currentQuizEdit].quizID = currentQuizEdit;
    tempQuiz.isShared = quizObject2[currentQuizEdit].isShared;
    if ($('draggableDiv').firstElementChild) {
        let quizDoc = Array.from($('draggableDiv').children);
        quizDoc.forEach((object) => {
            let timeLimit: string | null | boolean = false;
            if (object.children[1].children[4].children[0].children[0].checked) {
                timeLimit = object.children[1].children[4].children[2].textContent;
            }
            tempQuiz.questionObjects.push({
                questionName: object.children[1].children[0].textContent!,
                shortAnswer: object.children[1].children[3].children[0].children[0].checked,
                timeLimit: timeLimit!,
                Answers: [
                    {
                        answer: object.children[1].children[5].children[0].children[0].textContent,
                        correct: object.children[1].children[5].children[0].children[2].children[0].checked,
                    },
                    {
                        answer: object.children[1].children[5].children[1].children[0].textContent,
                        correct: object.children[1].children[5].children[1].children[2].children[0].checked,
                    },
                    {
                        answer: object.children[1].children[5].children[2].children[0].textContent,
                        correct: object.children[1].children[5].children[2].children[2].children[0].checked,
                    },
                    {
                        answer: object.children[1].children[5].children[3].children[0].textContent,
                        correct: object.children[1].children[5].children[3].children[2].children[0].checked,
                    },
                ],
            });
        });
    }
}

// Verify that question field is filled; done
// Verify that we have any questions at all; done
// Verify that no field goes over it's character limit; done
// Verify that time limit is at least 5 or more; done
// Verify that at least one possible choice is correct; done
// Verify that at least two answer fields are filled out; done
const verifyQuiz = () => {
    let quizParseError = [];
    let finalResult = document.createDocumentFragment();
    if (tempQuiz.questionObjects.length === 0) {
        quizParseError.push('No questions exist');
    } else {
        let nullSpace01: number[] = [];
        let timeLimitViolation: number[] = [];
        let answerError0: number[] = [];
        let answerError1: number[] = [];
        let answerError2: number[] = [];
        tempQuiz.questionObjects.forEach((question, index) => {
            // Add one to index because questions don't start at zero.
            index++;
            if (/^$/.test(question.questionName)) {
                nullSpace01.push(index);
            }
            if (!question.shortAnswer) {
                if (!question.Answers[0].answer || !question.Answers[1].answer) {
                    answerError0.push(index);
                }
                if (!question.Answers[0].correct && !question.Answers[1].correct) {
                    if (!question.Answers[2].correct && !question.Answers[3].correct) {
                        answerError1.push(index);
                    }
                }
                if (!question.Answers[2].answer || !question.Answers[3].answer) {
                    if (question.Answers[2].correct && !question.Answers[2].answer) {
                        answerError2.push(index);
                    } else if (question.Answers[3].correct && !question.Answers[3].answer) {
                        answerError2.push(index);
                    }
                }
            }
            if (typeof question.timeLimit != 'boolean') {
                if (isNaN(parseInt(question.timeLimit)) || parseInt(question.timeLimit) < 5) {
                    timeLimitViolation.push(index);
                }
            }
        });

        quizParseError.push(questionErrorParse(nullSpace01, 'has an empty question field', 'have an empty question field'));
        quizParseError.push(questionErrorParse(timeLimitViolation, 'has an invalid time limit or a time limit less than 5', 'have an invalid time limit or a time limit less than 5'));
        quizParseError.push(questionErrorParse(answerError0, 'does not have the first two answer fields filled out', 'do not have the first two answer fields filled out'));
        quizParseError.push(questionErrorParse(answerError1, 'does not have a correct option', 'do not have a correct option'));
        quizParseError.push(questionErrorParse(answerError2, 'has a correct option which corresponds to an empty field', 'have a correct option which corresponds to an empty field'));
    }
    if (quizParseError.join('').length !== 0) {
        quizParseError.forEach((error) => {
            if (error != null) {
                finalResult.appendChild(document.createElement('li'));
                finalResult!.lastElementChild!.textContent = error;
                finalResult!.lastElementChild!.classList.add('innerError');
            }
        });
        $('innerError3').replaceChildren();
        $('innerError3').appendChild(finalResult);
        return false;
    } else {
        return true;
    }
};

function exitModalPopupF(promptUser: boolean) {
    if (promptUser) {
        parseActiveQuiz();
        if (deepEqual(tempQuiz, quizObject2[currentQuizEdit])) {
            exitModalPopupF(false);
        } else if (confirm('Are you sure you want to go back? Any unsaved changes will be lost!')) {
            exitModalPopupF(false);
        }
    } else {
        checkOnce = false;
        $('modal-bg').style.animation = 'fadeOut 0.5s';
        $('editQuizMenu').style.animation = 'modalPopout 0.3s';
        setTimeout(() => {
            editState = false;
            ($('editQuizMenu') as HTMLDivElement).removeAttribute('style');
            $('modal-bg').style.display = 'none';
            $('editQuizMenu').style.display = 'none';
            $('saveQuizButton').disabled = false;
            $('backButtonEditQuiz').disabled = false;
            $('quizNameUpdate').disabled = false;
            $('addQuestionButton').disabled = false;
            $('exportQuizButton').disabled = false;
            $('modal-popupA').style.pointerEvents = 'all';
            $('saveQuizButton').replaceChildren();
            $('saveQuizButton').textContent = 'Save';
            $('draggableDiv').replaceChildren();
            drake.destroy();
            highestQuestion = 0;
            checkOnce = true;
        }, 500);
        setTimeout(() => {
            $('modal-popupA').style.display = 'none';
        }, 300);
        setTitle('makeMenu');
        addQuiz();
    }
}

function addquestionToDOM() {
    highestQuestion++;
    createTemplate('templateQuestion', 'draggableDiv', '${highestQuestion}', highestQuestion);
}

export function addQuiz() {
    if (Object.keys(quizList).length > 0) {
        // Generates the button object using the DOM API
        let quizObject = document.createDocumentFragment();
        let button = document.createElement('button');
        button.classList.add('button', 'titleTransitionBack', 'quizActionButton', 'createQuizButton');
        let image = document.createElement('img');
        image.width = 250;
        button.appendChild(image);
        button.appendChild(document.createElement('br'));
        quizObject.appendChild(button);

        let renderableQuizObject = document.createDocumentFragment();
        for (let key in quizList) {
            if (quizList[key]) {
                let internalObject = quizObject.cloneNode(true);
                (internalObject as HTMLElement).firstElementChild!.id = key;
                ((internalObject as HTMLElement).firstElementChild!.firstElementChild! as HTMLImageElement).src = `img/qIcon-${(iconIterate % 4).toString()}.svg`;
                ((internalObject as HTMLElement).firstElementChild!.firstElementChild! as HTMLImageElement).alt = 'quiz icon';
                (internalObject as HTMLElement).firstElementChild!.appendChild(document.createTextNode(quizList[key]));
                renderableQuizObject.appendChild(internalObject);
                iconIterate++;
            }
        }
        $('makeDiv').appendChild(renderableQuizObject);
        // End DOM generation
        // Imagine using React like some sort of loser and having this handled for you, or maybe even innerHTML, like that's a thing I could have used
        iconIterate = 0;
        document.querySelector('.backButtonC')!.remove();
        $('removeButton').remove();
        createTemplate('makeDivCreateQuizButton', 'makeDiv');
        createTemplate('makeDivBackButton', 'makeDiv');
        $('makeDiv').style.textAlign = 'center';
    }
}

globals.quitQuizTeacher = () => {
    if (!hasGameEnded) {
        quitQuizTeacher();
    }
};

function quitQuizTeacher() {
    hasGameEnded = false;
    clearInterval(finishUpInterval);
    clearInterval(otherTimeout);
    $('liveLeaderboards').style.display = 'none';
    clearTimeout(clearableTimeout);
    clearTimeout(clearableTimeout2);
    $('errorActual').textContent = 'Game Has Ended';
    $('errorMessageA').style.display = 'block';
    $('gameFinishNotify').style.display = 'none';
    $('teacher-play-intro').replaceChildren();
    call(unsubHandler);
    call(leaderboardHandler);
    clearTimeout(otherInterval);
    setTimeout(() => {
        $('loader-1').style.display = 'none';
        $('errorMessageA').style.display = 'none';
    }, 1000);
    mainAudio.clearAll();
    $('liveLeaderboards').style.display = 'none';
    $('title').style.display = 'block';
    goBackMakeA();
}

function quizButtonOnClick(event: Event) {
    const eventTarget = (event.target! as HTMLElement).id;
    if (checkOnce) {
        document.querySelector('.createButtonA')!.disabled = true;
        globals.clickEvents['modal-bg'] = () => {
            exitModalPopupTemplate('manageQuizMenu');
        };
        $('QuizName').disabled = false;
        $('submitQuizID').disabled = false;
        $('QuizName').value = '';
        document.querySelector('.createButtonA')!.classList.add('btnTransitionA');
        document.querySelector('.backButtonC')!.disabled = true;
        document.querySelector('.backButtonC')!.classList.add('btnTransitionA');
        currentQuizEdit = eventTarget;
        getQuizData(currentQuizEdit.replace('quizID_', ''), (val) => {
            $('playQuiz').disabled = val === null;
            $('shareQuiz').disabled = val === null;
            $('submitQuizID').textContent = 'Create';
            $('modal-bg').style.animation = 'fadeIn 0.5s';
            $('modal-bg').style.display = 'block';
            $('quizNameTitleA').textContent = quizList[eventTarget] + ':';
            $('homeText2').classList.add('btnTransitionA');
            $('manageQuizMenu').style.animation = 'modalPopin 0.3s';
            $('manageQuizMenu').style.display = 'block';
            $('createQuizMenu').style.display = 'none';
            $('modal-popupA').style.display = 'block';
            $('modal-popupA').classList.add('modal-popupActive');
        });
        if (Object.keys(quizList).length > 0) {
            for (let key in quizList) {
                if (quizList[key]) {
                    $(key).classList.add('btnTransitionA');
                }
            }
        }
    }
}

function renderQuizList() {
    if ($('makeDiv') && $('modal-bg').style.display != 'block') {
        setTitle('makeMenu');
        addQuiz();
    }
}

export const quizSetter = (_quizList: { [key: string]: string }) => {
    quizList = _quizList;
    renderQuizList();
};

const questionErrorParse = (arrayToParse: number[], questionValueSingular: string, questionValuePlural: string) => {
    let output = 'Questions';
    if (arrayToParse.length == 1) {
        output = `Question ${arrayToParse[0]} ${questionValueSingular}`;
    } else if (arrayToParse.length == 2) {
        output = `Questions ${arrayToParse[0]} and ${arrayToParse[1]} ${questionValuePlural}`;
    } else if (arrayToParse.length != 0) {
        arrayToParse.forEach((error) => {
            if (arrayToParse.slice(-1)[0] != error) {
                output += ` ${error},`;
            } else {
                output += ` and ${error}`;
            }
        });
        output += ` ${questionValuePlural}`;
    }
    return output != 'Questions' ? output : null;
};

const exitModalPopupTemplate = (popupToKill: string, special?: string) => {
    if (checkOnce || special) {
        checkOnce = false;
        $('modal-bg').style.animation = 'fadeOut 0.5s';
        setTimeout(() => {
            $('modal-bg').style.display = 'none';
            checkOnce = true;
        }, 500);
        $(popupToKill).style.animation = 'modalPopout 0.3s';
        setTimeout(() => {
            $('modal-popupA').style.display = 'none';
            if (special) {
                $(special).style.display = 'none';
            }
        }, 300);
        setTitle('makeMenu');
        addQuiz();
    }
};

export const updateAudio = (name: 'play' | 'end') => {
    if (!mainAudio) {
        mainAudio = new AudioManager({
            mainTheme: 'data/MainTheme.mp3',
            playTheme: 'data/MusicOfTheShavedBears.mp3',
            loadingTheme: 'data/AmbientSpace.mp3',
        });
    }
    if (name === 'play') {
        mainAudio.setVolume('mainTheme', 0);
        setTimeout(() => {
            mainAudio.play('playTheme', true, 0);
            mainAudio.setVolume('playTheme', 1);
        }, 4000);
    } else if (name === 'end') {
        mainAudio.setVolume('playTheme', 0);
    }
};

export function playQuiz() {
    mainAudio = new AudioManager({
        mainTheme: 'data/MainTheme.mp3',
        playTheme: 'data/MusicOfTheShavedBears.mp3',
        loadingTheme: 'data/AmbientSpace.mp3',
    });
    exitModalPopupTemplate('manageQuizMenu');
    $('title').style.display = 'none';
    const quizScreen = document.createElement('teacher-intro');
    $('teacher-play-intro').replaceChildren(quizScreen);
    startGame(
        (value) => {
            quizScreen.dataset.code = `${value.message.toString().slice(0, 5)}-${value.message.toString().slice(5)}`;
            $('title').style.display = 'none';
            mainAudio.play('mainTheme', true);
            mainAudio.setVolume('mainTheme', 1);
        },
        currentQuizEdit ? currentQuizEdit.replace('quizID_', '') : ''
    );
}

function gameFinish(timeLeft: number) {
    $('gameFinishNotify').style.display = 'block';
    $('gameFinishNotify').textContent = `The game will end in ${timeLeft}s`;
    let start = Date.now();
    let init = timeLeft;
    clearInterval(finishUpInterval);
    finishUpInterval = window.setInterval(() => {
        let delta = (Date.now() - start) / 1000;
        let internal = init - delta;
        if (internal < 0) {
            internal = 0;
        }
        $('gameFinishNotify').textContent = `The game will end in ${Math.floor(internal)}s`;
    }, 100);
    otherTimeout = window.setTimeout(() => {
        clearInterval(finishUpInterval);
        $('gameFinishNotify').style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            $('gameFinishNotify').style.display = 'none';
            $('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
        }, 300);
    }, (timeLeft as number) * 1000);
}

export const createLeaderboard = () => {
    const leaderboard = document.createElement('game-leaderboard');
    $('leaderboard').replaceChildren(leaderboard);
};

function removePlayerLeaderboard(id: string) {
    $(`playerList_${id}`).style.maxWidth = '600px';
    $(`playerList_${id}`).style.transition = '';
    $(`playerList_${id}`).classList.remove('inGamePlayerButton');
    setTimeout(() => {
        $(`playerList_${id}`).classList.add('btnTransitionA');
        setTimeout(() => {
            $(`playerList_${id}`).remove();
        }, 300);
    }, 300);
}

function updateLeaderboard(data: { key: string; currentQuestion: number; playerName: string }[]) {
    data.forEach((value, index) => {
        const container = $('playerContainer');
        const currentChild = container.children![index];
        if (currentChild.id.replace('playerList_', '') !== value.key || currentChild.firstElementChild?.textContent?.trim() !== `${index + 1}.`) {
            if ($(`playerList_${value.key}`).style.maxWidth == '600px') {
                doMagic();
            } else {
                $(`playerList_${value.key}`).style.maxWidth = '600px';
                $(`playerList_${value.key}`).classList.remove('inGamePlayerButton');
                setTimeout(() => {
                    doMagic();
                }, 300);
            }

            function doMagic() {
                currentChild.style.transition = 'color 0.3s';
                currentChild.style.color = '#fff';
                setTimeout(() => {
                    currentChild.style.color = '#000';
                    currentChild.firstElementChild!.textContent = `${index + 1}.`;
                    currentChild.lastChild!.remove();
                    currentChild.appendChild(document.createTextNode(` ${value.playerName}`));
                    currentChild.id = `playerList_${value.key}`;
                    currentChild.style.opacity = '1';
                }, 300);
            }
        }
    });
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

function deleteQuiz() {
    checkOnce = false;
    $('manageQuizMenu').style.animation = 'modalPopout 0.3s';
    $('deleteQuizConfirm').disabled = false;
    $('backButtonDeleteConfirm').disabled = false;
    $('deleteQuizConfirm').replaceChildren();
    $('deleteQuizConfirm').textContent = 'Delete';
    $('deleteQuizConfirm').style.backgroundColor = 'orange';
    setTimeout(() => {
        $('manageQuizMenu').style.display = 'none';
        $('quizDeleteConfirm').style.display = 'block';
        $('manageQuizMenu').style.animation = 'modalPopin 0.3s';
        $('quizDeleteConfirm').style.animation = 'modalPopin 0.3s';
    }, 300);
}

function deleteQuizConfirm() {
    delete quizList[currentQuizEdit];
    setQuizList(quizList[currentQuizEdit], () => {}, currentQuizEdit.replace('quizID_', ''));
    setQuiz(currentQuizEdit.replace('quizID_', ''), null, () => {
        exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm');
    });
    $('deleteQuizConfirm').disabled = true;
    $('backButtonDeleteConfirm').disabled = true;
    $('deleteQuizConfirm').style.backgroundColor = '';
    $('deleteQuizConfirm').replaceChildren();
    createTemplate('svgLoader', 'deleteQuizConfirm');
}

function editQuiz() {
    checkOnce = false;
    editState = true;
    $('playQuiz').disabled = true;
    $('shareQuiz').disabled = true;
    $('editQuiz').disabled = true;
    $('deleteQuiz').disabled = true;
    activeArea = null;
    getQuizData(currentQuizEdit.replace('quizID_', ''), (val) => {
        $('manageQuizMenu').style.animation = 'modalPopout 0.3s';
        if (val === undefined || val === null) {
            quizObject2[currentQuizEdit] = JSON.parse(JSON.stringify(quizObject));
            quizObject2[currentQuizEdit].quizName = quizList[currentQuizEdit];
            quizObject2[currentQuizEdit].quizID = currentQuizEdit;
        } else {
            quizObject2[currentQuizEdit] = val;
            quizObject2[currentQuizEdit].questionObjects.forEach((questionObject) => {
                addquestionToDOM();
                let actualData = $(`draggableQuestion${highestQuestion}`).children[1].children;
                actualData[0].textContent = questionObject.questionName;
                characterCount(actualData[0], '90');
                if (questionObject.shortAnswer) {
                    shortAnswerToggle(highestQuestion);
                }
                if (typeof questionObject.timeLimit != 'boolean') {
                    toggleTime(highestQuestion);
                    actualData[4].children[2].textContent = questionObject.timeLimit;
                    characterCount(actualData[4].children[2], '3');
                }
                for (let i = 0; i < 4; i++) {
                    actualData[5].children[i].children[0].textContent = questionObject.Answers[i].answer;
                    characterCount(actualData[5].children[i].children[0], '50');
                    actualData[5].children[i].children[2].children[0].checked = questionObject.Answers[i].correct;
                }
            });
            reorderProper();
        }
        $('quizNameUpdate').value = quizList[currentQuizEdit];
        drake = dragula([$('draggableDiv')], {
            moves: (_el, _container, handle) => handle!.classList.contains('draggableActual'),
        })
            .on('drag', (el) => {
                el.classList.add('dragging');
                collapseAllArea();
            })
            .on('dragend', (el) => {
                el.classList.remove('dragging');
                document.body.style.cursor = 'inherit';
                setTimeout(() => {
                    reorderProper();
                }, 100);
            });
        setTimeout(() => {
            $('manageQuizMenu').style.display = 'none';
            $('editQuizMenu').style.display = 'block';
            $('manageQuizMenu').style.animation = 'modalPopin 0.3s';
            $('editQuizMenu').style.animation = 'modalPopin 0.3s';
            $('playQuiz').disabled = false;
            $('shareQuiz').disabled = false;
            $('editQuiz').disabled = false;
            $('deleteQuiz').disabled = false;
        }, 300);
    });
}

function editQuizForm() {
    $('modal-popupA').style.pointerEvents = 'none';
    $('saveQuizButton').disabled = true;
    $('backButtonEditQuiz').disabled = true;
    $('quizNameUpdate').disabled = true;
    $('addQuestionButton').disabled = true;
    $('exportQuizButton').disabled = true;
    collapseAllArea();
    parseActiveQuiz();
    if (!verifyQuiz()) {
        $('modal-popupB').style.display = 'block';
        $('editQuizMenu').style.animation = 'fadeOut 0.5s';
        window.scrollTo(0, 0);
        allowState2 = false;
        setTimeout(() => {
            $('editQuizMenu').style.visibility = 'hidden';
            allowState2 = true;
        }, 500);
    } else {
        quizObject2[currentQuizEdit] = tempQuiz;
        quizList[currentQuizEdit] = $('quizNameUpdate').value;
        setQuizList(quizList[currentQuizEdit], () => {}, currentQuizEdit.replace('quizID_', ''));
        setQuiz(tempQuiz.quizID.replace('quizID_', ''), tempQuiz, () => {
            setTimeout(() => {
                exitModalPopupF(false);
                setTimeout(() => {
                    $('errorActual').textContent = 'Quiz Saved';
                    $('errorMessageA').style.display = 'block';
                    setTimeout(() => {
                        $('errorMessageA').style.display = 'none';
                    }, 1000);
                }, 200);
            }, 500);
        });
        $('saveQuizButton').replaceChildren();
        createTemplate('svgLoader', 'saveQuizButton');
    }
}

function shareQuiz() {
    $('actuallyShareQuiz').disabled = true;
    getQuizData(currentQuizEdit.replace('quizID_', ''), (value) => {
        $('actuallyShareQuiz').disabled = false;
        if (value == null) {
            $('coolTextArea').value = 'An empty quiz cannot be shared!';
            $('actuallyShareQuiz').style.display = 'none';
            $('whenActuallyShared').style.display = 'block';
        } else {
            quizObject2[currentQuizEdit] = value;
            if (quizObject2[currentQuizEdit].isShared) {
                actuallyShareQuiz();
            }
        }
    });
    checkOnce = false;
    $('manageQuizMenu').style.animation = 'modalPopout 0.3s';
    setTimeout(() => {
        $('manageQuizMenu').style.display = 'none';
        $('shareQuizMenu').style.display = 'block';
        $('manageQuizMenu').style.animation = 'modalPopin 0.3s';
        $('shareQuizMenu').style.animation = 'modalPopin 0.3s';
    }, 300);
}

function actuallyShareQuiz() {
    if (!quizObject2[currentQuizEdit].isShared) {
        $('actuallyShareQuiz').disabled = false;
        $('actuallyShareQuiz').classList.add('btnTransitionA');
    } else {
        $('actuallyShareQuiz').style.display = 'none';
        $('whenActuallyShared').style.display = 'block';
    }
    set(ref(database, `sharedQuizzes/${auth.currentUser!.uid}/${currentQuizEdit.replace('quizID_', '')}`), quizObject2[currentQuizEdit]).then(() => {
        set(ref(database, `userProfiles/${auth.currentUser!.uid}/quizData/${currentQuizEdit.replace('quizID_', '')}/isShared`), true).then(() => {
            $('coolTextArea').value = `mamklearn.com/?shareUser=${auth.currentUser!.uid}&shareQuiz=${currentQuizEdit.replace('quizID_', '')}`;
            setTimeout(() => {
                $('actuallyShareQuiz').style.display = 'none';
                $('whenActuallyShared').style.display = 'block';
                quizObject2[currentQuizEdit].isShared = true;
            }, 300);
        });
    });
}

function gameEnd(firstPlace: number[], secondPlace: number[], thirdPlace: number[]) {
    clearInterval(otherInterval);
    $('gameResults').style.display = 'block';
    setCharImage('first-place', firstPlace);
    secondPlace ? setCharImage('second-place', secondPlace) : setCharImage('second-place', [1, 2, 2, 2, -1]);
    thirdPlace ? setCharImage('third-place', thirdPlace) : setCharImage('third-place', [1, 2, 2, 2, -1]);
    mainAudio?.setVolume('playTheme', 0);
    setTimeout(() => {
        $('gameFinishNotify').style.display = 'none';
        clearInterval(finishUpInterval);
        $('errorMessageB').style.display = 'none';
    }, 500);
    window.setTimeout(() => {
        $('imageObjectContainer').style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            $('gameResults').style.display = 'none';
            $('imageObjectContainer').style.animation = '';
            quitQuizTeacher();
        }, 200);
    }, 12000);
}

function copyShareLink() {
    navigator.clipboard.writeText($('coolTextArea').value!);
    $('errorActual').textContent = 'Link Copied';
    $('errorMessageA').style.display = 'block';
    setTimeout(() => {
        $('errorMessageA').style.display = 'none';
    }, 1000);
}