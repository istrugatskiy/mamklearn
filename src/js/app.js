// Defines imports and globals
import '../css/style.css';
import {$, mathClamp, getCaretCharacterOffsetWithin, characterCount, createTemplate, setTitle, throwExcept, setCaretPosition, signOut} from './utils';
import {eventHandle} from './events';
import {initParticles} from './loadParticles';
window.onSignIn = onSignIn;
window.studentGameProcessor = studentGameProcessor;
var customOptionsIncrement = 0;
window.customOptionsIncrement = customOptionsIncrement;
var currentUserConfig = [0, 0, 0, 0, 0];
window.currentUserConfig = currentUserConfig;

const quizStartTestCase = ' {"gameStart": true, "totalQuestions": 5, "currentQuestion": "If%20fish%20are%20fish", "choices": [ null ], "currentQuestionTime": 69, "questionID": 0 }';
window.anotherTestCase = '{ "isQuestionCorrect": false, "nextQuestion": null, "choices": [ null ], "currentQuestionTime": 20 }';
window.anotherTestCase2 = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ "Nabeel", "Nabeel2", "Nabeel3", "Nabeel4" ], "currentQuestionTime": 69 }';
window.anotherTestCase3 = '{ "gameFinish": true, "timeTillEnd": 180}';
var gameStateStudent = null;
console.log("%cUse link to get quiz answers:https://bit.ly/31Apj2U", "font-size: 32px;");
const customOptions = ["Eyes", "Nose", "Mouth", "Shirt", "Arms"];
var otherInterval;
const root = document.documentElement;
var bottomBarOffset;
var timerInterval;


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
	initParticles();
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

window.clickEvents = {
	"btn2": playCode,
	"makebtn": makeCode,
	"signOutbtn": signOut,
	"deleteQuizConfirm": () => {deleteQuizConfirm()},
	"deleteQuiz": () => {deleteQuiz()},
	"editQuiz": () => {editQuiz()},
	"addQuestionButton": () => {addQuestion()},
	"playQuiz": () => {playQuiz()},
	"doneButtonA": () => {doneButtonA()},
	"shareQuiz": () => {shareQuiz()},
	"backButtonEditQuiz": () => {exitModalPopupF(true)},
	"loginBtn": login,
	"customButtonChange": updateImageState,
	"customButtonChange2": updateImageState,
	"leftCustomizeArrow": () => {arrowButtonPress(true)},
	"arrowCustomizeRight": () => {arrowButtonPress(false)},
	"shortAnswerSubmitButton": submitShortAnswer,
	"backButtonC": () => {goBackMakeA()},
	"copyShareLink": () => {copyShareLink()},
	"playMenuBack": goBack,
	"AboutLink": () => {userClick('about.html')},
	"modal-bg": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonZ": () => {exitModalPopupTemplate('createQuizMenu')},
	"backButtonY": () => {exitModalPopupTemplate('manageQuizMenu')},
	"backButtonDeleteConfirm": () => {exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm')},
	"backButtonShareQuiz": () => {exitModalPopupTemplate('shareQuizMenu', 'shareQuizMenu')},
	"createButtonA": () => {createQuiz()},
	"backButtonDeleteConfirm": () => {exitModalPopupTemplate('quizDeleteConfirm', 'quizDeleteConfirm')},
	"aboutWindowButton": () => {userClick('index.html', true)}
};

// These are the events that include the text in the elements id.
window.clickIncludesEvents = {
	"studentQuizButton": (event) => {submitMultipleChoice(event)},
	"collapseSubArea": (event) => {collapseSubArea(getID(event.target.id))},
	"deleteQuestion": (event) => {deleteQuestion(getID(event.target.id))},
	"shortAnswerToggle": (event) => {shortAnswerToggle(getID(event.target.id))},
	"toggleTime": (event) => {toggleTime(getID(event.target.id))}
}

window.submitEvents = {
	"editQuizForm": () => {editQuizForm()},
	"joinQuizForm": JoinGame,
	"quizCreateForm": () => {createNewQuiz()}
};

window.keyboardIncludesEvents = {
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
	"studentShortAnswerText": (event) => {submitShortAnswer()}
	
}

window.addEventListener('resize', () => {
	if (gameStateStudent) {
		bottomBarOffset = 15;
		for (var i = 0; i <= gameStateStudent.currentQuestion; i++) {
			updateStudentLocation(i);
		}
	}
});

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
	answerQuestion($('studentShortAnswerText').textContent);
	clearInterval(timerInterval);
}

function login() {
	var auth2 = gapi.auth2.getAuthInstance();
	$('loginPage').style.display = "block";
	$('loginBtn').classList.add('buttonPressed');
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
	var profile = googleUser.getBasicProfile();
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
	import('./make').then( make => {
		Object.entries(make).forEach(([name, exported]) => window[name] = exported);
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
	}).catch ( error => {
		throwExcept('BIG_CHONK_ERROR');
	});
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

export function contentEditableUpdate() {
	var contentBoxes = document.querySelectorAll('[contenteditable]');
	for (let i = 0; i < contentBoxes.length; i++) {
		if (contentBoxes[i].getAttribute("initialized") != "true") {
			contentBoxes[i].setAttribute("initialized", "true");
			contentBoxes[i].addEventListener('drop', (event) => {
				event.preventDefault();
			});
			contentBoxes[i].addEventListener('input', (event) => {
				var a69 = getCaretCharacterOffsetWithin(event.target);
				setTimeout(() => {
					var a70 = String(event.target.textContent.replace(/(\r\n|\r|\n)/ , ""));
					event.target.innerText = a70.substring(0, event.target.getAttribute("maxlength"));
					try {
						setCaretPosition(event.target, a69);
					}
					catch {
						setCaretPosition(event.target, event.target.innerText.length);
					}
					characterCount(event.target, event.target.getAttribute("maxlength"));
				}, 0);
			});
		}
	}
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

export function setCharImage(charID, currentUserConfig) {
	$(charID + 'Eyes').src = `img/eyes-${currentUserConfig[0]}.png`;
	$(charID + 'Nose').src = `img/nose-${currentUserConfig[1]}.png`;
	$(charID + 'Mouth').src = `img/mouth-${currentUserConfig[2]}.png`;
	$(charID + 'Shirt').src = `img/shirt-${currentUserConfig[3]}.png`;
	$(charID + 'Arms').src = `img/arms-${currentUserConfig[4]}.png`;
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