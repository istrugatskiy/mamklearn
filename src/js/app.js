<<<<<<< HEAD
// Definese the configuration data for particles js.
var ParticleData = {
	"particles": {
		"number": {
			"value": 25,
			"density": {
				"enable": true,
				"value_area": 800
			}
		},
		"color": {
			"value": "#ffffff"
		},
		"shape": {
			"type": "circle",
			"stroke": {
				"width": 0,
				"color": "#000000"
			},
			"polygon": {
				"nb_sides": 5
			},
			"image": {
				"src": "img/github.svg",
				"width": 100,
				"height": 100
			}
		},
		"opacity": {
			"value": 0.5,
			"random": true,
			"anim": {
				"enable": false,
				"speed": 1,
				"opacity_min": 0.1,
				"sync": false
			}
		},
		"size": {
			"value": 10,
			"random": true,
			"anim": {
				"enable": false,
				"speed": 40,
				"size_min": 0.1,
				"sync": false
			}
		},
		"line_linked": {
			"enable": false,
			"distance": 500,
			"color": "#ffffff",
			"opacity": 0.4,
			"width": 2
		},
		"move": {
			"enable": true,
			"speed": 6,
			"direction": "bottom",
			"random": false,
			"straight": false,
			"out_mode": "out",
			"bounce": false,
			"attract": {
				"enable": false,
				"rotateX": 600,
				"rotateY": 1200
			}
		}
	},
	"interactivity": {
		"detect_on": "canvas",
		"events": {
			"onhover": {
				"enable": true,
				"mode": "bubble"
			},
			"onclick": {
				"enable": true,
				"mode": "repulse"
			},
			"resize": true
		},
		"modes": {
			"grab": {
				"distance": 400,
				"line_linked": {
					"opacity": 0.5
				}
			},
			"bubble": {
				"distance": 400,
				"size": 4,
				"duration": 0.3,
				"opacity": 1,
				"speed": 3
			},
			"repulse": {
				"distance": 200,
				"duration": 0.4
			},
			"push": {
				"particles_nb": 4
			},
			"remove": {
				"particles_nb": 2
			}
		}
	},
	"retina_detect": false
};

import '../css/style.css';
import 'particles.js';
import dragula from'dragula';
window.onSignIn = onSignIn;

const jsonUri = "data:text/plain;base64," + window.btoa(JSON.stringify(ParticleData));
var currentQuizEdit;
var drake = null;
const quizStartTestCase = ' {"gameStart": true, "totalQuestions": 5, "currentQuestion": "If%20fish%20are%20fish", "choices": [ "heck", "null", "really%20I%20could%20not%20be%20bothered", "heckv2" ], "currentQuestionTime": 69, "questionID": 0 }';
const anotherTestCase = '{ "isQuestionCorrect": false, "nextQuestion": null, "choices": [ null ], "currentQuestionTime": 20 }';
const anotherTestCase2 = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ "Nabeel", "Nabeel2", "Nabeel3", "Nabeel4" ], "currentQuestionTime": 69 }';
const anotherTestCase3 = '{ "gameFinish": true, "timeTillEnd": 180}';
var gameStateStudent = null;
console.log("%cUse link to get quiz answers:https://bit.ly/31Apj2U", "font-size: 32px;");
const customOptions = ["Eyes", "Nose", "Mouth", "Shirt", "Arms"];
// for quiz object order does matter for answers!
const quizObject = {
	quizID: "",
	quizName: "",
	questionObjects: []
};
var quizObject2 = [];
var quizList2 = {};
var allowSubmit = true;
var activeArea = null;
var highestQuestion = 0;
var tempQuiz = null;
var checkOnce = true;
var allowState = true;
var allowState2 = true;
var editState = false;
var profile;
var otherInterval;
const root = document.documentElement;
var customOptionsIncrement = 0;
var iconIterate = 0;
var currentUserConfig = [0, 0, 0, 0, 0];
var bottomBarOffset;

// These are some helper functions used throughout the app!
const $ = (a) => {
	return document.getElementById(a);
}

const mathClamp = (num, min, max) => {
	return num <= min ? min : num >= max ? max : num;
}

const getCaretCharacterOffsetWithin = (element) => {
	var caretOffset = 0;
	var doc = element.ownerDocument || element.document;
	var win = doc.defaultView || doc.parentWindow;
	var sel;
	if (typeof win.getSelection != "undefined") {
		sel = win.getSelection();
		if (sel.rangeCount > 0) {
			var range = win.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		}
	} else if ((sel = doc.selection) && sel.type != "Control") {
		var textRange = sel.createRange();
		var preCaretTextRange = doc.body.createTextRange();
		preCaretTextRange.moveToElementText(element);
		preCaretTextRange.setEndPoint("EndToEnd", textRange);
		caretOffset = preCaretTextRange.text.length;
	}
	return caretOffset;
}

const characterCount = (thisVar, total) => {
	thisVar.nextElementSibling.innerHTML = `${thisVar.textContent.length}/${total}`;
	if (thisVar.innerText.length > total) {
		allowSubmit = false;
	}
}

const deepEqual = (object1, object2) => {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		const val1 = object1[key];
		const val2 = object2[key];
		const areObjects = isObject(val1) && isObject(val2);
		if (
			areObjects && !deepEqual(val1, val2) ||
			!areObjects && val1 !== val2
		) {
			return false;
		}
	}

	return true;
}

const isObject = (object) => {
	return object != null && typeof object === 'object';
}

// Creates object from template!
// Note modif can only replace children because of how templates work!
const createTemplate = (templateID, place, modif = false, replace = false) => {
	let content = $(templateID).content.cloneNode(true);
	if(modif) {
		for (var i = 0; i < content.children.length; i++) {
			content.children[i].innerHTML = content.children[i].innerHTML.replaceAll(modif, replace);
		}
		
	}
	$(place).appendChild(content);
}

const setTitle = (templateID) => {
	$('title').innerHTML = '';
	createTemplate(templateID, 'title');
}

const uuidv4 = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

const encodeHTML = (str) => {
	return str.replace(/[\u00A0-\u9999<>&#](?!#)/gim, function (i) {
		return '&#' + i.charCodeAt(0) + ';';
	});
}

const decodeHTML = (str) => {
	return str.replace(/&#([0-9]{1,5});/gi, function (match, num) {
		return String.fromCharCode(parseInt(num));
	});
}

const throwExcept = (msg) => {
	$('commError2').style.display = 'block';
	$('CommError').style.display = 'block';
	$('comError3').innerHTML = msg;
}

const setCaretPosition = (element, offset) => {
	var range = document.createRange();
	var sel = window.getSelection();

	//select appropriate node
	var currentNode = null;
	var previousNode = null;

	for (var i = 0; i < element.childNodes.length; i++) {
		//save previous node
		previousNode = currentNode;

		//get current node
		currentNode = element.childNodes[i];
		//if we get span or something else then we should get child node
		while (currentNode.childNodes.length > 0) {
			currentNode = currentNode.childNodes[0];
		}

		//calc offset in current node
		if (previousNode != null) {
			offset -= previousNode.length;
		}
		//check whether current node has enough length
		if (offset <= currentNode.length) {
			break;
		}
	}
	//move caret to specified offset
	if (currentNode != null) {
		range.setStart(currentNode, offset);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

const signOut = () => {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		window.location.reload();
	});
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
		$('modal-bg').style.animation = 'fadeOut 0.5s';
		setTimeout(() => {
			$('modal-bg').style.display = 'none';
			checkOnce = true;
		}, 500);
		$(popupToKill).style.animation = 'modalPopout 0.3s';
		setTimeout(() => {
			$('modal-popupA').style.display = 'none';
			if(special) {
				$(special).style.display = 'none';
			}
		}, 300);
		setTitle('makeMenu');
		addQuiz();
	}
}
// Helper functions end here!

const getID = (input) => {
	var inputChars = Array.from(input);
	var output = '';
	for (var i = inputChars.length; i >= 0; i--) {
		if(!Number.isNaN(Number.parseInt(inputChars[i]))) {
			output = inputChars[i] + output;
		}
	}
	return output;
}

const initializeApp = () => {
	contentEditableUpdate();
	const $loader = document.querySelector(".loader");
	$loader.classList.remove('loader--active');
	if (!window.location.href.includes("#performance-mode")) {
		particlesJS.load('particles-js', jsonUri);
	}
	if (new URLSearchParams(window.location.search).get('shareQuiz')) {
		setTimeout(() => {
			$("errorActual").innerText = 'Quiz Copied';
			$("errorMessageA").style.display = "block";
			setTimeout(function () {
				$("errorMessageA").style.display = "none";
				window.history.pushState({ "html": 1, "pageTitle": 5 }, "mamkLearn", "index.html");
			}, 1000);
		}, 500);
	}
}

// Defines the initial click events, if you want to pass parameters use a lambda!
var clickEvents = {
	"btn2": playCode,
	"makebtn": makeCode,
	"signOutbtn": signOut,
	"deleteQuizConfirm": deleteQuizConfirm,
	"deleteQuiz": deleteQuiz,
	"editQuiz": editQuiz,
	"addQuestionButton": addQuestion,
	"playQuiz": playQuiz,
	"doneButtonA": doneButtonA,
	"shareQuiz": shareQuiz,
	"backButtonEditQuiz": () => {exitModalPopupF(true)},
	"loginBtn": login,
	"customButtonChange": updateImageState,
	"customButtonChange2": updateImageState,
	"leftCustomizeArrow": () => {arrowButtonPress(true)},
	"arrowCustomizeRight": () => {arrowButtonPress(false)},
	"shortAnswerSubmitButton": submitShortAnswer,
	"backButtonC": goBackMakeA,
	"copyShareLink": copyShareLink,
	"playMenuBack": goBack,
	"AboutLink": () => {userClick('about.html')},
	"modal-bg": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonZ": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonY": () => {exitModalPopupTemplate('manageQuizMenu')},
	"backButtonDeleteConfirm": () => {exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm')},
	"backButtonShareQuiz": () => {exitModalPopupTemplate('shareQuizMenu', 'shareQuizMenu')},
	"createButtonA": createQuiz,
	"backButtonDeleteConfirm": () => {exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm')},
	"aboutWindowButton": () => {userClick('index.html', true)}
};

// These are the events that include the text in the elements id.
var clickIncludesEvents = {
	"studentQuizButton": (event) => {submitMultipleChoice(event)},
	"collapseSubArea": (event) => {collapseSubArea(getID(event.target.id))},
	"deleteQuestion": (event) => {deleteQuestion(getID(event.target.id))},
	"shortAnswerToggle": (event) => {shortAnswerToggle(getID(event.target.id))},
	"toggleTime": (event) => {toggleTime(getID(event.target.id))}
}

var submitEvents = {
	"editQuizForm": editQuizForm,
	"joinQuizForm": JoinGame,
	"quizCreateForm": createNewQuiz
};

var keyboardIncludesEvents = {
	"deleteQuestion": (event) => {deleteQuestion(getID(event.target.id))},
	"keyboardNavAnswer": (event) => {
		shortAnswerToggle(getID(event.target.id));
		$(event.target.id).previousElementSibling.firstElementChild.checked = !$(event.target.id).previousElementSibling.firstElementChild.checked;
	},
	"keyboardNavTime": (event) => {
		toggleTime(getID(event.target.id));
		$(event.target.id).previousElementSibling.firstElementChild.checked = !$(event.target.id).previousElementSibling.firstElementChild.checked;
	},
	"isCorrectQuestion": (event) => {$(event.target.id).children[0].checked = !$(event.target.id).children[0].checked},
	'studentShortAnswerText': (event) => {submitShortAnswer}
	
}

// Handles the majority of events.
const eventHandle = () => {
	window.addEventListener('click', (event) => {
		const keys = Object.keys(clickIncludesEvents);
		if (event.target.id in clickEvents) {
			clickEvents[event.target.id]();
		}
		for (var i = 0; i < keys.length; i++) {
			if (event.target.id.includes(keys[i])) {
				clickIncludesEvents[keys[i]](event);
				break;
			}
		}
	});
	window.addEventListener('keydown', event => {
		if(event.key == "Enter") {
			const keys = Object.keys(keyboardIncludesEvents);
			for (var i = 0; i < keys.length; i++) {
				if (event.target.id.includes(keys[i])) {
					keyboardIncludesEvents[keys[i]](event);
					break;
				}
			}
		}
	});
	window.addEventListener('submit', function (event) {
		event.preventDefault();
		if (event.target.id in submitEvents) {
			submitEvents[event.target.id]();
		}
	});
	window.addEventListener("beforeunload", function (event) {
		if (editState) {
			event.preventDefault();
			event.returnValue = ' ';
		}
	});
	window.addEventListener('resize', () => {
		if (gameStateStudent) {
			bottomBarOffset = 15;
			for (var i = 0; i <= gameStateStudent.currentQuestion; i++) {
				updateStudentLocation(i);
			}
		}
	});
}

// Initializes the app once its fully loaded.
window.addEventListener('load', () => {
	gapi.load('auth2', function () {
		gapi.auth2.init({
			client_id: '917106980205-im519fknf8sfb1jc1gs1tr6eafmto4vs.apps.googleusercontent.com',
		}).then( () => {
			initializeApp();
			eventHandle();
		}
		);
	});
});

function answerQuestion(answer) {
	console.log(answer);
}

function submitMultipleChoice(event) {
	var response = event.target.id.charAt(event.target.id.length - 1);
	answerQuestion(response);
	clearInterval(timerInterval);
	Array.from($('studentAnswersFlex').children).forEach( (object, index) => {
		object.disabled = true;
		if(index + 1 == response) {
			object.firstElementChild.innerHTML = '';
			object.firstElementChild.appendChild($('svgLoader').content.cloneNode(true));
		}
	});
}

function submitShortAnswer() {
	$('studentShortAnswerText').contentEditable = false;
	$('shortAnswerSubmitButton').disabled = true;
	$('studentShortAnswerText').classList.add('contentEditableDisabled');
	answerQuestion("testing!");
}

function shareQuiz() {
	checkOnce = false;
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		$('manageQuizMenu').style.display = 'none';
		$('shareQuizMenu').style.display = 'block';
		$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		$('shareQuizMenu').style.animation = 'modalPopin 0.3s';
	}, 300);
}

function login() {
	var auth2 = gapi.auth2.getAuthInstance();
	$('loginPage').style.display = "block";
	$('loginBtn').classList.add('buttonPressed');
}

function addQuestion() {
	addquestionToDOM();
	contentEditableUpdate();
	reorderProper();
	$(`collapseSubArea${highestQuestion}`).focus();
}

function doneButtonA() {
	if (allowState2) {
		$("modal-popupB").style.animation = 'modalPopout2 0.5s';
		$("editQuizMenu").style.animation = 'fadein 0.5s';
		$("editQuizMenu").style.visibility = 'visible';
		$("saveQuizButton").disabled = false;
		$("backButtonEditQuiz").disabled = false;
		$("quizNameUpdate").disabled = false;
		$("addQuestionButton").disabled = false;
		allowState = true;
		reorderProper();
		setTimeout(function () {
			$("modal-popupB").style = '';
			$("modal-popupB").style.visibility = 'none';
			$("modal-popupA").style.pointerEvents = "all";
		}, 500);
	}
}

function playQuiz() {
	$('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		$('modal-bg').style.display = 'none';
	}, 500);
	setTimeout(() => {
		$('title').style.display = 'none';
		$('mainTheme').play();
		$('mainTheme').volume = 0.6;
		$('teacherPlayScreen').style.display = 'block';
	}, 1000);
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		$('modal-popupA').style.display = 'none';
	}, 300);
}

function deleteQuiz() {
	checkOnce = false;
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	$('deleteQuizConfirm').disabled = false;
	$('backButtonDeleteConfirm').disabled = false;
	$('deleteQuizConfirm').innerHTML = 'Delete';
	$('deleteQuizConfirm').style.backgroundColor = 'orange';
	setTimeout(function () {
		$('manageQuizMenu').style.display = 'none';
		$('quizDeleteConfirm').style.display = 'block';
		$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		$('quizDeleteConfirm').style.animation = 'modalPopin 0.3s';
	}, 300);
}

function deleteQuizConfirm() {
	delete quizList2[currentQuizEdit];
	$('deleteQuizConfirm').disabled = true;
	$('backButtonDeleteConfirm').disabled = true;
	$('deleteQuizConfirm').style.backgroundColor = null;
	$('deleteQuizConfirm').innerHTML = '';
	createTemplate('svgLoader', 'deleteQuizConfirm');
	setTimeout(function () {
		exitModalPopupTemplate('quizDeleteConfirm', true);
	}, 1000);
}

function editQuiz() {
	checkOnce = false;
	editState = true;
	$('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	if (quizObject2[currentQuizEdit] === undefined) {
		quizObject2[currentQuizEdit] = JSON.parse(JSON.stringify(quizObject));
		quizObject2[currentQuizEdit].quizName = quizList2[currentQuizEdit];
		quizObject2[currentQuizEdit].quizID = currentQuizEdit;
	}
	else {
		quizObject2[currentQuizEdit].questionObjects.forEach(function (questionObject) {
			addquestionToDOM();
			var actualData = $(`draggableQuestion${highestQuestion}`).children[1].children;
			actualData[0].textContent = questionObject.questionName;
			characterCount(actualData[0], 90);
			actualData[3].children[0].children[0].checked = questionObject.shortAnswer;
			if (questionObject.shortAnswer) {
				shortAnswerToggle(highestQuestion);
			}
			actualData[4].children[0].children[0].checked = questionObject.timeLimit;
			if (typeof questionObject.timeLimit != "boolean") {
				toggleTime(highestQuestion);
				actualData[4].children[2].textContent = questionObject.timeLimit;
				characterCount(actualData[4].children[2], 3);
			}
			for (var i = 0; i < 4; i++) {
				actualData[5].children[i].children[0].textContent = questionObject.Answers[i].answer;
				characterCount(actualData[5].children[i].children[0], 50);
				actualData[5].children[i].children[2].children[0].checked = questionObject.Answers[i].correct;
			}
		});
		reorderProper();
	}
	$('quizNameUpdate').value = decodeHTML(quizList2[currentQuizEdit]);
	drake = dragula([$('draggableDiv')], {
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
		$('manageQuizMenu').style.display = 'none';
		$('editQuizMenu').style.display = 'block';
		$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		$('editQuizMenu').style.animation = 'modalPopin 0.3s';
		contentEditableUpdate();
	}, 300);
}

function editQuizForm() {
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
		allowState = false;
		allowState2 = false;
		setTimeout(function () {
			$("editQuizMenu").style.visibility = 'hidden';
			allowState2 = true;
		}, 500);
	}
	else {
		quizObject2[currentQuizEdit] = tempQuiz;
		quizList2[currentQuizEdit] = encodeHTML($("quizNameUpdate").value);
		$('saveQuizButton').innerHTML = '';
		createTemplate('svgLoader', 'saveQuizButton');
		setTimeout(function () {
			exitModalPopupF(false);
		}, 1000);
		setTimeout(function () {
			$("errorActual").innerText = 'Quiz Saved';
			$("errorMessageA").style.display = "block";
			setTimeout(function () {
				$("errorMessageA").style.display = "none";
			}, 1000);
		}, 1200);
	}
}

function userClick(e, g = false, nabeelIsGreat = false) {
	var $loader = document.querySelector(".loader");
	$loader.classList.add('loader--active');
	if (g) {
		$('aboutWindowButton').classList.add('buttonPressed');
	}
	if (nabeelIsGreat) {
		$('btn2').classList.add('buttonPressed');
	}
	setTimeout(function () {
		window.location.href = e;
	}, 1000);
};

function onSignIn(googleUser) {
	profile = googleUser.getBasicProfile();
	var $error = document.querySelector("#loginError1");
	var id_token = googleUser.getAuthResponse().id_token;
	var auth2 = gapi.auth2.getAuthInstance();
	// feel sorry for whoever reads this code - Ilya
	if (googleUser.getHostedDomain() == 'student.mamkschools.org' || googleUser.getHostedDomain() == 'mamkschools.org') {
		setTitle('homeScreen');
		$('loginPage').style.animation = 'animatezoomout 0.6s';
		$('title').style.top = "15%";
		$('title').style.height = "800px";
		setTimeout(function () {
			$('loginPage').style.display = "none";
		}, 500);
	} else {
		auth2.signOut();
		$error.style.display = 'block';
		$error.innerHTML = 'Please use an account that ends in \'mamkschools.org\' or \'student.mamkschools.org\'';
	}
};

// make and play on button click functions here!
function makeCode() {
	var makeButton = document.querySelector('#makebtn');
	var playButton = document.querySelector('#btn2');
	var signOutButton = document.querySelector('#signOutbtn');
	var title = document.querySelector('#homeText');
	makeButton.disabled = true;
	playButton.disabled = true;
	makeButton.innerHTML = '';
	createTemplate('svgLoader', makeButton.id);
	// replace this with request to server and await callback or if 5 seconds passes undo
	setTimeout(function () {
		title.classList.add('titleTransition');
		makeButton.classList.add('btnTransitionA');
		playButton.classList.add('btnTransitionA');
		makeButton.disabled = true;
		playButton.disabled = true;
		signOutButton.classList.add('linkTransitionF');
		$('charCustomize').classList.add('btnTransitionA');
		setTimeout(function () {
			setTitle('makeMenu');
			$('title').style.top = '100px';
			addQuiz();
		}, 300);
	}, 1000);
}

function createQuiz() {
	if (checkOnce) {
		$('createButtonA').disabled = true;
		$('QuizName').disabled = false;
		clickEvents['modal-bg'] = () => {exitModalPopupTemplate('createQuizMenu')};
		$('submitQuizID').disabled = false;
		$('QuizName').value = '';
		$('createButtonA').classList.add('btnTransitionA');
		$('backButtonC').disabled = true;
		$('backButtonC').classList.add('btnTransitionA');
		$('submitQuizID').innerHTML = 'Create';
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

function playCode() {
	var makeButton = document.querySelector('#makebtn');
	var playButton = document.querySelector('#btn2');
	var signOutButton = document.querySelector('#signOutbtn');
	var title = document.querySelector('#homeText');
	title.classList.add('titleTransition');
	makeButton.classList.add('btnTransitionA');
	playButton.classList.add('btnTransitionA');
	makeButton.disabled = true;
	playButton.disabled = true;
	signOutButton.classList.add('linkTransitionF');
	$('charCustomize').classList.add('btnTransitionA');
	setTimeout(function () {
		setTitle('playMenu');
		$('title').style.height = '250px';
		$('title').style.top = "30%";
	}, 300);
}

function JoinGame() {
	$("gameID").disabled = true;
	$("submitID").disabled = true;
	var selects = document.getElementsByTagName("a");
	for (var i = 0, il = selects.length; i < il; i++) {
		selects[i].className += " disabled";
	}
	$('submitID').innerHTML = '';
	createTemplate('svgLoader', 'submitID');
	if ($("gameID").value == "2794") {
		setTimeout(function () {
			$('loader-1').style.display = "none";
			var $loader = document.querySelector(".loader");
			$loader.classList.add('loader--active');
			setTimeout(function () {
				$("gameStartScreenStudent").style.display = 'block';
			}, 1000);
		}, 750);
		setTimeout(() => {
			studentGameProcessor(quizStartTestCase);
		}, 5000);
	} else {
		setTimeout(function () {
			$("errorActual").innerText = 'Invalid ID';
			$("gameID").disabled = false;
			$("submitID").disabled = false;
			$("errorMessageA").style.display = "block";
			setTimeout(function () {
				$("errorMessageA").style.display = "none";
			}, 1000);
			var selects = document.getElementsByTagName("a");
			for (var i = 0, il = selects.length; i < il; i++) {
				selects[i].classList.remove("disabled");
			}
			$('submitID').innerHTML = 'Join';
		}, 1000);
	}
}

function goBack() {
	document.querySelector('#codeText').classList.add('titleTransition');
	document.querySelector('#gameID').classList.add('btnTransitionA');
	document.querySelector('#submitID').classList.add('btnTransitionA');
	document.querySelector('#playMenuBack').classList.add('linkTransitionF');
	setTimeout(function () {
		setTitle('homeScreen');
		$('title').style.height = "800px";
		$('title').style.top = "15%";
		setCharImage('currentUser', currentUserConfig);
		customOptionsIncrement = 0;
	}, 300);
}

function arrowButtonPress(isLeft) {
	if (isLeft) {
		customOptionsIncrement = customOptionsIncrement - 1;
		if (customOptionsIncrement < 0) {
			customOptionsIncrement = 4;
		}
	} else {
		customOptionsIncrement = customOptionsIncrement + 1;
		if (customOptionsIncrement > 4) {
			customOptionsIncrement = 0;
		}
	}
	$("customButtonChange").innerHTML = customOptions[customOptionsIncrement];
	if(isLeft) {
		$("leftCustomizeArrow").focus();
	}
	else {
		$("arrowCustomizeRight").focus();
	}
}

function updateImageState() {
	currentUserConfig[customOptionsIncrement]++;
	if (currentUserConfig[customOptionsIncrement] > 9) {
		currentUserConfig[customOptionsIncrement] = 0;
	}
	setCharImage('currentUser', currentUserConfig);
}

function setCharImage(charID, currentUserConfig) {
	$(charID + 'Eyes').src = `img/eyes-${currentUserConfig[0]}.png`;
	$(charID + 'Nose').src = `img/nose-${currentUserConfig[1]}.png`;
	$(charID + 'Mouth').src = `img/mouth-${currentUserConfig[2]}.png`;
	$(charID + 'Shirt').src = `img/shirt-${currentUserConfig[3]}.png`;
	$(charID + 'Arms').src = `img/arms-${currentUserConfig[4]}.png`;
}

function addQuiz() {
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
				if (checkOnce) {
					$('createButtonA').disabled = true;
					clickEvents['modal-bg'] = () => {exitModalPopupTemplate('manageQuizMenu')};
					$('QuizName').disabled = false;
					$('submitQuizID').disabled = false;
					$('QuizName').value = '';
					$('createButtonA').classList.add('btnTransitionA');
					$('backButtonC').disabled = true;
					$('backButtonC').classList.add('btnTransitionA');
					$('submitQuizID').innerHTML = 'Create';
					$('modal-bg').style.animation = 'fadeIn 0.5s';
					$('modal-bg').style.display = 'block';
					$('quizNameTitleA').innerHTML = quizList2[event.currentTarget.id] + ":";
					$('homeText2').classList.add('btnTransitionA');
					$('manageQuizMenu').style.animation = 'modalPopin 0.3s';
					$('manageQuizMenu').style.display = 'block';
					$('createQuizMenu').style.display = 'none';
					$('modal-popupA').style.display = 'block';
					$('modal-popupA').classList.add('modal-popupActive');
					currentQuizEdit = event.currentTarget.id;
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

function goBackMakeA() {
	customOptionsIncrement = 0;
	$('backButtonC').disabled = true;
	$('homeText2').classList.add('titleTransition');
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			$(key).classList.add('btnTransitionA');
		};
	}
	$('createButtonA').classList.add('btnTransitionA');
	$('backButtonC').classList.add('btnTransitionA');
	setTimeout(function () {
		$('title').innerHTML = '';
		setTitle('homeScreen');
		$('title').style.height = "800px";
		$('title').style.top = "15%";
		setCharImage('currentUser', currentUserConfig);
	}, 300);
}

function createNewQuiz() {
	checkOnce = false;
	var button = $('submitQuizID');
	$('QuizName').disabled = true;
	var g = $('QuizName').value;
	button.disabled = true;
	button.innerHTML = '';
	createTemplate('svgLoader', button.id);
	setTimeout(function () {
		checkOnce = true;
		quizList2[uuidv4()] = encodeHTML(g);
		exitModalPopupTemplate('createQuizMenu');
	}, 1000);
}

function collapseSubArea(a) {
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

function collapseAllArea() {
	if (activeArea !== null && $(`collapseSubArea${activeArea}`) != null) {
		var area = $(`collapseSubArea${activeArea}`);
		var objm = $(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
		activeArea = null;
	}
}

function deleteQuestion(a) {
	collapseAllArea();
	$(`draggableQuestion${a}`).style.pointerEvents = 'none';
	$(`draggableQuestion${a}`).classList.add('btnTransitionA');
	setTimeout(function () {
		drake.remove($(`draggableQuestion${a}`));
		$(`draggableQuestion${a}`).remove();
		reorderProper();
	}, 300);
}

function reorderProper() {
	var test = 0;
	for (var i = 0; i <= $('draggableDiv').children.length - 1; i++) {
		$('draggableDiv').children[i].firstElementChild.children[1].innerHTML = `Question ${i + 1}:`;
		test = i;
	}
	if(test >= 24) {
		$('addQuestionButton').disabled = true;
		$('addQuestionButton').innerText = '25/25 questions';
		$('addQuestionButton').style.cursor = "no-drop";
	}
	else {
		$('addQuestionButton').disabled = false;
		$('addQuestionButton').innerText = 'add question...';
		$('addQuestionButton').style.cursor = "pointer";
	}
}

function contentEditableUpdate() {
	var contentBoxes = document.querySelectorAll('[contenteditable]');
	for (let i = 0; i < contentBoxes.length; i++) {
		if (contentBoxes[i].getAttribute("initialized") != "true") {
			contentBoxes[i].setAttribute("initialized", "true");
			contentBoxes[i].addEventListener('drop', function (event) {
				event.preventDefault();
			});
			contentBoxes[i].addEventListener('input', function () {
				var a69 = getCaretCharacterOffsetWithin(this);
				setTimeout(() => {
					var a70 = String(this.textContent.replace(/(\r\n|\r|\n)/ , ""));
					this.innerText = a70.substring(0, this.getAttribute("maxlength"));
					try {
						setCaretPosition(this, a69);
					}
					catch {
						setCaretPosition(this, this.innerText.length);
					}
					characterCount(this, this.getAttribute("maxlength"));
				}, 0);
			});
		}
	}
}

window.addEventListener("error", (e) => {
	if(e.hasOwnProperty('details')) {
		throwExcept('GAPI_ERROR');
	}
	else if (e.message.includes('Script error') || e.message.includes('TypeError')) {
		throwExcept('SCRIPT_ERROR');
	}
	else {
		console.log(e.message);
	}
});

function shortAnswerToggle(endMe) {
	$(`answerContainerObject${endMe}`).classList.toggle('shortAnswerEditorStyles');
	$(`collapsableContent${endMe}`).classList.toggle('noSpaceEditor');
}

function toggleTime(order) {
	$(`Question${order}Time`).classList.toggle("displayTimeLimit");
}

function parseActiveQuiz() {
	tempQuiz = JSON.parse(JSON.stringify(quizObject));
	tempQuiz.quizName = encodeHTML($("quizNameUpdate").value);
	tempQuiz.quizID = currentQuizEdit;
	if ($("draggableDiv").firstElementChild) {
		var quizDoc = Array.from($("draggableDiv").children);
		quizDoc.forEach(function (object) {
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
	var finalResult = '';
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
				finalResult += `<li class="innerError">${encodeHTML(error)}</li>`;
			}
		});
		$('innerError3').innerHTML = finalResult;
		return false;
	}
	else {
		return true;
	}
}

function exitModalPopupF(promptUser) {
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
		setTimeout(function () {
			editState = false;
			$('editQuizMenu').style = "";
			$('modal-bg').style.display = 'none';
			$('editQuizMenu').style.display = 'none';
			$("saveQuizButton").disabled = false;
			$("backButtonEditQuiz").disabled = false;
			$("quizNameUpdate").disabled = false;
			$("addQuestionButton").disabled = false;
			$("modal-popupA").style.pointerEvents = "all";
			$("saveQuizButton").innerHTML = "Save";
			$("draggableDiv").innerHTML = "";
			drake.destroy();
			highestQuestion = 0;
			checkOnce = true;
		}, 500);
		setTimeout(function () {
			$('modal-popupA').style.display = 'none';
		}, 300);
		setTitle('makeMenu');
		addQuiz();
	}
}

function addquestionToDOM() {
	highestQuestion++;
	createTemplate('templateQuestion', 'draggableDiv', '${highestQuestion}', highestQuestion);
	$('draggableQuestion${highestQuestion}').id = `draggableQuestion${highestQuestion}`;
}

function studentGameProcessor(input) {
	var inputInternal = JSON.parse(input);
	if(inputInternal.hasOwnProperty('gameStart')) {
		if(inputInternal.gameStart == true) {
			clearInterval(timerInterval);
			setCharImage('player', currentUserConfig);
			bottomBarOffset = 15;
			gameStateStudent = {
				currentQuestion: inputInternal.questionID,
				totalQuestions: inputInternal.totalQuestions,
				gameErrorState: false,
				timeLeft: false,
				currentQuestionData: {
					question: inputInternal.currentQuestion,
					answers: inputInternal.choices,
					timeLimit: inputInternal.currentQuestionTime
				}
			};
			var studentRaceBoxNumbers = '';
			for (var i = 1; i <= gameStateStudent.totalQuestions; i++) {
				studentRaceBoxNumbers += `<th>${i}</th>`
			}
			$('studentRaceNumbers').innerHTML = studentRaceBoxNumbers + `<th>finish</th>`;
			$('gameStartScreenStudent').style.display = "none";
			var $loader = document.querySelector(".loader");
			$loader.classList.remove('loader--active');
			$('title').style.display = "none";
			$('studentPlayScreen').style.display = "block";
			setQuestion();
			setTimeout(() => {
				$('loader-1').style.display = "none";
				$("errorMessageA").style.display = "none";
			}, 1000);
		}
	}
	else if (inputInternal.hasOwnProperty('error')) {
		throwExcept(inputInternal.error);
		gameStateStudent.gameErrorState = inputInternal.gameErrorState;
	}
	else if(inputInternal.hasOwnProperty('kickPlayer')) {
		clearInterval(timerInterval);
		$('errorMessageB').style.display = 'none';
		$('userNotifyPlay').style.display = 'none';
		$("errorActual").innerText = 'Kicked From Game';
		$("errorMessageA").style.display = 'block';
		$('gameStartScreenStudent').style.display = 'none';
		$('studentPlayScreen').style.display = 'none';
		var $loader = document.querySelector('.loader');
		$loader.classList.remove('loader--active');
		$('title').style.display = "block";
		goBack();
		gameStateStudent = null;
		setTimeout(() => {
			$('loader-1').style.display = "none";
			$("errorMessageA").style.display = "none";
		}, 1000);
	}
	else if(inputInternal.hasOwnProperty('isQuestionCorrect')) {
		clearInterval(timerInterval);
		clearInterval(otherInterval);
		if(inputInternal.isQuestionCorrect && gameStateStudent.currentQuestion < gameStateStudent.totalQuestions - 1) {
			gameStateStudent.currentQuestion++;
			gameStateStudent.currentQuestionData.question = inputInternal.nextQuestion;
			gameStateStudent.currentQuestionData.answers = inputInternal.choices;
			gameStateStudent.currentQuestionData.timeLimit = inputInternal.currentQuestionTime;
			Array.from($('studentAnswersFlex').children).forEach((object) => {
				object.classList.add('transitionQuestionB');
				setTimeout(() => {
					object.firstElementChild.innerHTML = null;
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
		}
		else if(inputInternal.isQuestionCorrect && gameStateStudent.currentQuestion < gameStateStudent.totalQuestions) {
			gameStateStudent.currentQuestion++;
			updateStudentLocation(gameStateStudent.currentQuestion);
			$('errorMessageB').style.display = 'block';
		}
		else if(!inputInternal.isQuestionCorrect) {
			var start = Date.now();
			var init = inputInternal.currentQuestionTime;
			otherInterval = setInterval(() => {
				var delta = (Date.now() - start) / 1000;
				var internal = init - delta;
				if(internal < 0) {internal = 0};
				$('mistakeQuestion').innerText = `You can try again in ${Math.floor(internal)} seconds`;
			}, 100);
			Array.from($('studentAnswersFlex').children).forEach((object) => {
				object.classList.add('transitionQuestionB');
				setTimeout(() => {
					object.style.display = 'none';
					object.firstElementChild.innerHTML = null;
					object.disabled = false;
					object.classList.remove('transitionQuestionB');
					setTimeout(() => {
						object.style.display = 'block';
						object.classList.add('transitionQuestionC');
						setTimeout(() => {
							object.classList.remove('transitionQuestionC');
						}, 400);
					}, (inputInternal.currentQuestionTime * 1000));
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
				setTimeout(() => {
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
				}, (inputInternal.currentQuestionTime * 1000));
			}, 400);
		}
	}
	else if(inputInternal.hasOwnProperty('gameFinish')) {
		console.log("Finish up...");
	}
}

var timerInterval;

function setQuestion() {
	if(!gameStateStudent) return;
	if(gameStateStudent.currentQuestion > gameStateStudent.totalQuestions) {
		//waiting for other players...
	}
	else {
		updateStudentLocation(gameStateStudent.currentQuestion);
	}
	$('studentAnswersFlex').style.display = 'flex';
	$('titleButtonStudent').firstElementChild.innerText = decodeURI(gameStateStudent.currentQuestionData.question);
	var options = $('studentAnswersFlex').children;
	for (var i = 0; i < options.length; i++) {
		if (!gameStateStudent.currentQuestionData.answers[i]) {
			options[i].style.display = 'none';
		}
		else {
			options[i].disabled = false;
			options[i].style.display = 'block';
			options[i].firstElementChild.textContent = decodeURI(gameStateStudent.currentQuestionData.answers[i]);
		}
	}
	if (gameStateStudent.currentQuestionData.answers.join("").length == 0) {
		$('resettableCharLimited').innerText = '0/180';
		$('studentAnswersFlex').style.display = 'none';
		$('studentShortAnswer').style.display = 'block';
		$('studentShortAnswerText').textContent = null;
		$('studentShortAnswerText').classList.remove('contentEditableDisabled');
		$('studentShortAnswerText').contentEditable = true;
		$('shortAnswerSubmitButton').disabled = false;
	}
	else {
		$('studentShortAnswer').style.display = 'none';
	}
	if (gameStateStudent.currentQuestionData.timeLimit == false) {
		$('timeLeftCounter').style.display = 'none';
	}
	else {
		$('timeLeftCounter').style.display = 'block';
		$('timeLeftCounter').innerText = `(Time Left: ${gameStateStudent.currentQuestionData.timeLimit}s)`;
		var start = Date.now();
		var init = gameStateStudent.currentQuestionData.timeLimit;
		timerInterval = setInterval(() => {
			var delta = (Date.now() - start) / 1000;
			gameStateStudent.currentQuestionData.timeLimit = init - delta;
			if(gameStateStudent.currentQuestionData.timeLimit < 0 && gameStateStudent.currentQuestionData.timeLimit > -999) {
				$('timeLeftCounter').innerText = `(Time Penalty: ${Math.abs(Math.floor(gameStateStudent.currentQuestionData.timeLimit))}s)`;
			}
			else if(gameStateStudent.currentQuestionData.timeLimit < -999) {
				$('timeLeftCounter').innerText = `(You're very slow)`;
			}
			else {
				$('timeLeftCounter').innerText = `(Time Left: ${Math.floor(gameStateStudent.currentQuestionData.timeLimit)}s)`;
			}
		}, 10); 
	}
}

function updateStudentLocation(studentLocation) {
	var internalPercentage = mathClamp((studentLocation * 114) / window.innerWidth, 0, 1);
	if(internalPercentage > 0.75) {
		bottomBarOffset -= 114;
	}
	studentLocation = studentLocation - Math.abs((bottomBarOffset - 15) / 114);
	root.style.setProperty('--questionOffset', studentLocation);
	root.style.setProperty('--bottomBarOffset', bottomBarOffset + "px");
}

function copyShareLink() {
	navigator.clipboard.writeText($('coolTextArea').textContent);
	$("errorActual").innerText = 'Link Copied';
	$("errorMessageA").style.display = "block";
	setTimeout(function () {
		$("errorMessageA").style.display = "none";
	}, 1000);
}