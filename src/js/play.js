import {$, mathClamp, throwExcept} from './utils';
import {setCharImage, goBack} from './app';
window.studentGameProcessor = studentGameProcessor;

export const quizStartTestCase = ' {"gameStart": true, "totalQuestions": 5, "currentQuestion": "If%20fish%20are%20fish", "choices": [ null ], "currentQuestionTime": 69, "questionID": 0 }';
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
        clearTimeout(resettableTime);
        clearTimeout(resettableTime2);
		clearTimeout(resettableTime3);
		$('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
		$('titleButtonStudent').style.display = 'block';
		$('studentShortAnswer').classList.remove('transitionQuestionC');
		$('titleButtonStudent').classList.remove('transitionQuestionC');
        $('studentShortAnswer').style.display = 'block';
		$('titleButtonStudent').style.display = 'block';
        Array.from($('studentAnswersFlex').children).forEach((object) => {
            object.classList.remove('transitionQuestionB');
            object.style.display = 'block';
            object.classList.remove('transitionQuestionC');
        });
		$('errorMessageB').style.display = 'none';
		$('userNotifyPlay').style.display = 'none';
		$("errorActual").innerText = 'Kicked From Game';
		$("errorMessageA").style.display = 'block';
		$('gameStartScreenStudent').style.display = 'none';
		$('studentPlayScreen').style.display = 'none';
		var $loader = document.querySelector('.loader');
		$loader.classList.remove('loader--active');
		$('title').style.display = "block";
		$('gameFinishNotify').style.display = 'none';
        clearInterval(finishUpInterval);
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
		else if(inputInternal.isQuestionCorrect) {
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
					resettableTime = setTimeout(() => {
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
				resettableTime2 = setTimeout(() => {
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
		$('gameFinishNotify').style.display = 'block';
		gameStateStudent.timeLeft = inputInternal.timeTillEnd;
		$('gameFinishNotify').innerText = `The game will end in ${gameStateStudent.timeLeft}s`;
        var start = Date.now();
		var init = gameStateStudent.timeLeft;
		finishUpInterval = setInterval(() => {
			var delta = (Date.now() - start) / 1000;
			var internal = init - delta;
            if(internal < 0) {internal = 0};
            gameStateStudent.timeLeft = internal;
			$('gameFinishNotify').innerText = `The game will end in ${Math.floor(gameStateStudent.timeLeft)}s`;
		}, 100);
        resettableTime3 = setTimeout(() => {
            clearInterval(finishUpInterval);
			$('gameFinishNotify').style.animation = 'fadeOut 0.3s';
			setTimeout(() => {
				$('gameFinishNotify').style.display = 'none';
				$('gameFinishNotify').style.animation = 'flowFromTop 1s forwards';
			}, 300);
        }, gameStateStudent.timeLeft * 1000);
	}
	else if(inputInternal.hasOwnProperty('gameEnd')) {
		$('gameResults').style.display = 'block';
		setTimeout(() => {
			$('errorMessageB').style.display = 'none';
		}, 500);
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

export function updateStudentLocation(studentLocation) {
	var internalPercentage = mathClamp((studentLocation * 114) / window.innerWidth, 0, 1);
	if(internalPercentage > 0.75) {
		bottomBarOffset -= 114;
	}
	studentLocation = studentLocation - Math.abs((bottomBarOffset - 15) / 114);
	root.style.setProperty('--questionOffset', studentLocation);
	root.style.setProperty('--bottomBarOffset', bottomBarOffset + "px");
}

export function answerQuestion(answer) {
	console.log(answer);
}

export function submitMultipleChoice(event) {
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

export function submitShortAnswer() {
	$('studentShortAnswerText').contentEditable = false;
	$('shortAnswerSubmitButton').disabled = true;
	$('studentShortAnswerText').classList.add('contentEditableDisabled');
	answerQuestion($('studentShortAnswerText').textContent);
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