(self["webpackChunkmamklearn"] = self["webpackChunkmamklearn"] || []).push([["src_js_play_js"],{

/***/ "./src/js/play.js":
/*!************************!*\
  !*** ./src/js/play.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "quizStartTestCase": () => (/* binding */ quizStartTestCase),
/* harmony export */   "updateStudentLocation": () => (/* binding */ updateStudentLocation),
/* harmony export */   "answerQuestion": () => (/* binding */ answerQuestion),
/* harmony export */   "submitMultipleChoice": () => (/* binding */ submitMultipleChoice),
/* harmony export */   "submitShortAnswer": () => (/* binding */ submitShortAnswer)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/js/app.js");


window.studentGameProcessor = studentGameProcessor;

const quizStartTestCase = ' {"gameStart": true, "totalQuestions": 5, "currentQuestion": "If%20fish%20are%20fish", "choices": [ null ], "currentQuestionTime": 69, "questionID": 0 }';
window.anotherTestCase = '{ "isQuestionCorrect": false, "nextQuestion": null, "choices": [ null ], "currentQuestionTime": 20 }';
window.anotherTestCase2 = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ "Nabeel", "Nabeel2", "Nabeel3", "Nabeel4" ], "currentQuestionTime": 69 }';
window.anotherTestCase3 = '{ "gameFinish": true, "timeTillEnd": 180}';
window.anotherTestCase4 = '{ "gameEnd": true, "result-1st": "Ilya%20Strugatskiy", "1CharacterConfig": "0,0,1,2,9", "result-2nd": "Ilya%20Strugatskiy", "2CharacterConfig": "0,0,1,2,9", "result-3rd": "Ilya%20Strugatskiy", "3CharacterConfig": "0,0,1,2,9"}';
var otherInterval;
var timerInterval;
var finishUpInterval;
var gameStateStudent;
const root = document.documentElement;
var bottomBarOffset;
var resettableTime;
var resettableTime2;
var resettableTime3;

function studentGameProcessor(input) {
	var inputInternal = JSON.parse(input);
	if(inputInternal.hasOwnProperty('gameStart')) {
		if(inputInternal.gameStart == true) {
			clearInterval(timerInterval);
            clearInterval(finishUpInterval);
            clearInterval(otherInterval);
			(0,_app__WEBPACK_IMPORTED_MODULE_1__.setCharImage)('player', currentUserConfig);
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
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentRaceNumbers').innerHTML = studentRaceBoxNumbers + `<th>finish</th>`;
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameStartScreenStudent').style.animation = 'fadeOut 0.5s forwards';
			setTimeout(() => {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameStartScreenStudent').style.display = 'none';
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameStartScreenStudent').style.animation = '';
			}, 500);
			var $loader = document.querySelector(".loader");
			$loader.classList.remove('loader--active');
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('title').style.display = "none";
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentPlayScreen').style.display = "block";
			setQuestion();
			setTimeout(() => {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('loader-1').style.display = "none";
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)("errorMessageA").style.display = "none";
			}, 1000);
		}
	}
	else if (inputInternal.hasOwnProperty('error')) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.throwExcept)(inputInternal.error);
		gameStateStudent.gameErrorState = inputInternal.gameErrorState;
	}
	else if(inputInternal.hasOwnProperty('kickPlayer')) {
		clearInterval(timerInterval);
        clearTimeout(resettableTime);
        clearTimeout(resettableTime2);
		clearTimeout(resettableTime3);
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.remove('transitionQuestionC');
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.remove('transitionQuestionC');
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').style.display = 'block';
        Array.from((0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').children).forEach((object) => {
            object.classList.remove('transitionQuestionB');
            object.style.display = 'block';
            object.classList.remove('transitionQuestionC');
        });
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('errorMessageB').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('userNotifyPlay').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)("errorActual").textContent = 'Kicked From Game';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)("errorMessageA").style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameStartScreenStudent').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentPlayScreen').style.display = 'none';
		var $loader = document.querySelector('.loader');
		$loader.classList.remove('loader--active');
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('title').style.display = "block";
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').style.display = 'none';
        clearInterval(finishUpInterval);
		(0,_app__WEBPACK_IMPORTED_MODULE_1__.goBack)();
		gameStateStudent = null;
		setTimeout(() => {
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('loader-1').style.display = "none";
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)("errorMessageA").style.display = "none";
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
			Array.from((0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').children).forEach((object) => {
				object.classList.add('transitionQuestionB');
				setTimeout(() => {
					while(object.firstElementChild.firstChild) object.firstElementChild.removeChild(object.firstElementChild.lastChild);
					object.disabled = false;
					object.classList.remove('transitionQuestionB');
					object.classList.add('transitionQuestionC');
					setTimeout(() => {
						object.classList.remove('transitionQuestionC');
					}, 400);
				}, 400);
			});
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.add('transitionQuestionA');
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.add('transitionQuestionB');
			setTimeout(() => {
				setQuestion();
			}, 400);
			// Separate timeout to get on a separate thread and fix random flickering
			setTimeout(() => {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.add('transitionQuestionC');
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.remove('transitionQuestionB');
			}, 400);
			setTimeout(() => {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.remove('transitionQuestionA');
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.remove('transitionQuestionC');
			}, 800);
		}
		else if(inputInternal.isQuestionCorrect) {
			gameStateStudent.currentQuestion++;
			updateStudentLocation(gameStateStudent.currentQuestion);
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('errorMessageB').style.display = 'block';
		}
		else if(!inputInternal.isQuestionCorrect) {
			var start = Date.now();
			var init = inputInternal.currentQuestionTime;
			otherInterval = setInterval(() => {
				var delta = (Date.now() - start) / 1000;
				var internal = init - delta;
				if(internal < 0) {internal = 0};
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('mistakeQuestion').textContent = `You can try again in ${Math.floor(internal)} seconds`;
			}, 100);
			Array.from((0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').children).forEach((object) => {
				object.classList.add('transitionQuestionB');
				setTimeout(() => {
					object.style.display = 'none';
					while(object.firstElementChild.firstChild) object.firstElementChild.removeChild(object.firstElementChild.lastChild);
					object.disabled = false;
					object.classList.remove('transitionQuestionB');
					resettableTime = setTimeout(() => {
						object.style.display = 'block';
						object.classList.add('transitionQuestionC');
						setTimeout(() => {
							object.classList.remove('transitionQuestionC');
						}, 400);
					}, (inputInternal.currentQuestionTime * 1000));
				}, 400);
			});
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.add('transitionQuestionB');
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.add('transitionQuestionB');
			setTimeout(() => {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.remove('transitionQuestionB');
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.remove('transitionQuestionB');
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').style.display = 'none';
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').style.display = 'none';
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('userNotifyPlay').style.display = 'block';
				resettableTime2 = setTimeout(() => {
					(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('userNotifyPlay').classList.add('fadeOutThingy');
					(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.add('transitionQuestionC');
					(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.add('transitionQuestionC');
					(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').style.display = 'block';
					setQuestion();
					setTimeout(() => {
						(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').classList.remove('transitionQuestionC');
						(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').classList.remove('transitionQuestionC');
					}, 400);
					setTimeout(() => {
						clearInterval(otherInterval);
						(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('userNotifyPlay').style.display = 'none';
					}, 100);
				}, (inputInternal.currentQuestionTime * 1000));
			}, 400);
		}
	}
	else if(inputInternal.hasOwnProperty('gameFinish')) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').style.display = 'block';
		gameStateStudent.timeLeft = inputInternal.timeTillEnd;
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').textContent = `The game will end in ${gameStateStudent.timeLeft}s`;
        var start = Date.now();
		var init = gameStateStudent.timeLeft;
		finishUpInterval = setInterval(() => {
			var delta = (Date.now() - start) / 1000;
			var internal = init - delta;
            if(internal < 0) {internal = 0};
            gameStateStudent.timeLeft = internal;
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').textContent = `The game will end in ${Math.floor(gameStateStudent.timeLeft)}s`;
		}, 100);
        resettableTime3 = setTimeout(() => {
            clearInterval(finishUpInterval);
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').style.animation = 'fadeOut 0.3s';
			setTimeout(() => {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').style.display = 'none';
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
			}, 300);
        }, gameStateStudent.timeLeft * 1000);
	}
	else if(inputInternal.hasOwnProperty('gameEnd')) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('gameResults').style.display = 'block';
		setTimeout(() => {
			(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('errorMessageB').style.display = 'none';
		}, 500);
	}
}

function setQuestion() {
	if(!gameStateStudent) return;
	else {
		updateStudentLocation(gameStateStudent.currentQuestion);
	}
	(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').style.display = 'flex';
	(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('titleButtonStudent').firstElementChild.textContent = decodeURI(gameStateStudent.currentQuestionData.question);
	var options = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').children;
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
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('resettableCharLimited').textContent = '0/180';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').style.display = 'none';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswerText').textContent = null;
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswerText').classList.remove('contentEditableDisabled');
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswerText').contentEditable = true;
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('shortAnswerSubmitButton').disabled = false;
	}
	else {
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswer').style.display = 'none';
	}
	if (gameStateStudent.currentQuestionData.timeLimit == false) {
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('timeLeftCounter').style.display = 'none';
	}
	else {
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('timeLeftCounter').style.display = 'block';
		(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('timeLeftCounter').textContent = `(Time Left: ${gameStateStudent.currentQuestionData.timeLimit}s)`;
		var start = Date.now();
		var init = gameStateStudent.currentQuestionData.timeLimit;
		timerInterval = setInterval(() => {
			var delta = (Date.now() - start) / 1000;
			gameStateStudent.currentQuestionData.timeLimit = init - delta;
			if(gameStateStudent.currentQuestionData.timeLimit < 0 && gameStateStudent.currentQuestionData.timeLimit > -999) {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('timeLeftCounter').textContent = `(Time Penalty: ${Math.abs(Math.floor(gameStateStudent.currentQuestionData.timeLimit))}s)`;
			}
			else if(gameStateStudent.currentQuestionData.timeLimit < -999) {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('timeLeftCounter').textContent = `(You're very slow)`;
			}
			else {
				(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('timeLeftCounter').textContent = `(Time Left: ${Math.floor(gameStateStudent.currentQuestionData.timeLimit)}s)`;
			}
		}, 10); 
	}
}

function updateStudentLocation(studentLocation) {
	var internalPercentage = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.mathClamp)((studentLocation * 114) / window.innerWidth, 0, 1);
	if(internalPercentage > 0.75) {
		bottomBarOffset -= 114;
	}
	studentLocation = studentLocation - Math.abs((bottomBarOffset - 15) / 114);
	root.style.setProperty('--questionOffset', studentLocation);
	root.style.setProperty('--bottomBarOffset', bottomBarOffset + "px");
}

function answerQuestion(answer) {
	console.log(answer);
}

function submitMultipleChoice(event) {
	var response = event.target.id.charAt(event.target.id.length - 1);
	answerQuestion(response);
	clearInterval(timerInterval);
	Array.from((0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentAnswersFlex').children).forEach( (object, index) => {
		object.disabled = true;
		if(index + 1 == response) {
			while(object.firstElementChild.firstChild) object.firstElementChild.removeChild(object.firstElementChild.lastChild);
			object.firstElementChild.appendChild((0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('svgLoader').content.cloneNode(true));
		}
	});
}

function submitShortAnswer() {
	(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswerText').contentEditable = false;
	(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('shortAnswerSubmitButton').disabled = true;
	(0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswerText').classList.add('contentEditableDisabled');
	answerQuestion((0,_utils__WEBPACK_IMPORTED_MODULE_0__.$)('studentShortAnswerText').textContent);
	clearInterval(timerInterval);
}

window.addEventListener('resize', () => {
	if (gameStateStudent) {
		bottomBarOffset = 15;
		for (var i = 0; i <= gameStateStudent.currentQuestion; i++) {
			updateStudentLocation(i);
		}
	}
});

/***/ })

}]);