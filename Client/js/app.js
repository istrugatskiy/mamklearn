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
const jsonUri = "data:text/plain;base64," + window.btoa(JSON.stringify(ParticleData));
var currentQuizEdit;
var drake = null;
const quizStartTestCase = ' {"gameStart": true, "totalQuestions": 25, "currentQuestion": "If%20fish%20are%20fish", "choices": [ "heck", "null", "really%20I%20could%20not%20be%20bothered", "heckv2" ], "currentQuestionTime": 69, "questionID": 0 }';
const anotherTestCase = '{ "isQuestionCorrect": false, "nextQuestion": null, "choices": [ null ], "currentQuestionTime": 20 }';
const anotherTestCase2 = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ "Nabeel", "Nabeel2", "Nabeel3", "Nabeel4" ], "currentQuestionTime": 69 }';
const anotherTestCase3 = '{ "gameFinish": true, "timeTillEnd": 180}';
var gameStateStudent = null;
console.log("%cUse link to get quiz answers:https://bit.ly/31Apj2U", "font-size: 32px;");
const bottomBarHTML = '<div style="display: none;" id="containerBottomA" class=\"container\">\r\n\t\t\t<div class=\"centerA\">\r\n\t\t\t\t<div class=\"bottom-bar\">\r\n\t\t\t\t\t<div class=\"first\">\r\n\t\t\t\t\t\t<ul style=\"all: unset;\">\r\n\t\t\t\t\t\t\t<li class=\"float\">\r\n\t\t\t\t\t\t\t\t<a href=\"privacy.html\">Privacy Policy<\/a>\r\n\t\t\t\t\t\t\t<\/li>\r\n\t\t\t\t\t\t<\/ul>\r\n\t\t\t\t\t<\/div>\r\n\t\t\t\t\t<div class=\"center\">\r\n\t\t\t\t\t\t<ul style=\"all: unset;\">\r\n\t\t\t\t\t\t\t<li class=\"float\">\r\n\t\t\t\t\t\t\t\t<a href=\"tos.html\">Terms of Service<\/a>\r\n\t\t\t\t\t\t\t<\/li>\r\n\t\t\t\t\t\t<\/ul>\r\n\t\t\t\t\t<\/div>\r\n\t\t\t\t\t<div class=\"last\">\r\n\t\t\t\t\t\t<ul style=\"all: unset;\">\r\n\t\t\t\t\t\t\t<li class=\"float\" id=\"float\">\r\n\t\t\t\t\t\t\t\t<a class=\"btn\" href=\"javascript:void(0)\" id=\"AboutLink\">About<\/a>\r\n\t\t\t\t\t\t\t<\/li>\r\n\t\t\t\t\t\t<\/ul>\r\n\t\t\t\t\t<\/div>\r\n\t\t\t\t<\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>';
const newTitle = '<h1 id=\'homeText\' class=\"titleTransitionBack\">Home<\/h1><div id="charCustomize" class="button titleTransitionBack" tabindex="0"><p class="notifyTextChar" id="tapToCustom">Tap to customize...</p><div id="stableBody"><img src="../img/arms-0.png" id="currentUserArms" style="position: absolute;" alt="your arms" width="250"><img src="../img/eyes-0.png" style="position: absolute;" alt="your eyes" id="currentUserEyes" width="250"><img src="../img/nose-0.png" style="position: absolute;" id="currentUserNose" alt="your nose" width="250"><img src="../img/mouth-0.png" style="position: absolute;" id="currentUserMouth" alt="your mouth" width="250"><img src="../img/shirt-0.png" style="position: absolute;" id="currentUserShirt" alt="your shirt" width="250"><img src="../img/base.png" alt="your profile picture" width="250"></div><p class="notifyTextChar" id="customType"><a class="arrow left" id="leftCustomizeArrow" href="javascript:void(0)"></a><a id="customButtonChange" href="javascript:void(0)">Eyes</a><a class="arrow right" id="arrowCustomizeRight" href="javascript:void(0)"></a></p><img height="90" id="customButtonChange2" style="cursor: pointer;" alt="Tap to change button..." src="img/tapToChange.png"></div> </br><button class=\"button  titleTransitionBack\" id=\"makebtn\">Make<\/button><button class=\"button  titleTransitionBack\" id=\"btn2\">Play<\/button><div class=\"link-background titleTransitionBack\"><ul><li><a href=\"javascript:void(0);\" class=\"middle\" id=\"signOutbtn\" style=\"font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding-top: 20px; padding-bottom: 0px;\">Sign out<\/a> <\/li><\/ul><div></div><\/div>' + bottomBarHTML;
const playData = '<h1 class=\'titleTransitionBack\' id=\'codeText\'>Game Code:<\/h1><form id="joinQuizForm"><input autofocus type="text" class=\'titleTransitionBack formInput button\' required autocomplete="off" pattern=\'^[0-9]*$\'  maxlength="9" title="valid game ID" id="gameID" placeholder="Game Code" name="gameID"> <br> <br> <button class="button titleTransitionBack" id="submitID" type="submit">Join</button> <\/form> <div class=\"link-background\"><ul class="textOverrideA titleTransitionBack"><li><a href=\"javascript:void(0);\" class=\"middle\" id=\"playMenuBack\" style=\"font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding-top: 20px; padding-bottom: 0px;\">Back<\/a> <\/li><\/ul> <div></div><\/div>' + bottomBarHTML;
const makeData = '<h1 id=\'homeText\' class=\"titleTransitionBack\">Your Quizzes:<\/h1><div id="makeDiv"><div id="removeButton"><button class="button  titleTransitionBack" id="createButtonA"><p class="notifyTextChar">Tap to create a quiz...</p><img width="400" id="plusButtonImage" src="../img/createQuiz.png"></button><br><br></div><button class="button titleTransitionBack" id="backButtonC">Back</button></div>';
const svgData = '<svg version="1.1" id="loader-1" xmlns="www.w3.org/2000/svg" xmlns:xlink="www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="1" fill="#ffffff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"></path><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"></animateTransform></svg>';
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
		console.log('User signed out.');
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
	else {
		arrayToParse.forEach((error) => {
			if (arrayToParse.slice(-1)[0] != error) {
				output += ` ${error},`;
			}
			else {
				output += ` and ${error}`;
			}
		});
	}
	return (output ? output : null);
}

const exitModalPopupTemplate = (popupToKill, special = false) => {
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
			if(special) {
				$('quizDeleteConfirm').style.display = 'none';
			}
		}, 300);
		$('title').innerHTML = decodeURI(makeData);
		addQuiz();
	}
}
// Helper functions end here!

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
	"AboutLink": () => {userClick('About.html')},
	"modal-bg": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonZ": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonY": () => {exitModalPopupTemplate('manageQuizMenu')},
	"backButtonX": () => {exitModalPopupTemplate('quizDeleteConfirm', true)},
	"backButtonShareQuiz": exitModalPopupG,
	"createButtonA": createQuiz,
	"backButtonDeleteConfirm": () => {exitModalPopupTemplate('quizDeleteConfirm', true)}
};

var clickIncludesEvents = {
	"studentQuizButton": (event) => {submitMultipleChoice(event)},
	"collapseSubArea": (event) => {collapseSubArea(event.target.id.slice(-1))},
	"deleteQuestion": (event) => {deleteQuestion(event.target.id.slice(-1))},
	"shortAnswerToggle": (event) => {shortAnswerToggle(event.target.id.slice(-1))},
	"toggleTime": (event) => {toggleTime(event.target.id.slice(-1))}
}

var submitEvents = {
	"editQuizForm": editQuizForm,
	"joinQuizForm": JoinGame,
	"quizCreateForm": createNewQuiz
};

// Handles the majority of events.
const eventHandle = () => {
	window.addEventListener('click', (event) => {
		const keys = Object.keys(clickIncludesEvents);
		if (event.target.id in clickEvents) {
			clickEvents[event.target.id]();
		}
		for (i = 0; i < keys.length; i++) {
			if (event.target.id.includes(keys[i])) {
				clickIncludesEvents[keys[i]](event);
				break;
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
			for (i = 0; i <= gameStateStudent.currentQuestion; i++) {
				updateStudentLocation(i);
			}
		}
	});
	$('studentShortAnswerText').addEventListener('keydown', event => {
		if (event.key == "Enter") {
			submitShortAnswer();
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
			object.firstElementChild.innerHTML = svgData;
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
	auth2 = gapi.auth2.getAuthInstance();
	$('loginPage').style.display = "block";
	$('loginBtn').classList.add('buttonPressed');
}

function addQuestion() {
	addquestionToDOM();
	contentEditableUpdate();
	reorderProper();
	setTimeout(() => {
		$('addQuestionButton').blur();
	}, 300);
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
	$('deleteQuizConfirm').innerHTML = svgData;
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
			for(i = 0; i < 4; i++) {
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
		$("saveQuizButton").innerHTML = svgData;
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
		$('btn').classList.add('buttonPressed');
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
		try {
			// var xhr = new XMLHttpRequest();
			//xhr.onerror = function(e) { $error.style.display = 'block'; $error.innerHTML = 'A communication error occured';  auth2.signOut().then(function () {
			// console.log('User signed out.');
			// });};
			//  xhr.open('POST', 'api.mamklearn.com/loginVerify');
			//  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			//  xhr.onload = function() {
			//  console.log('Signed in as: ' + xhr.responseText);
			//  $('title').innerHTML = decodeURI(newTitle);
			//  $('loginPage').style.animation = 'animatezoomout 0.6s'; 
			//  setTimeout(function() {$('loginPage').style.display = "none";},500);
			//  };
			//  xhr.send('token=' + id_token);
		} catch (error) {
			//  $error.style.display = 'block';
			//  $error.innerHTML = 'A communication error occurred: ' + console.error();
			//  auth2.signOut().then(function () {
			//  console.log('User signed out.');
			//  });
		}
		//console.log('Signed in as: ' + xhr.responseText);
		$('title').innerHTML = decodeURI(newTitle);
		$('loginPage').style.animation = 'animatezoomout 0.6s';
		$('title').style.top = "15%";
		$('title').style.height = "800px";
		$('containerBottomA').classList.remove("containerLoginMenu");
		$('containerBottomA').classList.add("containerMainMenu");
		setTimeout(function () {
			$('loginPage').style.display = "none";
		}, 500);
	} else {
		auth2.signOut().then(function () {
			console.log('User signed out.');
		});
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
	makeButton.innerHTML = svgData;
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
			$('title').innerHTML = decodeURI(makeData);
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
		$('homeText').classList.add('btnTransitionA');
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
		$('title').innerHTML = decodeURI(playData);
		$('containerBottomA').classList.add("containerPlayMenu");
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
	$('submitID').innerHTML = `${svgData}`;
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
		$('title').innerHTML = decodeURI(newTitle);
		$('title').style.height = "800px";
		$('containerBottomA').classList.remove("containerLoginMenu");
		$('containerBottomA').classList.add("containerMainMenu");
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
	$("charCustomize").focus();
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
					$('homeText').classList.add('btnTransitionA');
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
	$('homeText').classList.add('titleTransition');
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			$(key).classList.add('btnTransitionA');
		};
	}
	$('createButtonA').classList.add('btnTransitionA');
	$('backButtonC').classList.add('btnTransitionA');
	setTimeout(function () {
		$('title').innerHTML = decodeURI(newTitle);
		$('title').style.height = "800px";
		$('containerBottomA').classList.remove("containerLoginMenu");
		$('containerBottomA').classList.add("containerMainMenu");
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
	button.innerHTML = svgData;
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
	for (i = 0; i <= $('draggableDiv').children.length - 1; i++) {
		$('draggableDiv').children[i].firstElementChild.childNodes[3].innerHTML = `Question ${i + 1}:`;
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

window.addEventListener("error", function (e) {
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
		quizDoc = Array.from($("draggableDiv").children);
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
	quizParseError = [];
	var finalResult = '';
	if (tempQuiz.questionObjects.length === 0) {
		quizParseError.push('No questions exist');
	}
	else {
		var quizParseError = [];
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
	if (quizParseError.join("").length == 0) {
		quizParseError.forEach((error) => {
			if(error !== 'Questions') {
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
		$('title').innerHTML = decodeURI(makeData);
		addQuiz();
	}
}

function addquestionToDOM() {
	highestQuestion++;
	const createdQuestion = `<div style="margin-top: -50px; position: relative;" class="draggable" id="draggableQuestion${highestQuestion}">
	<h3 style="font-family: 'Chelsea Market', cursive; color: white; text-align: left;"> <span class="draggableActual"><svg class="draggableActual" xmlns="http://www.w3.org/2000/svg" height="24" style="transform: scale(2);" viewBox="0 0 24 24" width="24"><path class="draggableActual" d="M0 0h24v24H0V0z" fill="none"/><path class="draggableActual" fill="white" d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></span> <span class="hackDoNotUse">Question ${highestQuestion}:</span><a id="collapseSubArea${highestQuestion}" href="javascript:void(0)" class="arrowBRight arrow"></a> <svg xmlns="http://www.w3.org/2000/svg" class="clickBoxGrey" id="deleteQuestion${highestQuestion}" viewBox="0 0 24 24" style="transform: scale(2); margin-left: 22px;" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></h3>
	<div id="collapsableContent${highestQuestion}" class="contentA2">
		<div autofocus class='titleTransitionBack textAreaConfig formInput button' required autocomplete="off" maxlength="90" title="Question 2" id="Question2InputText" onkeypress="return (this.innerText.length < 90)" contenteditable="true" placeholder="Question" name="Question2InputText"></div>
		<div class="charLimited"> 0/90</div>
		<br>
		<div class="checkboxCustomConfig" style="margin-top: 0px;">
			<label class="toggleButton toggleButtonPosition">
				<input type="checkbox" id="shortAnswerToggle${highestQuestion}">
				<div>
					<svg viewBox="0 0 44 44">
						<path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
					</svg>
				</div>
			</label>
			<p class="labelForCheck labelForCheckPosition">Short Answer</p>
		</div>
		<div class="checkboxCustomConfig" style="margin-top: 10px;">
			<label class="toggleButton toggleButtonPosition">
				<input type="checkbox" id="toggleTime${highestQuestion}">
				<div>
					<svg viewBox="0 0 44 44">
						<path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
					</svg>
				</div>
			</label>
			<p class="labelForCheck labelForCheckPosition">Time Limit</p>
			<div autofocus class='titleTransitionBack textAreaConfig formInput button questionInput timeLimitMagic' maxlength="3" onkeypress="return (this.innerText.length < 3)" autocomplete="off" id="Question${highestQuestion}Time" contenteditable="true"></div>
			<div class="charLimited charLimited2"> 0/3</div>
		</div>
		<div class="answerContainer" id="answerContainerObject${highestQuestion}">
			<div class="checkboxCustomConfig" style="margin-top: 50px;">
				<div autofocus class='titleTransitionBack textAreaConfig formInput button questionInput' required maxlength="50" onkeypress="return (this.innerText.length < 50)" autocomplete="off" title="Question 1" id="Question${highestQuestion}InputText" contenteditable="true" placeholder="Answer 1" name="Question${highestQuestion}InputText"></div>
				<div class="charLimited charLimited2"> 0/50</div>
				<label class="toggleButton weirdButton2">
					<input checked type="checkbox">
					<div>
						<svg viewBox="0 0 44 44">
							<path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
						</svg>
					</div>
				</label>
			</div>
			<div class="checkboxCustomConfig">
				<div autofocus class='titleTransitionBack textAreaConfig formInput button questionInput' required maxlength="50" onkeypress="return (this.innerText.length < 50)" autocomplete="off" title="Question 1" id="Question${highestQuestion}InputText" contenteditable="true" placeholder="Answer 2" name="Question${highestQuestion}InputText"></div>
				<div class="charLimited charLimited2"> 0/50</div>
				<label class="toggleButton weirdButton2">
					<input type="checkbox">
					<div>
						<svg viewBox="0 0 44 44">
							<path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
						</svg>
					</div>
				</label>
			</div>
			<div class="checkboxCustomConfig">
				<div autofocus class='titleTransitionBack textAreaConfig formInput button questionInput' required maxlength="50" onkeypress="return (this.innerText.length < 50)" autocomplete="off" title="Question 1" id="Question${highestQuestion}InputText" contenteditable="true" placeholder="Answer 3" name="Question${highestQuestion}InputText"></div>
				<div class="charLimited charLimited2"> 0/50</div>
				<label class="toggleButton weirdButton2">
					<input type="checkbox">
					<div>
						<svg viewBox="0 0 44 44">
							<path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
						</svg>
					</div>
				</label>
			</div>
			<div class="checkboxCustomConfig">
				<div autofocus class='titleTransitionBack textAreaConfig formInput button questionInput' required maxlength="50" onkeypress="return (this.innerText.length < 50)" autocomplete="off" title="Question 1" id="Question${highestQuestion}InputText" contenteditable="true" placeholder="Answer 4" name="Question${highestQuestion}InputText"></div>
				<div class="charLimited charLimited2"> 0/50</div>
				<label class="toggleButton weirdButton2">
					<input type="checkbox">
					<div>
						<svg viewBox="0 0 44 44">
							<path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path>
						</svg>
					</div>
				</label>
			</div>
		</div>
	</div>
</div>`;
	$('draggableDiv').insertAdjacentHTML('beforeEnd', createdQuestion);
}

function exitModalPopupG() {
	checkOnce = false;
	$('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		$('modal-bg').style.display = 'none';
		checkOnce = true;
	}, 500);
	$('shareQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		$('modal-popupA').style.display = 'none';
		$('shareQuizMenu').style.display = 'none';
	}, 300);
	$('title').innerHTML = decodeURI(makeData);
	addQuiz();
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
			for (i = 1; i <= gameStateStudent.totalQuestions; i++) {
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
		$('userNotifyPlay').style.display = 'none';
		$("errorActual").innerText = 'Kicked From Game';
		$("errorMessageA").style.display = "block";
		$('gameStartScreenStudent').style.display = "none";
		$('studentPlayScreen').style.display = "none";
		var $loader = document.querySelector(".loader");

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
	console.log(gameStateStudent);
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
	for (i = 0; i < options.length; i++) {
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