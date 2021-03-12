// Contains code related to making quizzes
import dragula from 'dragula';
import {$, characterCount, deepEqual, createTemplate, setTitle, encodeHTML, decodeHTML, clearChildren, getID} from './utils';
import {setCharImage, contentEditableUpdate} from './app';

var editState = false;
var quizObject2: any[] = [];
const quizObject = {
	quizID: "",
	quizName: "",
	questionObjects: []
}
var drake: any;
var currentQuizEdit: any;
var iconIterate = 0;
var activeArea: number;
var highestQuestion = 0;
var tempQuiz: any;
var allowState2 = true;
var quizList2: any = {};
var checkOnce = true;
var quizIncrement = 0;

var clickListeners = {
	"deleteQuizConfirm": () => {deleteQuizConfirm()},
	"deleteQuiz": () => {deleteQuiz()},
	"editQuiz": () => {editQuiz()},
	"addQuestionButton": () => {addQuestion()},
	"playQuiz": () => {playQuiz()},
	"doneButtonA": () => {doneButtonA()},
	"shareQuiz": () => {shareQuiz()},
	"backButtonEditQuiz": () => {exitModalPopupF(true)},
	"backButtonC": () => {goBackMakeA()},
	"copyShareLink": () => {copyShareLink()},
	"modal-bg": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonZ": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonY": () => {exitModalPopupTemplate('manageQuizMenu')},
	"backButtonShareQuiz": () => {exitModalPopupTemplate('shareQuizMenu', 'shareQuizMenu')},
	"createButtonA": () => {createQuiz()},
	"backButtonDeleteConfirm": () => {exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm')},
};

var clickIncludesListeners = {
	"collapseSubArea": (event: MouseEvent) => {collapseSubArea(getID(event) as unknown as number)},
	"deleteQuestion": (event: MouseEvent) => {deleteQuestion(getID(event))},
	"shortAnswerToggle": (event: MouseEvent) => {shortAnswerToggle(getID(event))},
	"toggleTime": (event: MouseEvent) => {toggleTime(getID(event))}
}

var submitListeners = {
	"editQuizForm": () => {editQuizForm()},
	"quizCreateForm": () => {createNewQuiz()}
}

var keyboardIncludesListeners = {
	"deleteQuestion": (event: KeyboardEvent) => {deleteQuestion(getID(event))},
	"keyboardNavAnswer": (event: KeyboardEvent) => {
		const eventTarget = (event.target! as HTMLElement).id;
		shortAnswerToggle(getID(event));
		$(eventTarget).previousElementSibling!.firstElementChild!.checked = !$(eventTarget).previousElementSibling!.firstElementChild!.checked;
	},
	"keyboardNavTime": (event: KeyboardEvent) => {
		toggleTime(getID(event));
		const eventTarget = (event.target! as HTMLElement).id;
		$(eventTarget).previousElementSibling!.firstElementChild!.checked = !$(eventTarget).previousElementSibling!.firstElementChild!.checked;
	},
	"isCorrectQuestion": (event: KeyboardEvent) => {
		const eventTarget = (event.target! as HTMLElement).id;
		$(eventTarget).children[0].checked = !$(eventTarget).children[0].checked;
	},

}


export const initEvents = () => {
	window.clickEvents = {...window.clickEvents, ...clickListeners};
	window.clickIncludesEvents = {...window.clickIncludesEvents, ...clickIncludesListeners};
	window.submitEvents = {...window.submitEvents, ...submitListeners};
	window.keyboardIncludesEvents = {...window.keyboardIncludesEvents, ...keyboardIncludesListeners};
}

window.addEventListener("beforeunload", (event) => {
	if (editState) {
		event.preventDefault();
		event.returnValue = ' ';
	}
});

export function createQuiz() {
	if (checkOnce) {
		$('createButtonA').disabled = true;
		$('QuizName').disabled = false;
		window.clickEvents['modal-bg'] = () => {exitModalPopupTemplate('createQuizMenu')};
		$('submitQuizID').disabled = false;
		$('QuizName').value = '';
		$('createButtonA').classList.add('btnTransitionA');
		$('backButtonC').disabled = true;
		$('backButtonC').classList.add('btnTransitionA');
		$('submitQuizID').textContent = 'Create';
		$('modal-bg').style.animation = 'fadeIn 0.5s';
		$('modal-bg').style.display = 'block';
		$('homeText2').classList.add('btnTransitionA');
		$('createQuizMenu').style.animation = 'modalPopin 0.3s';
		$('manageQuizMenu').style.display = 'none';
		$('createQuizMenu').style.display = 'block';
		$('modal-popupA').style.display = 'block';
		$('modal-popupA').classList.add('modal-popupActive');
		if (Object.keys(quizList2).length > 0) {
			for (var key in quizList2) {
				$(key).classList.add('btnTransitionA');
			};
		}
	}
}

export function goBackMakeA() {
	window.customOptionsIncrement = 0;
	$('backButtonC').disabled = true;
	$('homeText2').classList.add('titleTransition');
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			$(key).classList.add('btnTransitionA');
		};
	}
	$('createButtonA').classList.add('btnTransitionA');
	$('backButtonC').classList.add('btnTransitionA');
	setTimeout( () => {
		clearChildren('title');
		setTitle('homeScreen');
		$('title').style.height = "800px";
		$('title').style.top = "15%";
		setCharImage('currentUser', window.currentUserConfig);
	}, 300);
}

export function createNewQuiz() {
	checkOnce = false;
	var button = $('submitQuizID');
	$('QuizName').disabled = true;
	const g = $('QuizName').value;
	button.disabled = true;
	button.textContent = '';
	createTemplate('svgLoader', button.id);
	setTimeout( () => {
		checkOnce = true;
		quizList2[`quizID_${quizIncrement}`] = encodeHTML(g);
		quizIncrement++;
		exitModalPopupTemplate('createQuizMenu');
	}, 1000);
}

export function addQuestion() {
	addquestionToDOM();
	contentEditableUpdate();
	reorderProper();
	$(`collapseSubArea${highestQuestion}`).focus();
}

export function doneButtonA() {
	if (allowState2) {
		$("modal-popupB").style.animation = 'modalPopout2 0.5s';
		$("editQuizMenu").style.animation = 'fadein 0.5s';
		$("editQuizMenu").style.visibility = 'visible';
		$("saveQuizButton").disabled = false;
		$("backButtonEditQuiz").disabled = false;
		$("quizNameUpdate").disabled = false;
		$("addQuestionButton").disabled = false;
		reorderProper();
		setTimeout(function () {
			($("modal-popupB") as HTMLDivElement).removeAttribute('style');
			$("modal-popupB").style.visibility = 'none';
			$("modal-popupA").style.pointerEvents = "all";
		}, 500);
	}
}

export function collapseSubArea(a: number) {
	var area = $(`collapseSubArea${a}`);
	var objm = $(`collapsableContent${a}`);
	area.classList.toggle('arrowBRight');
	area.classList.toggle('arrowBDown');
	objm.classList.toggle('contentA1');
	objm.classList.toggle('contentA2');
	if (activeArea !== null && activeArea !== a) {
		var area = $(`collapseSubArea${activeArea}`);
		var objm = $(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
	}
	activeArea = a;
}

export function collapseAllArea() {
	if (activeArea !== -2 && $(`collapseSubArea${activeArea}`) != null) {
		var area = $(`collapseSubArea${activeArea}`);
		var objm = $(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
		activeArea = -2;
	}
}

export function deleteQuestion(a: string) {
	collapseAllArea();
	$(`draggableQuestion${a}`).style.pointerEvents = 'none';
	$(`draggableQuestion${a}`).classList.add('btnTransitionA');
	setTimeout( () => {
		drake.remove($(`draggableQuestion${a}`));
		$(`draggableQuestion${a}`).remove();
		reorderProper();
	}, 300);
}

export function reorderProper() {
	var test = 0;
	for (var i = 0; i <= $('draggableDiv').children.length - 1; i++) {
		$('draggableDiv').children[i]!.firstElementChild!.children[1].textContent = `Question ${i + 1}:`;
		test = i;
	}
	if(test >= 24) {
		$('addQuestionButton').disabled = true;
		$('addQuestionButton').textContent = '25/25 questions';
		$('addQuestionButton').style.cursor = "no-drop";
	}
	else {
		$('addQuestionButton').disabled = false;
		$('addQuestionButton').textContent = 'add question...';
		$('addQuestionButton').style.cursor = "pointer";
	}
}

export function shortAnswerToggle(endMe: string | number) {
	$(`answerContainerObject${endMe}`).classList.toggle('shortAnswerEditorStyles');
	$(`collapsableContent${endMe}`).classList.toggle('noSpaceEditor');
}

export function toggleTime(order: string | number) {
	$(`Question${order}Time`).classList.toggle("displayTimeLimit");
}

export function parseActiveQuiz() {
	tempQuiz = JSON.parse(JSON.stringify(quizObject));
	tempQuiz.quizName = encodeHTML($("quizNameUpdate").value);
	tempQuiz.quizID = currentQuizEdit;
	if ($("draggableDiv").firstElementChild) {
		var quizDoc = Array.from($("draggableDiv").children);
		quizDoc.forEach( (object) => {
			var timeLimit: string | null | boolean = false;
			if (object.children[1].children[4].children[0].children[0].checked) {
				timeLimit = object.children[1].children[4].children[2].textContent;
			}
			tempQuiz.questionObjects.push({
				questionName: object.children[1].children[0].textContent,
				shortAnswer: object.children[1].children[3].children[0].children[0].checked,
				timeLimit: timeLimit,
				Answers: [{
					answer: object.children[1].children[5].children[0].children[0].textContent,
					correct: object.children[1].children[5].children[0].children[2].children[0].checked
				}, {
					answer: object.children[1].children[5].children[1].children[0].textContent,
					correct: object.children[1].children[5].children[1].children[2].children[0].checked
				}, {
					answer: object.children[1].children[5].children[2].children[0].textContent,
					correct: object.children[1].children[5].children[2].children[2].children[0].checked
				}, {
					answer: object.children[1].children[5].children[3].children[0].textContent,
					correct: object.children[1].children[5].children[3].children[2].children[0].checked
				}]
			});
		});
	}
}

//verify that question field is filled; done
//verify that we have any questions at all; done
//verify that no field goes over it's character limit; done
//verify that time limit is at least 5 or more; done
//verify that at least one possible choice is correct; done
//verify that at least two answer fields are filled out; done
export const verifyQuiz = () => {
	var quizParseError = [];
	var finalResult = document.createDocumentFragment();
	if (tempQuiz.questionObjects.length === 0) {
		quizParseError.push('No questions exist');
	}
	else {
		var nullSpace01: number[] = [];
		var timeLimitViolation: number[] = [];
		var answerError0: number[] = [];
		var answerError1: number[] = [];
		var answerError2: number[] = [];
		tempQuiz.questionObjects.forEach( (question: any, index: number) => {
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
				if(!question.Answers[2].answer || !question.Answers[3].answer) {
					if(question.Answers[2].correct && !question.Answers[2].answer) {
						answerError2.push(index);
					}
					else if(question.Answers[3].correct && !question.Answers[3].answer) {
						answerError2.push(index);
					}
				}
			}
			if (typeof question.timeLimit != "boolean") {
				if (isNaN(question.timeLimit) || question.timeLimit < 5) {
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
	if (quizParseError.join("").length !== 0) {
		quizParseError.forEach( (error) => {
			if(error != null) {
				finalResult.appendChild(document.createElement('li'));
				finalResult!.lastElementChild!.textContent = error;
				finalResult!.lastElementChild!.classList.add('innerError');
			}
		});
		clearChildren('innerError3');
		$('innerError3').appendChild(finalResult);
		return false;
	}
	else {
		return true;
	}
}

export function exitModalPopupF(promptUser: boolean) {
	if(promptUser) {
		parseActiveQuiz();
		if(deepEqual(tempQuiz, quizObject2[currentQuizEdit])) {
			exitModalPopupF(false);
		}
		else if(confirm("Are you sure you want to go back? Any unsaved changes will be lost!")) {
			exitModalPopupF(false);
		}
	}
	else {
		checkOnce = false;
		$('modal-bg').style.animation = 'fadeOut 0.5s';
		$('editQuizMenu').style.animation = 'modalPopout 0.3s';
		setTimeout( () => {
			editState = false;
			($('editQuizMenu') as HTMLDivElement).removeAttribute('style');
			$('modal-bg').style.display = 'none';
			$('editQuizMenu').style.display = 'none';
			$("saveQuizButton").disabled = false;
			$("backButtonEditQuiz").disabled = false;
			$("quizNameUpdate").disabled = false;
			$("addQuestionButton").disabled = false;
			$("modal-popupA").style.pointerEvents = "all";
			clearChildren('saveQuizButton');
			$("saveQuizButton").textContent = 'Save';
			clearChildren('draggableDiv');
			drake.destroy();
			highestQuestion = 0;
			checkOnce = true;
		}, 500);
		setTimeout( () => {
			$('modal-popupA').style.display = 'none';
		}, 300);
		setTitle('makeMenu');
		addQuiz();
	}
}

export function addquestionToDOM() {
	highestQuestion++;
	createTemplate('templateQuestion', 'draggableDiv', '${highestQuestion}', highestQuestion);
	$('draggableQuestion${highestQuestion}').id = `draggableQuestion${highestQuestion}`;
}

export function addQuiz() {
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			$('makeDiv').innerHTML += `<button style="min-width: 300px; min-height: 300px;  margin-top: 30px; text-align: center; font-size: xx-large; margin-left: 30px;" class="button titleTransitionBack quizActionButton" id="${key}"><img src="../img/qIcon-${iconIterate % 4}.png" width="250"><br>${quizList2[key]}</button>`
			iconIterate++;
		};
		iconIterate = 0;
		$('backButtonC').remove();
		$('removeButton').remove();
		$('makeDiv').innerHTML += '<button style="min-width: 300px; min-height: 300px;  margin-top: 30px; text-align: center; font-size: xx-large;  max-width:300px; margin-left: 30px;" class="button titleTransitionBack" id="createButtonA"><img src="../img/createQuiz-2.png" width="250"><br>(Create quiz)</button>'
		$('makeDiv').innerHTML += '<br><br><div style="text-align:center; width: 100%25;"><button class="button titleTransitionBack" id="backButtonC">Back</button></div>';
		$('makeDiv').style.textAlign = 'center';
		document.querySelectorAll('.quizActionButton').forEach(item => {
			item.addEventListener('click', event => {
				const eventTarget = (event.target! as HTMLElement).id;
				if (checkOnce) {
					$('createButtonA').disabled = true;
					window.clickEvents['modal-bg'] = () => {exitModalPopupTemplate('manageQuizMenu')};
					$('QuizName').disabled = false;
					$('submitQuizID').disabled = false;
					$('QuizName').value = '';
					$('createButtonA').classList.add('btnTransitionA');
					$('backButtonC').disabled = true;
					$('backButtonC').classList.add('btnTransitionA');
					$('submitQuizID').textContent = 'Create';
					$('modal-bg').style.animation = 'fadeIn 0.5s';
					$('modal-bg').style.display = 'block';
					$('quizNameTitleA').textContent = quizList2[eventTarget] + ":";
					$('homeText2').classList.add('btnTransitionA');
					$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
					$('manageQuizMenu').style.display = 'block';
					$('createQuizMenu').style.display = 'none';
					$('modal-popupA').style.display = 'block';
					$('modal-popupA').classList.add('modal-popupActive');
					currentQuizEdit = eventTarget;
					if (Object.keys(quizList2).length > 0) {
						for (var key in quizList2) {
							$(key).classList.add('btnTransitionA');
						};
					}
				}
			})
		})
		$('makeDiv').style.paddingLeft = "30px";
	}
}

export const questionErrorParse = (arrayToParse: number[], questionValueSingular: string, questionValuePlural: string) => {
	let output = 'Questions';
	if(arrayToParse.length == 1) {
		output = `Question ${arrayToParse[0]} ${questionValueSingular}`;
	}
	else if (arrayToParse.length == 2) {
		output = `Questions ${arrayToParse[0]} and ${arrayToParse[1]} ${questionValuePlural}`;
	}
	else if(arrayToParse.length != 0) {
		arrayToParse.forEach( (error) => {
			if (arrayToParse.slice(-1)[0] != error) {
				output += ` ${error},`;
			}
			else {
				output += ` and ${error}`;
			}
		});
		output += ` ${questionValuePlural}`;
	}
	return (output != 'Questions' ? output : null);
}

export const exitModalPopupTemplate = (popupToKill: string, special?: string) => {
	if (checkOnce || special) {
		checkOnce = false;
		$('modal-bg').style.animation = 'fadeOut 0.5s';
		setTimeout( () => {
			$('modal-bg').style.display = 'none';
			checkOnce = true;
		}, 500);
		$(popupToKill).style.animation = 'modalPopout 0.3s';
		setTimeout( () => {
			$('modal-popupA').style.display = 'none';
			if(special) {
				$(special).style.display = 'none';
			}
		}, 300);
		setTitle('makeMenu');
		addQuiz();
	}
}

export function playQuiz() {
	$('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		$('modal-bg').style.display = 'none';
	}, 500);
	setTimeout( () => {
		$('title').style.display = 'none';
		($('mainTheme') as HTMLMediaElement).play();
		($('mainTheme') as HTMLMediaElement).volume = 0.6;
		$('teacherPlayScreen').style.display = 'block';
	}, 1000);
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		$('modal-popupA').style.display = 'none';
	}, 300);
}

export function deleteQuiz() {
	checkOnce = false;
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	$('deleteQuizConfirm').disabled = false;
	$('backButtonDeleteConfirm').disabled = false;
	clearChildren('deleteQuizConfirm');
	$('deleteQuizConfirm').textContent = 'Delete';
	$('deleteQuizConfirm').style.backgroundColor = 'orange';
	setTimeout(function () {
		$('manageQuizMenu').style.display = 'none';
		$('quizDeleteConfirm').style.display = 'block';
		$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		$('quizDeleteConfirm').style.animation = 'modalPopin 0.3s';
	}, 300);
}

export function deleteQuizConfirm() {
	delete quizList2[currentQuizEdit];
	$('deleteQuizConfirm').disabled = true;
	$('backButtonDeleteConfirm').disabled = true;
	$('deleteQuizConfirm').style.backgroundColor = '';
	clearChildren('deleteQuizConfirm');
	createTemplate('svgLoader', 'deleteQuizConfirm');
	setTimeout(function () {
		exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm');
	}, 1000);
}

export function editQuiz() {
	checkOnce = false;
	editState = true;
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	if (quizObject2[currentQuizEdit] === undefined) {
		quizObject2[currentQuizEdit] = JSON.parse(JSON.stringify(quizObject));
		quizObject2[currentQuizEdit].quizName = quizList2[currentQuizEdit];
		quizObject2[currentQuizEdit].quizID = currentQuizEdit;
	}
	else {
		quizObject2[currentQuizEdit].questionObjects.forEach( (questionObject: any) => {
			addquestionToDOM();
			var actualData = $(`draggableQuestion${highestQuestion}`).children[1].children;
			actualData[0].textContent = questionObject.questionName;
			characterCount(actualData[0], '90');
			actualData[3].children[0].children[0].checked = questionObject.shortAnswer;
			if (questionObject.shortAnswer) {
				shortAnswerToggle(highestQuestion);
			}
			actualData[4].children[0].children[0].checked = questionObject.timeLimit;
			if (typeof questionObject.timeLimit != "boolean") {
				toggleTime(highestQuestion);
				actualData[4].children[2].textContent = questionObject.timeLimit;
				characterCount(actualData[4].children[2], '3');
			}
			for (var i = 0; i < 4; i++) {
				actualData[5].children[i].children[0].textContent = questionObject.Answers[i].answer;
				characterCount(actualData[5].children[i].children[0], '50');
				actualData[5].children[i].children[2].children[0].checked = questionObject.Answers[i].correct;
			}
		});
		reorderProper();
	}
	$('quizNameUpdate').value = decodeHTML(quizList2[currentQuizEdit]);
	drake = dragula([$('draggableDiv')], {
		moves: function (_el, _container, handle) {
			return handle!.classList.contains('draggableActual');
		}
	}).on('drag', function (el) {
		el.classList.add('dragging');
		collapseAllArea();
	}).on('dragend', function (el) {
		el.classList.remove('dragging');
		document.body.style.cursor = "inherit";
		setTimeout(function () {
			reorderProper();
		}, 100);
	});
	setTimeout(function () {
		$('manageQuizMenu').style.display = 'none';
		$('editQuizMenu').style.display = 'block';
		$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		$('editQuizMenu').style.animation = 'modalPopin 0.3s';
		contentEditableUpdate();
	}, 300);
}

export function editQuizForm() {
	$("modal-popupA").style.pointerEvents = "none";
	$("saveQuizButton").disabled = true;
	$("backButtonEditQuiz").disabled = true;
	$("quizNameUpdate").disabled = true;
	$("addQuestionButton").disabled = true;
	collapseAllArea();
	parseActiveQuiz();
	if (!verifyQuiz()) {
		$("modal-popupB").style.display = 'block';
		$("editQuizMenu").style.animation = 'fadeOut 0.5s';
		window.scrollTo(0, 0);
		allowState2 = false;
		setTimeout(function () {
			$("editQuizMenu").style.visibility = 'hidden';
			allowState2 = true;
		}, 500);
	}
	else {
		quizObject2[currentQuizEdit] = tempQuiz;
		quizList2[currentQuizEdit] = encodeHTML($("quizNameUpdate").value);
		clearChildren('saveQuizButton');
		createTemplate('svgLoader', 'saveQuizButton');
		setTimeout(function () {
			exitModalPopupF(false);
		}, 1000);
		setTimeout(function () {
			$("errorActual").textContent = 'Quiz Saved';
			$("errorMessageA").style.display = "block";
			setTimeout(function () {
				$("errorMessageA").style.display = "none";
			}, 1000);
		}, 1200);
	}
}

export function shareQuiz() {
	checkOnce = false;
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		$('manageQuizMenu').style.display = 'none';
		$('shareQuizMenu').style.display = 'block';
		$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		$('shareQuizMenu').style.animation = 'modalPopin 0.3s';
	}, 300);
}

export function copyShareLink() {
	navigator.clipboard.writeText($('coolTextArea').textContent!);
	$("errorActual").textContent = 'Link Copied';
	$("errorMessageA").style.display = "block";
	setTimeout(function () {
		$("errorMessageA").style.display = "none";
	}, 1000);
}