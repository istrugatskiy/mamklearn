// Contains code related to making quizzes
import '../css/make.css';
import dragula from 'dragula';
import { $, characterCount, deepEqual, createTemplate, setTitle, clearChildren, getID, AudioManager, mathClamp, download } from './utils';
import { setCharImage } from './app';
import { networkManager } from './networkEngine';

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
let drake: dragula.Drake;
let currentQuizEdit: string;
let iconIterate = 0;
let activeArea: number | null;
let highestQuestion = 0;
let tempQuiz: quizObject;
let allowState2 = true;
let quizList: { [key: string]: string } = {};
let checkOnce = true;
let playerNumber = 0;
let mainAudio: AudioManager;

let clickListeners = {
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
    gameStartButtonTeacher: () => {
        startGameTeacher();
    },
    exportQuizButton: () => {
        parseActiveQuiz();
        download(`${tempQuiz.quizName}-exported.json`, JSON.stringify(tempQuiz, null, 4));
    },
    actuallyShareQuiz: () => {
        actuallyShareQuiz();
    },
};

let clickIncludesListeners = {
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
    studentCharacterImage: (event: Event) => {
        const studentID = (event.target as HTMLElement).id.replace('studentCharacterImage_', '');
        (event.target as HTMLElement).disabled = true;
        (event.target as HTMLElement).tabIndex = -1;
        (event.target as HTMLElement).style.pointerEvents = 'none';
        networkManager.kickPlayer(studentID);
    },
    quizID_: (event: Event) => {
        quizButtonOnClick(event);
    },
    isCorrectQuestion: (event: Event) => {
        const target = (event.target! as HTMLElement).id;
        $(`actualIsCorrectQuestion${getID(target)}`).checked = !$(`actualIsCorrectQuestion${getID(target)}`).checked;
    },
};

let submitListeners = {
    editQuizForm: () => {
        editQuizForm();
    },
    quizCreateForm: () => {
        createNewQuiz();
    },
};

let keyboardIncludesListeners = {
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
        networkManager.kickPlayer(studentID);
    },
};

export const initEvents = () => {
    window.clickEvents = { ...window.clickEvents, ...clickListeners };
    window.clickIncludesEvents = { ...window.clickIncludesEvents, ...clickIncludesListeners };
    window.submitEvents = { ...window.submitEvents, ...submitListeners };
    window.keyboardIncludesEvents = { ...window.keyboardIncludesEvents, ...keyboardIncludesListeners };
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
        window.clickEvents['modal-bg'] = () => {
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
    window.customOptionsIncrement = 0;
    document.querySelector('.backButtonC')!.disabled = true;
    $('title').classList.add('handleOutTransition');
    setTimeout(() => {
        $('title').classList.remove('handleOutTransition');
        clearChildren('title');
        setTitle('homeScreen');
        $('title').style.height = '800px';
        $('title').style.top = '15%';
        setCharImage('currentUser', window.currentUserConfig);
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
    networkManager.setQuizList(quizName, () => {
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
        $('modal-popupB').style.animation = 'modalPopout2 0.5s';
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
    let area = $(`collapseSubArea${a}`);
    let objm = $(`collapsableContent${a}`);
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
        clearChildren('innerError3');
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
            clearChildren('saveQuizButton');
            $('saveQuizButton').textContent = 'Save';
            clearChildren('draggableDiv');
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
        $('makeDiv').style.paddingLeft = '30px';
    }
}

networkManager.quitQuizTeacher = () => {
    $('errorActual').textContent = 'Game Has Ended';
    $('errorMessageA').style.display = 'block';
    setTimeout(() => {
        $('loader-1').style.display = 'none';
        $('errorMessageA').style.display = 'none';
    }, 1000);
    $('teacherPlayScreen').style.display = 'none';
    $('teacherCountdown').style.display = 'none';
    mainAudio.clearAll();
    $('liveLeaderboards').style.display = 'none';
    $('title').style.display = 'block';
    goBackMakeA();
};

function quizButtonOnClick(event: Event) {
    const eventTarget = (event.target! as HTMLElement).id;
    if (checkOnce) {
        document.querySelector('.createButtonA')!.disabled = true;
        window.clickEvents['modal-bg'] = () => {
            exitModalPopupTemplate('manageQuizMenu');
        };
        $('QuizName').disabled = false;
        $('submitQuizID').disabled = false;
        $('QuizName').value = '';
        document.querySelector('.createButtonA')!.classList.add('btnTransitionA');
        document.querySelector('.backButtonC')!.disabled = true;
        document.querySelector('.backButtonC')!.classList.add('btnTransitionA');
        currentQuizEdit = eventTarget;
        networkManager.handleCurrentQuiz(currentQuizEdit.replace('quizID_', ''), (val) => {
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

export function playQuiz() {
    mainAudio = new AudioManager({
        mainTheme: 'data/MainTheme.mp3',
        playTheme: 'data/MusicOfTheShavedBears.mp3',
        loadingTheme: 'data/AmbientSpace.mp3',
    });
    exitModalPopupTemplate('manageQuizMenu');
    $('title').style.display = 'none';
    playerNumber = 0;
    networkManager.startGame(
        (value) => {
            $('gameStartButtonTeacher').disabled = true;
            $('gameCodeTeacher').textContent = `Game Code: ${value.message.toString().slice(0, 5)}-${value.message.toString().slice(5)}`;
            $('title').style.display = 'none';
            mainAudio.play('mainTheme', true);
            $('teacherPlayScreen').style.display = 'block';
            networkManager.studentHandler(
                (internal, playerID) => {
                    renderPlayer(internal.playerName, internal.playerConfig, playerID);
                },
                (playerID) => {
                    kickPlayer(playerID);
                }
            );
        },
        currentQuizEdit ? currentQuizEdit.replace('quizID_', '') : ''
    );
}

function renderPlayer(playerName: string, playerConfig: number[], playerID: string) {
    playerNumber++;
    $('gameStartButtonTeacher').disabled = playerNumber == 0;
    mainAudio.setVolume('mainTheme', mathClamp(0.6 + (playerNumber / 5) * 0.1, 0.6, 1), true);
    createTemplate('playerForTeacherScreen', 'characterPeopleDiv');
    $('playerName').textContent = playerName;
    $('playerName').id = `playerName_${playerID}`;
    setCharImage('inGamePlayer', playerConfig);
    Array.from($('characterPeopleDiv').lastElementChild!.firstElementChild!.children[1].children).forEach((el) => {
        el.id = '';
    });
    $('characterPeopleDiv').lastElementChild!.firstElementChild!.id = `studentCharacterImage_${playerID}`;
}

function kickPlayer(eventId: string) {
    playerNumber--;
    $('gameStartButtonTeacher').disabled = playerNumber == 0;
    mainAudio.setVolume('mainTheme', mathClamp(0.6 + (playerNumber / 5) * 0.1, 0.6, 1), true);
    const el = $(`studentCharacterImage_${eventId}`);
    el.disabled = true;
    el.style.animation = 'hideme 0.3s';
    setTimeout(() => {
        el.parentElement!.remove();
    }, 300);
}

function startGameTeacher() {
    networkManager.removeStudentHandler();
    networkManager.otherStudentHandler();
    $('gameStartButtonTeacher').disabled = true;
    const people = Array.from($('characterPeopleDiv').children);
    people.forEach((object) => {
        object.disabled = true;
        object.classList.add('btnTransitionA');
    });
    networkManager.actuallyStartGame(() => {
        setTimeout(() => {
            mainAudio.setVolume('mainTheme', 0);
            clearChildren('characterPeopleDiv');
            $('gameStartButtonTeacher').classList.add('btnTransitionA');
            $('gameCodeTeacher').classList.add('btnTransitionA');
            doCountdown();
        }, 300);
        setTimeout(() => {
            mainAudio.play('playTheme', true, 0);
            mainAudio.setVolume('playTheme', 1);
        }, 3000);
        setTimeout(() => {
            $('liveLeaderboards').style.display = 'block';
        }, 5000);
    });
}

function doCountdown() {
    const countdown = $('teacherCountdown').firstElementChild!;
    countdown.textContent = '3';
    $('teacherCountdown').style.display = 'block';
    let iterator = 3;
    for (let index = 0; index <= 3; index++) {
        setCountdown(index, iterator.toString());
        iterator--;
    }
    setCountdown(3, 'GO!');

    function setCountdown(num: number, iterator: string) {
        setTimeout(() => {
            countdown.classList.remove('titleTransitionBack');
            countdown.classList.add('teacherCountdownAnim');
            setTimeout(() => {
                countdown.textContent = iterator;
                countdown.classList.add('titleTransitionBack');
                countdown.classList.remove('teacherCountdownAnim');
            }, 300);
        }, 1000 * num);
    }
    setTimeout(() => {
        countdown.classList.add('teacherCountdownAnim');
    }, 4000);
}

function deleteQuiz() {
    checkOnce = false;
    $('manageQuizMenu').style.animation = 'modalPopout 0.3s';
    $('deleteQuizConfirm').disabled = false;
    $('backButtonDeleteConfirm').disabled = false;
    clearChildren('deleteQuizConfirm');
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
    networkManager.setQuizList(quizList[currentQuizEdit], () => {}, currentQuizEdit.replace('quizID_', ''));
    networkManager.setQuiz(currentQuizEdit.replace('quizID_', ''), null, () => {
        exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm');
    });
    $('deleteQuizConfirm').disabled = true;
    $('backButtonDeleteConfirm').disabled = true;
    $('deleteQuizConfirm').style.backgroundColor = '';
    clearChildren('deleteQuizConfirm');
    createTemplate('svgLoader', 'deleteQuizConfirm');
}

function editQuiz() {
    checkOnce = false;
    editState = true;
    $('playQuiz').disabled = true;
    $('shareQuiz').disabled = true;
    $('editQuiz').disabled = true;
    $('deleteQuiz').disabled = true;
    networkManager.handleCurrentQuiz(currentQuizEdit.replace('quizID_', ''), (val) => {
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
            moves: function (_el, _container, handle) {
                return handle!.classList.contains('draggableActual');
            },
        })
            .on('drag', function (el) {
                el.classList.add('dragging');
                collapseAllArea();
            })
            .on('dragend', function (el) {
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
        networkManager.setQuizList(quizList[currentQuizEdit], () => {}, currentQuizEdit.replace('quizID_', ''));
        networkManager.setQuiz(tempQuiz.quizID.replace('quizID_', ''), tempQuiz, () => {
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
        clearChildren('saveQuizButton');
        createTemplate('svgLoader', 'saveQuizButton');
    }
}

function shareQuiz() {
    $('actuallyShareQuiz').disabled = true;
    networkManager.handleCurrentQuiz(currentQuizEdit.replace('quizID_', ''), (value) => {
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
    networkManager.shareQuiz(currentQuizEdit.replace('quizID_', ''), quizObject2[currentQuizEdit], (obj) => {
        $('coolTextArea').value = `mamklearn.com/?shareUser=${networkManager.authInstance.currentUser!.uid}&shareQuiz=${obj}`;
        setTimeout(() => {
            $('actuallyShareQuiz').style.display = 'none';
            $('whenActuallyShared').style.display = 'block';
            quizObject2[currentQuizEdit].isShared = true;
        }, 300);
    });
}

function copyShareLink() {
    navigator.clipboard.writeText($('coolTextArea').value!);
    $('errorActual').textContent = 'Link Copied';
    $('errorMessageA').style.display = 'block';
    setTimeout(() => {
        $('errorMessageA').style.display = 'none';
    }, 1000);
}
