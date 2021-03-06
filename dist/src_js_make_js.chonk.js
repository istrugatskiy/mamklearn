(self["webpackChunkmamklearn"] = self["webpackChunkmamklearn"] || []).push([["src_js_make_js"],{

/***/ "./src/js/make.js":
/*!************************!*\
  !*** ./src/js/make.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createQuiz": () => (/* binding */ createQuiz),
/* harmony export */   "goBackMakeA": () => (/* binding */ goBackMakeA),
/* harmony export */   "createNewQuiz": () => (/* binding */ createNewQuiz),
/* harmony export */   "addQuestion": () => (/* binding */ addQuestion),
/* harmony export */   "doneButtonA": () => (/* binding */ doneButtonA),
/* harmony export */   "collapseSubArea": () => (/* binding */ collapseSubArea),
/* harmony export */   "collapseAllArea": () => (/* binding */ collapseAllArea),
/* harmony export */   "deleteQuestion": () => (/* binding */ deleteQuestion),
/* harmony export */   "reorderProper": () => (/* binding */ reorderProper),
/* harmony export */   "shortAnswerToggle": () => (/* binding */ shortAnswerToggle),
/* harmony export */   "toggleTime": () => (/* binding */ toggleTime),
/* harmony export */   "parseActiveQuiz": () => (/* binding */ parseActiveQuiz),
/* harmony export */   "verifyQuiz": () => (/* binding */ verifyQuiz),
/* harmony export */   "exitModalPopupF": () => (/* binding */ exitModalPopupF),
/* harmony export */   "addquestionToDOM": () => (/* binding */ addquestionToDOM),
/* harmony export */   "addQuiz": () => (/* binding */ addQuiz),
/* harmony export */   "questionErrorParse": () => (/* binding */ questionErrorParse),
/* harmony export */   "exitModalPopupTemplate": () => (/* binding */ exitModalPopupTemplate),
/* harmony export */   "playQuiz": () => (/* binding */ playQuiz),
/* harmony export */   "deleteQuiz": () => (/* binding */ deleteQuiz),
/* harmony export */   "deleteQuizConfirm": () => (/* binding */ deleteQuizConfirm),
/* harmony export */   "editQuiz": () => (/* binding */ editQuiz),
/* harmony export */   "editQuizForm": () => (/* binding */ editQuizForm),
/* harmony export */   "shareQuiz": () => (/* binding */ shareQuiz),
/* harmony export */   "copyShareLink": () => (/* binding */ copyShareLink)
/* harmony export */ });
/* harmony import */ var dragula__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dragula */ "./node_modules/dragula/dragula.js");
/* harmony import */ var dragula__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dragula__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ "./src/js/app.js");
// Contains code related to making quizzes




var editState = false;
var quizObject2 = [];
const quizObject = {
	quizID: "",
	quizName: "",
	questionObjects: []
}
var drake = null;
var currentQuizEdit;
var iconIterate = 0;
var activeArea = null;
var highestQuestion = 0;
var tempQuiz = null;
var allowState2 = true;
var quizList2 = {};
var checkOnce = true;



window.addEventListener("beforeunload", (event) => {
	if (editState) {
		event.preventDefault();
		event.returnValue = ' ';
	}
});

function createQuiz() {
	if (checkOnce) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createButtonA').disabled = true;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('QuizName').disabled = false;
		clickEvents['modal-bg'] = () => {exitModalPopupTemplate('createQuizMenu')};
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('submitQuizID').disabled = false;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('QuizName').value = '';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createButtonA').classList.add('btnTransitionA');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').disabled = true;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').classList.add('btnTransitionA');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('submitQuizID').textContent = 'Create';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.animation = 'fadeIn 0.5s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('homeText2').classList.add('btnTransitionA');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createQuizMenu').style.animation = 'modalPopin 0.3s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createQuizMenu').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').classList.add('modal-popupActive');
		if (Object.keys(quizList2).length > 0) {
			for (var key in quizList2) {
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(key).classList.add('btnTransitionA');
			};
		}
	}
}

function goBackMakeA() {
	customOptionsIncrement = 0;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('homeText2').classList.add('titleTransition');
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(key).classList.add('btnTransitionA');
		};
	}
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createButtonA').classList.add('btnTransitionA');
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').classList.add('btnTransitionA');
	setTimeout(() => {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('title');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.setTitle)('homeScreen');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('title').style.height = "800px";
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('title').style.top = "15%";
		(0,_app__WEBPACK_IMPORTED_MODULE_2__.setCharImage)('currentUser', currentUserConfig);
	}, 300);
}

function createNewQuiz() {
	checkOnce = false;
	var button = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('submitQuizID');
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('QuizName').disabled = true;
	const g = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('QuizName').value;
	button.disabled = true;
	button.textContent = '';
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.createTemplate)('svgLoader', button.id);
	setTimeout(() => {
		checkOnce = true;
		quizList2[(0,_utils__WEBPACK_IMPORTED_MODULE_1__.uuidv4)()] = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.encodeHTML)(g);
		exitModalPopupTemplate('createQuizMenu');
	}, 1000);
}

function addQuestion() {
	addquestionToDOM();
	(0,_app__WEBPACK_IMPORTED_MODULE_2__.contentEditableUpdate)();
	reorderProper();
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapseSubArea${highestQuestion}`).focus();
}

function doneButtonA() {
	if (allowState2) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupB").style.animation = 'modalPopout2 0.5s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("editQuizMenu").style.animation = 'fadein 0.5s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("editQuizMenu").style.visibility = 'visible';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("saveQuizButton").disabled = false;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("backButtonEditQuiz").disabled = false;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("quizNameUpdate").disabled = false;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("addQuestionButton").disabled = false;
		reorderProper();
		setTimeout(function () {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupB").style = '';
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupB").style.visibility = 'none';
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupA").style.pointerEvents = "all";
		}, 500);
	}
}

function collapseSubArea(a) {
	var area = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapseSubArea${a}`);
	var objm = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapsableContent${a}`);
	area.classList.toggle('arrowBRight');
	area.classList.toggle('arrowBDown');
	objm.classList.toggle('contentA1');
	objm.classList.toggle('contentA2');
	if (activeArea !== null && activeArea !== a) {
		var area = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapseSubArea${activeArea}`);
		var objm = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
	}
	activeArea = a;
}

function collapseAllArea() {
	if (activeArea !== null && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapseSubArea${activeArea}`) != null) {
		var area = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapseSubArea${activeArea}`);
		var objm = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
		activeArea = null;
	}
}

function deleteQuestion(a) {
	collapseAllArea();
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`draggableQuestion${a}`).style.pointerEvents = 'none';
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`draggableQuestion${a}`).classList.add('btnTransitionA');
	setTimeout(() => {
		drake.remove((0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`draggableQuestion${a}`));
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`draggableQuestion${a}`).remove();
		reorderProper();
	}, 300);
}

function reorderProper() {
	var test = 0;
	for (var i = 0; i <= (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('draggableDiv').children.length - 1; i++) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('draggableDiv').children[i].firstElementChild.children[1].textContent = `Question ${i + 1}:`;
		test = i;
	}
	if(test >= 24) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('addQuestionButton').disabled = true;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('addQuestionButton').textContent = '25/25 questions';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('addQuestionButton').style.cursor = "no-drop";
	}
	else {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('addQuestionButton').disabled = false;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('addQuestionButton').textContent = 'add question...';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('addQuestionButton').style.cursor = "pointer";
	}
}

function shortAnswerToggle(endMe) {
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`answerContainerObject${endMe}`).classList.toggle('shortAnswerEditorStyles');
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`collapsableContent${endMe}`).classList.toggle('noSpaceEditor');
}

function toggleTime(order) {
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`Question${order}Time`).classList.toggle("displayTimeLimit");
}

function parseActiveQuiz() {
	tempQuiz = JSON.parse(JSON.stringify(quizObject));
	tempQuiz.quizName = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.encodeHTML)((0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("quizNameUpdate").value);
	tempQuiz.quizID = currentQuizEdit;
	if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("draggableDiv").firstElementChild) {
		var quizDoc = Array.from((0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("draggableDiv").children);
		quizDoc.forEach( (object) => {
			var timeLimit = false;
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
const verifyQuiz = () => {
	var quizParseError = [];
	var finalResult = document.createDocumentFragment();
	if (tempQuiz.questionObjects.length === 0) {
		quizParseError.push('No questions exist');
	}
	else {
		var nullSpace01 = [];
		var timeLimitViolation = [];
		var answerError0 = [];
		var answerError1 = [];
		var answerError2 = [];
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
		quizParseError.forEach((error) => {
			if(error != null) {
				finalResult.appendChild(document.createElement('li'));
				finalResult.lastElementChild.textContent = error;
			}
		});
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('innerError3');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('innerError3').appendChild(finalResult);
		return false;
	}
	else {
		return true;
	}
}

function exitModalPopupF(promptUser) {
	if(promptUser) {
		parseActiveQuiz();
		if((0,_utils__WEBPACK_IMPORTED_MODULE_1__.deepEqual)(tempQuiz, quizObject2[currentQuizEdit])) {
			exitModalPopupF(false);
		}
		else if(confirm("Are you sure you want to go back? Any unsaved changes will be lost!")) {
			exitModalPopupF(false);
		}
	}
	else {
		checkOnce = false;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.animation = 'fadeOut 0.5s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('editQuizMenu').style.animation = 'modalPopout 0.3s';
		setTimeout(() => {
			editState = false;
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('editQuizMenu').style = "";
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.display = 'none';
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('editQuizMenu').style.display = 'none';
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("saveQuizButton").disabled = false;
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("backButtonEditQuiz").disabled = false;
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("quizNameUpdate").disabled = false;
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("addQuestionButton").disabled = false;
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupA").style.pointerEvents = "all";
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('saveQuizButton');
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("saveQuizButton").textContent = 'Save';
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('draggableDiv');
			drake.destroy();
			highestQuestion = 0;
			checkOnce = true;
		}, 500);
		setTimeout(() => {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').style.display = 'none';
		}, 300);
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.setTitle)('makeMenu');
		addQuiz();
	}
}

function addquestionToDOM() {
	highestQuestion++;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.createTemplate)('templateQuestion', 'draggableDiv', '${highestQuestion}', highestQuestion);
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('draggableQuestion${highestQuestion}').id = `draggableQuestion${highestQuestion}`;
}

function addQuiz() {
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('makeDiv').innerHTML += `<button style="min-width: 300px; min-height: 300px;  margin-top: 30px; text-align: center; font-size: xx-large; margin-left: 30px;" class="button titleTransitionBack quizActionButton" id="${key}"><img src="../img/qIcon-${iconIterate % 4}.png" width="250"><br>${quizList2[key]}</button>`
			iconIterate++;
		};
		iconIterate = 0;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').remove();
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('removeButton').remove();
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('makeDiv').innerHTML += '<button style="min-width: 300px; min-height: 300px;  margin-top: 30px; text-align: center; font-size: xx-large;  max-width:300px; margin-left: 30px;" class="button titleTransitionBack" id="createButtonA"><img src="../img/createQuiz-2.png" width="250"><br>(Create quiz)</button>'
		;(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('makeDiv').innerHTML += '<br><br><div style="text-align:center; width: 100%25;"><button class="button titleTransitionBack" id="backButtonC">Back</button></div>';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('makeDiv').style.textAlign = 'center';
		document.querySelectorAll('.quizActionButton').forEach(item => {
			item.addEventListener('click', event => {
				if (checkOnce) {
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createButtonA').disabled = true;
					clickEvents['modal-bg'] = () => {exitModalPopupTemplate('manageQuizMenu')};
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('QuizName').disabled = false;
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('submitQuizID').disabled = false;
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('QuizName').value = '';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createButtonA').classList.add('btnTransitionA');
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').disabled = true;
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonC').classList.add('btnTransitionA');
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('submitQuizID').textContent = 'Create';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.animation = 'fadeIn 0.5s';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.display = 'block';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('quizNameTitleA').textContent = quizList2[event.currentTarget.id] + ":";
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('homeText2').classList.add('btnTransitionA');
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopin 0.3s';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.display = 'block';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('createQuizMenu').style.display = 'none';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').style.display = 'block';
					(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').classList.add('modal-popupActive');
					currentQuizEdit = event.currentTarget.id;
					if (Object.keys(quizList2).length > 0) {
						for (var key in quizList2) {
							(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(key).classList.add('btnTransitionA');
						};
					}
				}
			})
		})
		;(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('makeDiv').style.paddingLeft = "30px";
	}
}

const questionErrorParse = (arrayToParse, questionValueSingular, questionValuePlural) => {
	let output = 'Questions';
	if(arrayToParse.length == 1) {
		output = `Question ${arrayToParse[0]} ${questionValueSingular}`;
	}
	else if (arrayToParse.length == 2) {
		output = `Questions ${arrayToParse[0]} and ${arrayToParse[1]} ${questionValuePlural}`;
	}
	else if(arrayToParse != 0) {
		arrayToParse.forEach((error) => {
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

const exitModalPopupTemplate = (popupToKill, special = false) => {
	if (checkOnce || special) {
		checkOnce = false;
		special = special === true ? !special : special;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.animation = 'fadeOut 0.5s';
		setTimeout(() => {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.display = 'none';
			checkOnce = true;
		}, 500);
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(popupToKill).style.animation = 'modalPopout 0.3s';
		setTimeout(() => {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').style.display = 'none';
			if(special) {
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(special).style.display = 'none';
			}
		}, 300);
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.setTitle)('makeMenu');
		addQuiz();
	}
}

function playQuiz() {
	;(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-bg').style.display = 'none';
	}, 500);
	setTimeout(() => {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('title').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('mainTheme').play();
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('mainTheme').volume = 0.6;
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('teacherPlayScreen').style.display = 'block';
	}, 1000);
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('modal-popupA').style.display = 'none';
	}, 300);
}

function deleteQuiz() {
	checkOnce = false;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('deleteQuizConfirm').disabled = false;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonDeleteConfirm').disabled = false;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('deleteQuizConfirm');
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('deleteQuizConfirm').textContent = 'Delete';
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('deleteQuizConfirm').style.backgroundColor = 'orange';
	setTimeout(function () {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('quizDeleteConfirm').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('quizDeleteConfirm').style.animation = 'modalPopin 0.3s';
	}, 300);
}

function deleteQuizConfirm() {
	delete quizList2[currentQuizEdit];
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('deleteQuizConfirm').disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('backButtonDeleteConfirm').disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('deleteQuizConfirm').style.backgroundColor = null;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('deleteQuizCOnfirm');
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.createTemplate)('svgLoader', 'deleteQuizConfirm');
	setTimeout(function () {
		exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm');
	}, 1000);
}

function editQuiz() {
	checkOnce = false;
	editState = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	if (quizObject2[currentQuizEdit] === undefined) {
		quizObject2[currentQuizEdit] = JSON.parse(JSON.stringify(quizObject));
		quizObject2[currentQuizEdit].quizName = quizList2[currentQuizEdit];
		quizObject2[currentQuizEdit].quizID = currentQuizEdit;
	}
	else {
		quizObject2[currentQuizEdit].questionObjects.forEach(function (questionObject) {
			addquestionToDOM();
			var actualData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)(`draggableQuestion${highestQuestion}`).children[1].children;
			actualData[0].textContent = questionObject.questionName;
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.characterCount)(actualData[0], 90);
			actualData[3].children[0].children[0].checked = questionObject.shortAnswer;
			if (questionObject.shortAnswer) {
				shortAnswerToggle(highestQuestion);
			}
			actualData[4].children[0].children[0].checked = questionObject.timeLimit;
			if (typeof questionObject.timeLimit != "boolean") {
				toggleTime(highestQuestion);
				actualData[4].children[2].textContent = questionObject.timeLimit;
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.characterCount)(actualData[4].children[2], 3);
			}
			for (var i = 0; i < 4; i++) {
				actualData[5].children[i].children[0].textContent = questionObject.Answers[i].answer;
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.characterCount)(actualData[5].children[i].children[0], 50);
				actualData[5].children[i].children[2].children[0].checked = questionObject.Answers[i].correct;
			}
		});
		reorderProper();
	}
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('quizNameUpdate').value = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.decodeHTML)(quizList2[currentQuizEdit]);
	drake = dragula__WEBPACK_IMPORTED_MODULE_0___default()([(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('draggableDiv')], {
		moves: function (el, container, handle) {
			return handle.classList.contains('draggableActual');
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
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('editQuizMenu').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('editQuizMenu').style.animation = 'modalPopin 0.3s';
		(0,_app__WEBPACK_IMPORTED_MODULE_2__.contentEditableUpdate)();
	}, 300);
}

function editQuizForm() {
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupA").style.pointerEvents = "none";
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("saveQuizButton").disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("backButtonEditQuiz").disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("quizNameUpdate").disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("addQuestionButton").disabled = true;
	collapseAllArea();
	parseActiveQuiz();
	if (!verifyQuiz()) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("modal-popupB").style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("editQuizMenu").style.animation = 'fadeOut 0.5s';
		window.scrollTo(0, 0);
		allowState2 = false;
		setTimeout(function () {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("editQuizMenu").style.visibility = 'hidden';
			allowState2 = true;
		}, 500);
	}
	else {
		quizObject2[currentQuizEdit] = tempQuiz;
		quizList2[currentQuizEdit] = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.encodeHTML)((0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("quizNameUpdate").value);
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.clearChildren)('saveQuizButton');
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.createTemplate)('svgLoader', 'saveQuizButton');
		setTimeout(function () {
			exitModalPopupF(false);
		}, 1000);
		setTimeout(function () {
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("errorActual").textContent = 'Quiz Saved';
			(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("errorMessageA").style.display = "block";
			setTimeout(function () {
				(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("errorMessageA").style.display = "none";
			}, 1000);
		}, 1200);
	}
}

function shareQuiz() {
	checkOnce = false;
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('shareQuizMenu').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('shareQuizMenu').style.animation = 'modalPopin 0.3s';
	}, 300);
}

function copyShareLink() {
	navigator.clipboard.writeText((0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)('coolTextArea').textContent);
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("errorActual").textContent = 'Link Copied';
	(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("errorMessageA").style.display = "block";
	setTimeout(function () {
		(0,_utils__WEBPACK_IMPORTED_MODULE_1__.$)("errorMessageA").style.display = "none";
	}, 1000);
}

/***/ })

}]);