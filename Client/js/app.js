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
var jsonUri = "data:text/plain;base64," + window.btoa(JSON.stringify(ParticleData));
var a = false;
var currentQuizEdit;
var drake = null;
var quizStartTestCase = ' {"gameStart": true, "competitors": ["Nabeel", "Nabeel2", "Nabeel3", "Nabeel4", "Nabeel5"], "competitorConfigs": [[0,0,8,4,2], [0,0,8,4,2], [0,0,8,4,2], [0,0,8,4,2], [0,0,8,4,2]], "totalQuestions": 15, "currentQuestion": "If%20fish%20are%20fish", "choices": [ "heck", "null", "really%20I%20could%20not%20be%20bothered", "heckv2" ], "currentQuestionTime": 69, "questionID": 0 }';
var anotherTestCase = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ null ], "currentQuestionTime": 69 }';
var anotherTestCase2 = '{ "isQuestionCorrect": true, "nextQuestion": "heckDifferentQuestionTooLazyTooPutPercent", "choices": [ "Nabeel", "Nabeel2", "Nabeel3", "Nabeel4" ], "currentQuestionTime": 69 }';
var gameStateStudent = {};
console.log("%cUse link to get quiz answers:https://bit.ly/31Apj2U", "font-size: 32px;");
var css69 = `text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%); font-size: 40px;`;
console.log("%cMamklearn:                                                                                                      Version: 1.0.0                                                                                                             Dev. Build                                                                                                                     Particles-js V.2                                                                                                                                                                                                                       gapi OAuth 2.0 ", css69);
if (!window.location.href.includes("#performance-mode")) {
	particlesJS.load('particles-js', jsonUri, function () { });
}
//const bottomBarHTML = '<div id="containerBottomA" style="display: none;" class="container"> <div class="centerA"> <div class="bottom-bar"> <div class="first"><ul style="all:unset;"> <li class="float" ><a href="privacy.html" >Privacy Policy</a></li></ul> </div> <div class="center"> <ul style="all:unset;"><li class="float"><a href="tos.html">Terms of Service</a></li></ul> </div> <div class="last"> <ul style="all:unset;"><li class="float" id="float"><a class="btn" href="javascript:void(0)" onclick="userClick(\'about.html\')" id="AboutLink">About</a></li></ul> </div> </div> </div> </div>';
const bottomBarHTML = '<div style="display: none;" id="containerBottomA" class=\"container\">\r\n\t\t\t<div class=\"centerA\">\r\n\t\t\t\t<div class=\"bottom-bar\">\r\n\t\t\t\t\t<div class=\"first\">\r\n\t\t\t\t\t\t<ul style=\"all: unset;\">\r\n\t\t\t\t\t\t\t<li class=\"float\">\r\n\t\t\t\t\t\t\t\t<a href=\"privacy.html\">Privacy Policy<\/a>\r\n\t\t\t\t\t\t\t<\/li>\r\n\t\t\t\t\t\t<\/ul>\r\n\t\t\t\t\t<\/div>\r\n\t\t\t\t\t<div class=\"center\">\r\n\t\t\t\t\t\t<ul style=\"all: unset;\">\r\n\t\t\t\t\t\t\t<li class=\"float\">\r\n\t\t\t\t\t\t\t\t<a href=\"tos.html\">Terms of Service<\/a>\r\n\t\t\t\t\t\t\t<\/li>\r\n\t\t\t\t\t\t<\/ul>\r\n\t\t\t\t\t<\/div>\r\n\t\t\t\t\t<div class=\"last\">\r\n\t\t\t\t\t\t<ul style=\"all: unset;\">\r\n\t\t\t\t\t\t\t<li class=\"float\" id=\"float\">\r\n\t\t\t\t\t\t\t\t<a class=\"btn\" href=\"javascript:void(0)\" id=\"AboutLink\" onclick=\"userClick(\'about.html\')\">About<\/a>\r\n\t\t\t\t\t\t\t<\/li>\r\n\t\t\t\t\t\t<\/ul>\r\n\t\t\t\t\t<\/div>\r\n\t\t\t\t<\/div>\r\n\t\t\t<\/div>\r\n\t\t<\/div>';
const newTitle = '<h1 id=\'homeText\' class=\"titleTransitionBack\">Home<\/h1><div id="charCustomize" class="button titleTransitionBack" tabindex="0"><p class="notifyTextChar" id="tapToCustom">Tap to customize...</p><div id="stableBody"><img src="../img/arms-0.png" id="currentUserArms" style="position: absolute;" alt="your arms" width="250"><img src="../img/eyes-0.png" style="position: absolute;" alt="your eyes" id="currentUserEyes" width="250"><img src="../img/nose-0.png" style="position: absolute;" id="currentUserNose" alt="your nose" width="250"><img src="../img/mouth-0.png" style="position: absolute;" id="currentUserMouth" alt="your mouth" width="250"><img src="../img/shirt-0.png" style="position: absolute;" id="currentUserShirt" alt="your shirt" width="250"><img src="../img/base.png" alt="your profile picture" width="250"></div><p class="notifyTextChar" id="customType"><a class="arrow left" id="leftCustomizeArrow" href="javascript:void(0)"></a><a id="customButtonChange" href="javascript:void(0)">Eyes</a><a class="arrow right" id="arrowCustomizeRight" href="javascript:void(0)"></a></p><img height="90" id="customButtonChange2" style="cursor: pointer;" alt="Tap to change button..." src="img/tapToChange.png"></div> </br><button class=\"button  titleTransitionBack\" id=\"makebtn\">Make<\/button><button class=\"button  titleTransitionBack\" id=\"btn2\">Play<\/button><div class=\"link-background titleTransitionBack\"><ul><li><a href=\"javascript:void(0);\" class=\"middle\" id=\"signOutbtn\" style=\"font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding-top: 20px; padding-bottom: 0px;\">Sign out<\/a> <\/li><\/ul><div id=\'underline\'></div><\/div>' + bottomBarHTML;
const playData = '<h1 class=\'titleTransitionBack\' id=\'codeText\'>Game Code:<\/h1><form id="joinQuizForm"><input autofocus type="text" class=\'titleTransitionBack formInput button\' required autocomplete="off" pattern=\'^[0-9]*$\'  maxlength="9" title="valid game ID" id="gameID" placeholder="Game Code" name="gameID"> <br> <br> <button class="button titleTransitionBack" id="submitID" type="submit">Join</button> <\/form> <div class=\"link-background\"><ul class="textOverrideA titleTransitionBack"><li><a href=\"javascript:void(0);\" class=\"middle\" id=\"playMenuBack\" style=\"font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; padding-top: 20px; padding-bottom: 0px;\" onclick=\"goBack();\">Back<\/a> <\/li><\/ul> <div id=\'underline\'></div><\/div>' + bottomBarHTML;
const makeData = '<h1 id=\'homeText\' class=\"titleTransitionBack\">Your Quizzes:<\/h1><div id="makeDiv"><div id="removeButton"><button class="button  titleTransitionBack" id="createButtonA"><p class="notifyTextChar">Tap to create a quiz...</p><img width="400" id="plusButtonImage" src="../img/createQuiz.png"></button><br><br></div><button class="button titleTransitionBack" id="backButtonC" onclick="goBackMakeA()">Back</button></div>';
const svgData = '<svg version="1.1" id="loader-1" xmlns="www.w3.org/2000/svg" xmlns:xlink="www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"><path opacity="1" fill="#ffffff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path><path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"></path><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0" to="360" dur="0.5s" repeatCount="indefinite"></animateTransform></svg>';
var customOptions = ["Eyes", "Nose", "Mouth", "Shirt", "Arms"];
var quizList = {
	"177644": "Ilya's funny quiz 1",
	"294332": "Ilya's not so funny quiz 2 !aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
	"922132": "Ilya's funny quiz 2",
	"687213": "Ilya's funny quiz 3",
	"238051": "Ilya's funny quiz 4"
};
// for quiz object order does matter for answers,
const quizObject = {
	quizID: "",
	quizName: "",
	questionObjects: []
};
const questionObject = {
	questionName: "",
	shortAnswer: false,
	timeLimit: 0,
	Answers: [{
		answer: "",
		correct: false
	}, {
		answer: "",
		correct: false
	}, {
		answer: "",
		correct: false
	}, {
		answer: "",
		correct: false
	}]
};
var quizObject2 = [];
var quizList2 = {};
var allowSubmit = true;
var activeArea = 1;
var highestQuestion = 0;
var temp41 = null;
var temp42 = null;
var tempQuiz = null;
var allowState = true;
var minHeight = null;
var allowState2 = true;
var editState = false;
var currentDisconnectInstance = 0;
window.onload = function () {
	gapi.load('auth2', function () {
		gapi.auth2.init({
			client_id: '917106980205-im519fknf8sfb1jc1gs1tr6eafmto4vs.apps.googleusercontent.com',
		}).then(function () {
			contentEditableUpdate();
			var $loader = document.querySelector(".loader");
			$loader.classList.remove('loader--active');
			document.getElementById('quizCreateForm').addEventListener('submit', createNewQuiz);
			var auth2 = gapi.auth2.getAuthInstance();
			if(new URLSearchParams(window.location.search).get('shareQuiz')) {
				setTimeout(() => {
					document.getElementById("errorActual").innerText = 'Quiz Copied';
					document.getElementById("errorMessageA").style.display = "block";
					setTimeout(function () {
						document.getElementById("errorMessageA").style.display = "none";
						window.history.pushState({"html": 1,"pageTitle": 5},"mamkLearn", "index.html");
					}, 1000);
				}, 500);
			}
			window.addEventListener("beforeunload", function (event) {
				if(editState) {
					event.preventDefault();
					event.returnValue = ' ';
				}
			});
			document.getElementById('editQuizForm').addEventListener('submit', function (event) {
				event.preventDefault();
				document.getElementById("modal-popupA").style.pointerEvents = "none";
				document.getElementById("saveQuizButton").disabled = true;
				document.getElementById("backButtonEditQuiz").disabled = true;
				document.getElementById("quizNameUpdate").disabled = true;
				document.getElementById("addQuestionButton").disabled = true;
				collapseAllArea();
				parseActiveQuiz();
				if(!verifyQuiz()) {
					document.getElementById("modal-popupB").style.display = 'block';
					document.getElementById("editQuizMenu").style.animation = 'fadeOut 0.5s';
					window.scrollTo(0, 0);
					allowState = false;
					allowState2 = false;
					setTimeout(function () {
						document.getElementById("editQuizMenu").style.visibility = 'hidden';
						allowState2 = true;
					}, 500);
				}
				else {
					quizObject2[currentQuizEdit] = tempQuiz;
					quizList2[currentQuizEdit] = encodeHTML(document.getElementById("quizNameUpdate").value);
					document.getElementById("saveQuizButton").innerHTML = svgData;
					setTimeout(function () {
						exitModalPopupF(false);
					}, 1000);
					setTimeout(function () {
						document.getElementById("errorActual").innerText = 'Quiz Saved';
						document.getElementById("errorMessageA").style.display = "block";
						setTimeout(function () {
							document.getElementById("errorMessageA").style.display = "none";
						}, 1000);
					},1200);
				} 
			});
			document.getElementById('studentShortAnswerText').addEventListener('keydown', event => {
				if(event.key == "Enter") {
					submitShortAnswer();
				}
			});
		});
	});
}

window.addEventListener('click', function (event) {
	switch(event.target.id) {
		case "btn2":
			playCode();
			break;
		case "makebtn":
			makeCode();
			break;
		case "signOutbtn":
			signOut();
			break;
		case "deleteQuiuzConfirm":
			deleteQuizConfirm();
			break;
		case "deleteQuiz":
			deleteQuiz();
			break;
		case "editQuiz":
			editQuiz();
			break;
		case "addQuestionButton":
			addQuestion();
			break;
		case "playQuiz":
			playQuiz();
			break;
		case "doneButtonA":
			doneButtonA();
			break;
		case "shareQuiz":
			shareQuiz();
			break;
		case "backButtonEditQuiz":
			exitModalPopupF(true);
			break;
		case "loginBtn":
			login();
			break;
		case "customButtonChange":
			updateImageState();
			break;
		case "customButtonChange2":
			updateImageState();
			break;
		case "leftCustomizeArrow":
			arrowButtonPress(true);
			break;
		case "arrowCustomizeRight":
			arrowButtonPress(false);
			break;
		case "shortAnswerSubmitButton":
			submitShortAnswer();
			break;
	}
	if(event.target.id.includes("studentQuizButton")) {
		submitMultipleChoice(event);
	}

});

function answerQuestion(answer) {
	console.log(answer);
}

function submitMultipleChoice(event) {
	var response = event.target.id.charAt(event.target.id.length - 1);
	answerQuestion(response);
	Array.from(document.getElementById('studentAnswersFlex').children).forEach( (object, index) => {
		object.disabled = true;
		if(index + 1 == response) {
			object.firstElementChild.innerHTML = svgData;
		}
	});
}

function submitShortAnswer() {
	document.getElementById('studentShortAnswerText').contentEditable = false;
	document.getElementById('shortAnswerSubmitButton').disabled = true;
	document.getElementById('studentShortAnswerText').classList.add('contentEditableDisabled');
	answerQuestion("testing!");
}

function shareQuiz() {
	checkOnce = false;
	document.getElementById('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		document.getElementById('manageQuizMenu').style.display = 'none';
		document.getElementById('shareQuizMenu').style.display = 'block';
		document.getElementById('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		document.getElementById('shareQuizMenu').style.animation = 'modalPopin 0.3s';
	}, 300);
}

function login() {
	a = true;
	auth2 = gapi.auth2.getAuthInstance();
	document.getElementById('loginPage').style.display = "block";
	document.getElementById('loginBtn').classList.add('buttonPressed');
}

function addQuestion() {
	addquestionToDOM();
	contentEditableUpdate();
	reorderProper();
	setTimeout(() => {
		document.getElementById('addQuestionButton').blur();
	}, 300);
}

function doneButtonA() {
	if (allowState2) {
		document.getElementById("modal-popupB").style.animation = 'modalPopout2 0.5s';
		document.getElementById("editQuizMenu").style.animation = 'fadein 0.5s';
		document.getElementById("editQuizMenu").style.visibility = 'visible';
		document.getElementById("saveQuizButton").disabled = false;
		document.getElementById("backButtonEditQuiz").disabled = false;
		document.getElementById("quizNameUpdate").disabled = false;
		document.getElementById("addQuestionButton").disabled = false;
		allowState = true;
		reorderProper();
		setTimeout(function () {
			document.getElementById("modal-popupB").style = '';
			document.getElementById("modal-popupB").style.visibility = 'none';
			document.getElementById("modal-popupA").style.pointerEvents = "all";
		}, 500);
	}
}

function playQuiz() {
	document.getElementById('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		document.getElementById('modal-bg').style.display = 'none';
	}, 500);
	setTimeout(() => {
		document.getElementById('title').style.display = 'none';
		document.getElementById('mainTheme').play();
		document.getElementById('teacherPlayScreen').style.display = 'block';
	}, 1000);
	document.getElementById('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		document.getElementById('modal-popupA').style.display = 'none';
	}, 300);
}

function deleteQuiz() {
	checkOnce = false;
	document.getElementById('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	document.getElementById('deleteQuizConfirm').disabled = false;
	document.getElementById('backButtonDeleteConfirm').disabled = false;
	document.getElementById('deleteQuizConfirm').innerHTML = 'Delete';
	document.getElementById('deleteQuizConfirm').style.backgroundColor = 'orange';
	setTimeout(function () {
		document.getElementById('manageQuizMenu').style.display = 'none';
		document.getElementById('quizDeleteConfirm').style.display = 'block';
		document.getElementById('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		document.getElementById('quizDeleteConfirm').style.animation = 'modalPopin 0.3s';
	}, 300);
}

function deleteQuizConfirm() {
	delete quizList2[currentQuizEdit];
	document.getElementById('deleteQuizConfirm').disabled = true;
	document.getElementById('backButtonDeleteConfirm').disabled = true;
	document.getElementById('deleteQuizConfirm').style.backgroundColor = null;
	document.getElementById('deleteQuizConfirm').innerHTML = svgData;
	setTimeout(function () {
		exitModalPopupC();
	}, 1000);
}

function editQuiz() {
	checkOnce = false;
	editState = true;
	document.getElementById('manageQuizMenu').style.animation = 'modalPopout 0.3s';
	if (quizObject2[currentQuizEdit] === undefined) {
		quizObject2[currentQuizEdit] = JSON.parse(JSON.stringify(quizObject));
		quizObject2[currentQuizEdit].quizName = quizList2[currentQuizEdit];
		quizObject2[currentQuizEdit].quizID = currentQuizEdit;
	}
	else {
		quizObject2[currentQuizEdit].questionObjects.forEach(function (questionObject) {
			addquestionToDOM();
			var actualData = document.getElementById(`draggableQuestion${highestQuestion}`).children[1].children;
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
			actualData[5].children[0].children[0].textContent = questionObject.Answers[0].answer;
			characterCount(actualData[5].children[0].children[0], 50);
			actualData[5].children[1].children[0].textContent = questionObject.Answers[1].answer;
			characterCount(actualData[5].children[1].children[0], 50);
			actualData[5].children[2].children[0].textContent = questionObject.Answers[2].answer;
			characterCount(actualData[5].children[2].children[0], 50);
			actualData[5].children[3].children[0].textContent = questionObject.Answers[3].answer;
			characterCount(actualData[5].children[3].children[0], 50);
			actualData[5].children[0].children[2].children[0].checked = questionObject.Answers[0].correct;
			actualData[5].children[1].children[2].children[0].checked = questionObject.Answers[1].correct;
			actualData[5].children[2].children[2].children[0].checked = questionObject.Answers[2].correct;
			actualData[5].children[3].children[2].children[0].checked = questionObject.Answers[3].correct;
		});
		reorderProper();
	}
	document.getElementById('quizNameUpdate').value = decodeHTML(quizList2[currentQuizEdit]);
	drake = dragula([document.getElementById('draggableDiv')], {
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
		document.getElementById('manageQuizMenu').style.display = 'none';
		document.getElementById('editQuizMenu').style.display = 'block';
		document.getElementById('manageQuizMenu').style.animation = 'modalPopin 0.3s';
		document.getElementById('editQuizMenu').style.animation = 'modalPopin 0.3s';
		contentEditableUpdate();
	}, 300);
}

function userClick(e, g = false, nabeelIsGreat = false) {
	var $loader = document.querySelector(".loader");
	$loader.classList.add('loader--active');
	if (g) {
		document.getElementById('btn').classList.add('buttonPressed');
	}
	if (nabeelIsGreat) {
		document.getElementById('btn2').classList.add('buttonPressed');
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
		try {
			// var xhr = new XMLHttpRequest();
			//xhr.onerror = function(e) { $error.style.display = 'block'; $error.innerHTML = 'A communication error occured';  auth2.signOut().then(function () {
			// console.log('User signed out.');
			// });};
			//  xhr.open('POST', 'api.mamklearn.com/loginVerify');
			//  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			//  xhr.onload = function() {
			//  console.log('Signed in as: ' + xhr.responseText);
			//  document.getElementById('title').innerHTML = decodeURI(newTitle);
			//  document.getElementById('loginPage').style.animation = 'animatezoomout 0.6s'; 
			//  setTimeout(function() {document.getElementById('loginPage').style.display = "none";},500);
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
		document.getElementById('title').innerHTML = decodeURI(newTitle);
		document.getElementById('loginPage').style.animation = 'animatezoomout 0.6s';
		document.getElementById('title').style.top = "15%";
		document.getElementById('title').style.height = "800px";
		document.getElementById('containerBottomA').classList.remove("containerLoginMenu");
		document.getElementById('containerBottomA').classList.add("containerMainMenu");
		setTimeout(function () {
			document.getElementById('loginPage').style.display = "none";
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
		document.getElementById('charCustomize').classList.add('btnTransitionA');
		setTimeout(function () {
			document.getElementById('title').innerHTML = decodeURI(makeData);
			document.getElementById('title').style.top = '100px';
			addQuiz();
			document.getElementById('createButtonA').addEventListener('click', function () {
				createQuiz();
			});
		}, 300);
	}, 1000);
}

function createQuiz() {
	if (checkOnce) {
		document.getElementById('createButtonA').disabled = true;
		document.getElementById('QuizName').disabled = false;
		document.getElementById('modal-bg').onclick = exitModalPopupA;
		document.getElementById('submitQuizID').disabled = false;
		document.getElementById('QuizName').value = '';
		document.getElementById('createButtonA').classList.add('btnTransitionA');
		document.getElementById('backButtonC').disabled = true;
		document.getElementById('backButtonC').classList.add('btnTransitionA');
		document.getElementById('submitQuizID').innerHTML = 'Create';
		document.getElementById('modal-bg').style.animation = 'fadeIn 0.5s';
		document.getElementById('modal-bg').style.display = 'block';
		document.getElementById('homeText').classList.add('btnTransitionA');
		document.getElementById('createQuizMenu').style.animation = 'modalPopin 0.3s';
		document.getElementById('manageQuizMenu').style.display = 'none';
		document.getElementById('createQuizMenu').style.display = 'block';
		document.getElementById('modal-popupA').style.display = 'block';
		document.getElementById('modal-popupA').classList.add('modal-popupActive');
		if (Object.keys(quizList2).length > 0) {
			for (var key in quizList2) {
				document.getElementById(key).classList.add('btnTransitionA');
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
	document.getElementById('charCustomize').classList.add('btnTransitionA');
	setTimeout(function () {
		document.getElementById('title').innerHTML = decodeURI(playData);
		document.getElementById('containerBottomA').classList.add("containerPlayMenu");
		document.getElementById('title').style.height = '250px';
		document.getElementById('title').style.top = "30%";
		document.getElementById('joinQuizForm').addEventListener('submit', JoinGame);
	}, 300);
}

function JoinGame(event) {
	document.getElementById("gameID").disabled = true;
	document.getElementById("submitID").disabled = true;
	var selects = document.getElementsByTagName("a");
	for (var i = 0, il = selects.length; i < il; i++) {
		selects[i].className += " disabled";
	}
	document.getElementById('submitID').innerHTML = `&nbsp;	${svgData} &nbsp;	`;
	if (document.getElementById("gameID").value == "2794") {
		setTimeout(function () {
			document.getElementById('loader-1').style.display = "none";
			var $loader = document.querySelector(".loader");
			$loader.classList.add('loader--active');
			setTimeout(function () {
				document.getElementById("gameStartScreenStudent").style.display = 'block';
			}, 1000);
		}, 750);
		setTimeout(() => {
			studentGameProcessor(quizStartTestCase);
		}, 5000);
	} else {
		setTimeout(function () {
			document.getElementById("errorActual").innerText = 'Invalid ID';
			document.getElementById("gameID").disabled = false;
			document.getElementById("submitID").disabled = false;
			document.getElementById("errorMessageA").style.display = "block";
			setTimeout(function () {
				document.getElementById("errorMessageA").style.display = "none";
			}, 1000);
			var selects = document.getElementsByTagName("a");
			for (var i = 0, il = selects.length; i < il; i++) {
				selects[i].classList.remove("disabled");
			}
			document.getElementById('submitID').innerHTML = 'Join';
		}, 1000);
	}
	event.preventDefault();
}

function goBack() {
	document.querySelector('#codeText').classList.add('titleTransition');
	document.querySelector('#gameID').classList.add('btnTransitionA');
	document.querySelector('#submitID').classList.add('btnTransitionA');
	document.querySelector('#playMenuBack').classList.add('linkTransitionF');
	setTimeout(function () {
		document.getElementById('title').innerHTML = decodeURI(newTitle);
		document.getElementById('title').style.height = "800px";
		document.getElementById('containerBottomA').classList.remove("containerLoginMenu");
		document.getElementById('containerBottomA').classList.add("containerMainMenu");
		document.getElementById('title').style.top = "15%";
		setCharImage('currentUser', currentUserConfig);
	}, 300);
}
var customOptionsIncrement = 0;

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
	document.getElementById("customButtonChange").innerHTML = customOptions[customOptionsIncrement];
	document.getElementById("charCustomize").focus();
}
var currentUserConfig = [0, 0, 0, 0, 0];
var tempData01;

function updateImageState() {
	currentUserConfig[customOptionsIncrement]++;
	if (currentUserConfig[customOptionsIncrement] > 9) {
		currentUserConfig[customOptionsIncrement] = 0;
	}
	setCharImage('currentUser', currentUserConfig);
}

function setCharImage(charID, currentUserConfig) {
	document.getElementById(charID + 'Eyes').src = `img/eyes-${currentUserConfig[0]}.png`;
	document.getElementById(charID + 'Nose').src = `img/nose-${currentUserConfig[1]}.png`;
	document.getElementById(charID + 'Mouth').src = `img/mouth-${currentUserConfig[2]}.png`;
	document.getElementById(charID + 'Shirt').src = `img/shirt-${currentUserConfig[3]}.png`;
	document.getElementById(charID + 'Arms').src = `img/arms-${currentUserConfig[4]}.png`;
}
var checkOnce = true;

function exitModalPopupA(a = false) {
	if (checkOnce) {
		checkOnce = false;
		document.getElementById('modal-bg').style.animation = 'fadeOut 0.5s';
		setTimeout(function () {
			document.getElementById('modal-bg').style.display = 'none';
			checkOnce = true;
		}, 500);
		document.getElementById('createQuizMenu').style.animation = 'modalPopout 0.3s';
		setTimeout(function () {
			document.getElementById('modal-popupA').style.display = 'none';
		}, 300);
		document.getElementById('title').innerHTML = decodeURI(makeData);
		addQuiz();
		document.getElementById('createButtonA').addEventListener('click', function () {
			createQuiz();
		});
	}
}
var iconIterate = 0;

function addQuiz() {
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			document.getElementById('makeDiv').innerHTML += `<button style="min-width: 300px; min-height: 300px;  margin-top: 30px; text-align: center; font-size: xx-large; margin-left: 30px;" class="button titleTransitionBack quizActionButton" id="${key}"><img src="../img/qIcon-${iconIterate % 4}.png" width="250"><br>${quizList2[key]}</button>`
			iconIterate++;
		};
		iconIterate = 0;
		document.getElementById('backButtonC').remove();
		document.getElementById('removeButton').remove();
		document.getElementById('makeDiv').innerHTML += '<button style="min-width: 300px; min-height: 300px;  margin-top: 30px; text-align: center; font-size: xx-large;  max-width:300px; margin-left: 30px;" class="button titleTransitionBack" id="createButtonA"><img src="../img/createQuiz-2.png" width="250"><br>(Create quiz)</button>'
		document.getElementById('makeDiv').innerHTML += '<br><br><div style="text-align:center; width: 100%25;"><button class="button titleTransitionBack" id="backButtonC" onclick="goBackMakeA()">Back</button></div>';
		document.getElementById('makeDiv').style.textAlign = 'center';
		document.querySelectorAll('.quizActionButton').forEach(item => {
			item.addEventListener('click', event => {
				if (checkOnce) {
					document.getElementById('createButtonA').disabled = true;
					document.getElementById('modal-bg').onclick = exitModalPopupB;
					document.getElementById('QuizName').disabled = false;
					document.getElementById('submitQuizID').disabled = false;
					document.getElementById('QuizName').value = '';
					document.getElementById('createButtonA').classList.add('btnTransitionA');
					document.getElementById('backButtonC').disabled = true;
					document.getElementById('backButtonC').classList.add('btnTransitionA');
					document.getElementById('submitQuizID').innerHTML = 'Create';
					document.getElementById('modal-bg').style.animation = 'fadeIn 0.5s';
					document.getElementById('modal-bg').style.display = 'block';
					document.getElementById('quizNameTitleA').innerHTML = quizList2[event.currentTarget.id] + ":";
					document.getElementById('homeText').classList.add('btnTransitionA');
					document.getElementById('manageQuizMenu').style.animation = 'modalPopin 0.3s';
					document.getElementById('manageQuizMenu').style.display = 'block';
					document.getElementById('createQuizMenu').style.display = 'none';
					document.getElementById('modal-popupA').style.display = 'block';
					document.getElementById('modal-popupA').classList.add('modal-popupActive');
					currentQuizEdit = event.currentTarget.id;
					if (Object.keys(quizList2).length > 0) {
						for (var key in quizList2) {
							document.getElementById(key).classList.add('btnTransitionA');
						};
					}
				}
			})
		})
		document.getElementById('makeDiv').style.paddingLeft = "30px";
	}
}

function goBackMakeA() {
	customOptionsIncrement = 0;
	document.getElementById('backButtonC').disabled = true;
	document.getElementById('homeText').classList.add('titleTransition');
	if (Object.keys(quizList2).length > 0) {
		for (var key in quizList2) {
			document.getElementById(key).classList.add('btnTransitionA');
		};
	}
	document.getElementById('createButtonA').classList.add('btnTransitionA');
	document.getElementById('backButtonC').classList.add('btnTransitionA');
	setTimeout(function () {
		document.getElementById('title').innerHTML = decodeURI(newTitle);
		document.getElementById('title').style.height = "800px";
		document.getElementById('containerBottomA').classList.remove("containerLoginMenu");
		document.getElementById('containerBottomA').classList.add("containerMainMenu");
		document.getElementById('title').style.top = "15%";
		setCharImage('currentUser', currentUserConfig);
	}, 300);
}

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

function encodeHTML(str) {
	return str.replace(/[\u00A0-\u9999<>&#](?!#)/gim, function (i) {
		return '&#' + i.charCodeAt(0) + ';';
	});
}

function decodeHTML(str) {
	return str.replace(/&#([0-9]{1,5});/gi, function (match, num) {
		return String.fromCharCode(parseInt(num));
	});
}

function createNewQuiz(event) {
	checkOnce = false;
	var button = document.getElementById('submitQuizID');
	document.getElementById('QuizName').disabled = true;
	var g = document.getElementById('QuizName').value;
	button.disabled = true;
	button.innerHTML = svgData;
	setTimeout(function () {
		checkOnce = true;
		quizList2[uuidv4()] = encodeHTML(g);
		exitModalPopupA(true);
	}, 1000);
	event.preventDefault();
}

function exitModalPopupB() {
	if (checkOnce) {
		checkOnce = false;
		document.getElementById('modal-bg').style.animation = 'fadeOut 0.5s';
		setTimeout(function () {
			document.getElementById('modal-bg').style.display = 'none';
			checkOnce = true;
		}, 500);
		document.getElementById('manageQuizMenu').style.animation = 'modalPopout 0.3s';
		setTimeout(function () {
			document.getElementById('modal-popupA').style.display = 'none';
		}, 300);
		document.getElementById('title').innerHTML = decodeURI(makeData);
		addQuiz();
		document.getElementById('createButtonA').addEventListener('click', function () {
			createQuiz();
		});
	}
}

function exitModalPopupC() {
	checkOnce = false;
	document.getElementById('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		document.getElementById('modal-bg').style.display = 'none';
		checkOnce = true;
	}, 500);
	document.getElementById('quizDeleteConfirm').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		document.getElementById('modal-popupA').style.display = 'none';
		document.getElementById('quizDeleteConfirm').style.display = 'none';
	}, 300);
	document.getElementById('title').innerHTML = decodeURI(makeData);
	addQuiz();
	document.getElementById('createButtonA').addEventListener('click', function () {
		createQuiz();
	});
}

function collapseSubArea(a) {
	var area = document.getElementById(`collapseSubArea${a}`);
	var objm = document.getElementById(`collapsableContent${a}`);
	area.classList.toggle('arrowBRight');
	area.classList.toggle('arrowBDown');
	objm.classList.toggle('contentA1');
	objm.classList.toggle('contentA2');
	if (activeArea !== null && activeArea !== a) {
		var area = document.getElementById(`collapseSubArea${activeArea}`);
		var objm = document.getElementById(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
	}
	activeArea = a;
}

function collapseAllArea() {
	if (activeArea !== null && document.getElementById(`collapseSubArea${activeArea}`) != null) {
		var area = document.getElementById(`collapseSubArea${activeArea}`);
		var objm = document.getElementById(`collapsableContent${activeArea}`);
		area.classList.add('arrowBRight');
		area.classList.remove('arrowBDown');
		objm.classList.add("contentA2");
		objm.classList.remove("contentA1");
		activeArea = null;
	}
}

function deleteQuestion(a) {
	collapseAllArea();
	document.getElementById(`draggableQuestion${a}`).style.pointerEvents = 'none';
	document.getElementById(`draggableQuestion${a}`).classList.add('btnTransitionA');
	setTimeout(function () {
		drake.remove(document.getElementById(`draggableQuestion${a}`));
		document.getElementById(`draggableQuestion${a}`).remove();
		reorderProper();
	}, 300);
}

function characterCount(thisVar, total) {
	thisVar.nextElementSibling.innerHTML = `${thisVar.textContent.length}/${total}`;
	if (thisVar.innerText.length > total) {
		allowSubmit = false;
	}
}

function reorderProper() {
	var test = 0;
	for (i = 0; i <= document.getElementById('draggableDiv').children.length - 1; i++) {
		document.getElementById('draggableDiv').children[i].firstElementChild.childNodes[3].innerHTML = `Question ${i + 1}:`;
		test = i;
	}
	if(test >= 24) {
		document.getElementById('addQuestionButton').disabled = true;
		document.getElementById('addQuestionButton').innerText = '25/25 questions';
		document.getElementById('addQuestionButton').style.cursor = "no-drop";
	}
	else {
		document.getElementById('addQuestionButton').disabled = false;
		document.getElementById('addQuestionButton').innerText = 'add question...';
		document.getElementById('addQuestionButton').style.cursor = "pointer";
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
					var a70 = String(this.textContent.replace(/\r?\n|\r/g , ""));
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

function getCaretCharacterOffsetWithin(element) {
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

function setCaretPosition(element, offset) {
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

window.addEventListener('offline', (e) => { 
	var internalInstance = currentDisconnectInstance;
	setTimeout(() => {
		if(currentDisconnectInstance == internalInstance) throwExcept("CONNECTION_DROPPED");
	}, 5000);
});

window.addEventListener('online', (e) => {
	currentDisconnectInstance++;
});

function throwExcept(msg) {
	document.getElementById('commError2').style.display = 'block';
	document.getElementById('CommError').style.display = 'block';
	document.getElementById('comError3').innerHTML = msg;
}

function shortAnswerToggle(endMe) {
	document.getElementById(`answerContainerObject${endMe}`).classList.toggle('shortAnswerEditorStyles');
	document.getElementById(`collapsableContent${endMe}`).classList.toggle('noSpaceEditor');
}

function toggleTime(order) {
	document.getElementById(`Question${order}Time`).classList.toggle("displayTimeLimit");
}

function parseActiveQuiz() {
	tempQuiz = JSON.parse(JSON.stringify(quizObject));
	tempQuiz.quizName = encodeHTML(document.getElementById("quizNameUpdate").value);
	tempQuiz.quizID = currentQuizEdit;
	if (document.getElementById("draggableDiv").firstElementChild) {
		quizDoc = Array.from(document.getElementById("draggableDiv").children);
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

function wrapper(toWrap, wrapper) {
	wrapper = wrapper || document.createElement('div');
	toWrap.parentNode.appendChild(wrapper);
	return wrapper.appendChild(toWrap);
};
//verify that question field is filled; done
//verify that we have any questions at all; done
//verify that no field goes over it's character limit; done
//verify that time limit is at least 5 or more; done
//verify that at least one possible choice is correct; done
//verify that at least two answer fields are filled out; done
function verifyQuiz() {
	quizParseError = [];
	var finalResult = '';
	if (tempQuiz.questionObjects.length === 0) {
		quizParseError.push('No questions exist');
	}
	else {
		var quizParseError = [];
		var currentQuestion = 0;
		var nullSpace01 = [];
		var questionErrorString = 'Questions';
		var timeLimitViolation = [];
		var answerError0 = [];
		var answerError1 = [];
		var answerError2 = [];
		var answerError1Content = 'Questions';
		var timeLimitErrorString = 'Questions';
		var answerError0Content = 'Questions';
		var answerError2Content = 'Questions';
		tempQuiz.questionObjects.forEach(function (question) {
			currentQuestion++;
			if (/^$/.test(question.questionName)) {
				nullSpace01.push(currentQuestion);
			}
			if (!question.shortAnswer) {
				if (!question.Answers[0].answer || !question.Answers[1].answer) {
					answerError0.push(currentQuestion);
				}
				if (!question.Answers[0].correct && !question.Answers[1].correct) {
					if (!question.Answers[2].correct && !question.Answers[3].correct) {
						answerError1.push(currentQuestion);
					}
				}
				if(!question.Answers[2].answer || !question.Answers[3].answer) {
					if(question.Answers[2].correct && !question.Answers[2].answer) {
						answerError2.push(currentQuestion);
					}
					else if(question.Answers[3].correct && !question.Answers[3].answer) {
						answerError2.push(currentQuestion);
					}
				}
			}
			if (typeof question.timeLimit != "boolean") {
				if (isNaN(question.timeLimit) || question.timeLimit < 5) {
					timeLimitViolation.push(currentQuestion);
				}
			}
		});
		if (nullSpace01.length == 1) {
			questionErrorString = `Question ${nullSpace01[0]} has an empty question field`;
		}
		else if (nullSpace01.length == 2) {
			questionErrorString = `Questions ${nullSpace01[0]} and ${nullSpace01[1]} have an empty question field`;
		}
		else {
			nullSpace01.forEach(function (error) {
				if (nullSpace01.slice(-1)[0] != error) {
					questionErrorString += ` ${error},`;
				}
				else {
					questionErrorString += ` and ${error}`;
				}
			});
		}

		if(answerError0.length == 1) {
			answerError0Content = `Question ${answerError0[0]} does not have the first two answer fields filled out`;
		}
		else if (answerError0.length == 2) {
			answerError0Content = `Questions ${answerError0[0]} and ${answerError0[1]} do not have the first two answer fields filled out`;
		}
		else {
			answerError0.forEach(function(error) {
				if (answerError0.slice(-1)[0] != error) {
					answerError0Content += ` ${error},`;
				}
				else {
					answerError0Content += ` and ${error}`;
				}
			});
		}

		if (timeLimitViolation.length == 1) {
			timeLimitErrorString = `Question ${timeLimitViolation[0]} has an invalid time limit or a time limit less than 5`;
		}
		else if (timeLimitViolation.length == 2) {
			timeLimitErrorString = `Questions ${timeLimitViolation[0]} and ${timeLimitViolation[1]} have an invalid time limit or a time limit less than 5`
		}
		else {
			timeLimitViolation.forEach(function (error) {
				if (nullSpace01.slice(-1)[0] != error) {
					timeLimitErrorString += ` ${error},`;
				}
				else {
					timeLimitErrorString += ` and ${error}`;
				}
			});
		}

		if (answerError1.length == 1) {
			answerError1Content = `Question ${answerError1[0]} does not have a correct option`;
		}
		else if (answerError1.length == 2) {
			answerError1Content = `Questions ${answerError1[0]} and ${answerError1[1]} do not have a correct option`
		}
		else {
			answerError1.forEach(function (error) {
				if (answerError1.slice(-1)[0] != error) {
					answerError1Content += ` ${error},`;
				}
				else {
					answerError1Content += ` and ${error}`;
				}
			});
		}

		if(answerError2.length == 1) {
			answerError2Content = `Question ${answerError2[0]} has a correct option which corresponds to an empty field`;
		}
		else if (answerError2.length == 2) {
			answerError2Content = `Question ${answerError2[0]} and ${answerError2[1]} have a correct option which corresponds to an empty field`;
		}
		else {
			answerError2.forEach(function (error) {
				if (answerError2.slice(-1)[0] != error) {
					answerError2Content += ` ${error},`;
				}
				else {
					answerError2Content += ` and ${error}`;
				}
			});
		}

		if (questionErrorString != 'Questions') {
			if (nullSpace01.length != 1 && nullSpace01.length != 2) {
				questionErrorString += ' have an empty question field';
			}
			quizParseError.push(questionErrorString);
		}

		if (timeLimitErrorString != 'Questions') {
			if (timeLimitViolation.length != 1 && timeLimitViolation.length != 2) {
				timeLimitErrorString += ' have an invalid time limit or a time limit less than 5';
			}
			quizParseError.push(timeLimitErrorString);
		}

		if (answerError0Content != 'Questions') {
			if (answerError0.length != 1 && answerError0.length != 2) {
				answerError0Content += ' do not have the first two answer fields filled out';
			}
			quizParseError.push(answerError0Content);
		}

		if (answerError1Content != 'Questions') {
			if (answerError1.length != 1 && answerError1.length != 2) {
				answerError1Content += ' do not have a correct option';
			}
			quizParseError.push(answerError1Content);
		}

		if (answerError2Content != 'Questions') {
			if (answerError2.length != 1 && answerError2.length != 2) {
				answerError2Content += ' do not have a correct option';
			}
			quizParseError.push(answerError2Content);
		}
	}
	if (quizParseError.length) {
		quizParseError.forEach(function (error) {
			finalResult += `<li class="innerError">${encodeHTML(error)}</li>`;
		});
		document.getElementById('innerError3').innerHTML = finalResult;
		return false;
	}
	else {
		return true;
	}
}

function deepEqual(object1, object2) {
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
  
  function isObject(object) {
	return object != null && typeof object === 'object';
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
		document.getElementById('modal-bg').style.animation = 'fadeOut 0.5s';
		document.getElementById('editQuizMenu').style.animation = 'modalPopout 0.3s';
		setTimeout(function () {
			editState = false;
			document.getElementById('editQuizMenu').style = "";
			document.getElementById('modal-bg').style.display = 'none';
			document.getElementById('editQuizMenu').style.display = 'none';
			document.getElementById("saveQuizButton").disabled = false;
			document.getElementById("backButtonEditQuiz").disabled = false;
			document.getElementById("quizNameUpdate").disabled = false;
			document.getElementById("addQuestionButton").disabled = false;
			document.getElementById("modal-popupA").style.pointerEvents = "all";
			document.getElementById("saveQuizButton").innerHTML = "Save";
			document.getElementById("draggableDiv").innerHTML = "";
			drake.destroy();
			highestQuestion = 0;
			checkOnce = true;
		}, 500);
		setTimeout(function () {
			document.getElementById('modal-popupA').style.display = 'none';
		}, 300);
		document.getElementById('title').innerHTML = decodeURI(makeData);
		addQuiz();
		document.getElementById('createButtonA').addEventListener('click', function () {
			createQuiz();
		});
	}
}

function addquestionToDOM() {
	highestQuestion++;
	temp41 = `<div style=\"margin-top: -50px; position: relative;\" class=\"draggable\" id=\"draggableQuestion${highestQuestion}\"><h3 style=\"font-family: \'Chelsea Market\', cursive; color: white; text-align: left;\"> <span class="draggableActual"><svg class="draggableActual" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" height=\"24\" style=\"transform: scale(2);\" viewBox=\"0 0 24 24\" width=\"24\"><path class="draggableActual" d=\"M0 0h24v24H0V0z\" fill=\"none\"\/><path class="draggableActual" fill=\"white\" d=\"M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z\"\/><\/svg></span> <span class="hackDoNotUse">Question ${highestQuestion}:</span><a href=\"javascript:void(0);\" onclick=\"collapseSubArea(${highestQuestion});\"  id=\"collapseSubArea${highestQuestion}\" class=\"arrowBRight arrow\"><\/a> <svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" class=\"clickBoxGrey\" onclick=\"deleteQuestion(${highestQuestion});\" viewBox=\"0 0 24 24\" style=\"transform: scale(2); margin-left: 22px;\" fill=\"white\" width=\"18px\" height=\"18px\"><path d=\"M0 0h24v24H0z\" fill=\"none\"\/><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"\/><\/svg><\/h3><div id=\"collapsableContent${highestQuestion}\" class=\"contentA2\">
        	<div autofocus class=\'titleTransitionBack textAreaConfig formInput button\' required  autocomplete=\"off\" maxlength=\"90\" title=\"Question 2\" id=\"Question2InputText\" onkeypress=\"return (this.innerText.length < 90)\" contenteditable=\"true\" placeholder=\"Question\" name=\"Question2InputText\"><\/div><div class=\"charLimited\">0\/90<\/div><br><div class=\"checkboxCustomConfig\" style=\"margin-top: 0px;\"> <label class=\"toggleButton toggleButtonPosition\">   <input type=\"checkbox\" onclick="shortAnswerToggle(${highestQuestion})">     <div>       <svg viewBox=\"0 0 44 44\">         <path d=\"M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758\" transform=\"translate(-2.000000, -2.000000)\"><\/path>       <\/svg>     <\/div> <\/label> <p class=\"labelForCheck labelForCheckPosition\">Short Answer<\/p><\/div><div class=\"checkboxCustomConfig\" style=\"margin-top: 10px;\"> <label class=\"toggleButton toggleButtonPosition\">   <input type=\"checkbox\" onclick="toggleTime(${highestQuestion})">     <div>       <svg viewBox=\"0 0 44 44\">         <path d=\"M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758\" transform=\"translate(-2.000000, -2.000000)\"><\/path>
        	<\/svg>     <\/div> <\/label> <p class=\"labelForCheck labelForCheckPosition\">Time Limit<\/p><div autofocus class=\'titleTransitionBack textAreaConfig formInput button questionInput timeLimitMagic\' maxlength="3" onkeypress=\"return (this.innerText.length < 3)\" autocomplete=\"off\" id=\"Question${highestQuestion}Time\" contenteditable=\"true\"><\/div><div class=\"charLimited charLimited2\">0\/3<\/div><\/div> <div class=\"answerContainer\" id="answerContainerObject${highestQuestion}"><div class=\"checkboxCustomConfig\" style=\"margin-top: 50px;\"> <div autofocus class=\'titleTransitionBack textAreaConfig formInput button questionInput\' required maxlength="50" onkeypress=\"return (this.innerText.length < 50)\" autocomplete=\"off\" title=\"Question 1\" id=\"Question${highestQuestion}InputText\" contenteditable=\"true\" placeholder=\"Answer 1\" name=\"Question${highestQuestion}InputText\"><\/div> <div class=\"charLimited charLimited2\">0\/50<\/div> <label class=\"toggleButton weirdButton2\">   <input checked type=\"checkbox\">     <div>       <svg viewBox=\"0 0 44 44\">         <path d=\"M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758\" transform=\"translate(-2.000000, -2.000000)\"><\/path>       <\/svg>     <\/div> <\/label><\/div><div class=\"checkboxCustomConfig\"> <div autofocus class=\'titleTransitionBack textAreaConfig formInput button questionInput\' required maxlength="50" onkeypress=\"return (this.innerText.length < 50)\" autocomplete=\"off\" title=\"Question 1\" id=\"Question${highestQuestion}InputText\" contenteditable=\"true\" placeholder=\"Answer 2\" name=\"Question${highestQuestion}InputText\"><\/div> <div class=\"charLimited charLimited2\">0\/50<\/div> <label class=\"toggleButton\ weirdButton2">   <input type=\"checkbox\">     <div>       <svg viewBox=\"0 0 44 44\">         <path d=\"M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758\" transform=\"translate(-2.000000, -2.000000)\"><\/path><\/svg><\/div><\/label><\/div><div class=\"checkboxCustomConfig\"> <div autofocus class=\'titleTransitionBack textAreaConfig formInput button questionInput\' required maxlength="50" onkeypress=\"return (this.innerText.length < 50)\" autocomplete=\"off\" title=\"Question 1\" 
        	id=\"Question${highestQuestion}InputText\" contenteditable=\"true\" placeholder=\"Answer 3\" name=\"Question${highestQuestion}InputText\"><\/div><div class=\"charLimited charLimited2\">0\/50<\/div> <label class=\"toggleButton weirdButton2\"><input type=\"checkbox\"><div><svg viewBox=\"0 0 44 44\"><path d=\"M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758\" transform=\"translate(-2.000000, -2.000000)\"><\/path><\/svg><\/div> <\/label><\/div><div class=\"checkboxCustomConfig\"><div autofocus class=\'titleTransitionBack textAreaConfig formInput button questionInput\' required maxlength="50" onkeypress=\"return (this.innerText.length < 50)\" autocomplete=\"off\" title=\"Question 1\" id=\"Question${highestQuestion}InputText\" contenteditable=\"true\" placeholder=\"Answer 4\" name=\"Question${highestQuestion}InputText\"><\/div><div class=\"charLimited charLimited2\">0\/50<\/div><label class=\"toggleButton weirdButton2\"><input type=\"checkbox\"><div><svg viewBox=\"0 0 44 44\"><path d=\"M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758\" transform=\"translate(-2.000000, -2.000000)\"><\/path><\/svg><\/div><\/label><\/div><\/div><\/div><\/div>`;
	document.getElementById('draggableDiv').insertAdjacentHTML('beforeEnd', temp41);
}

function exitModalPopupG() {
	checkOnce = false;
	document.getElementById('modal-bg').style.animation = 'fadeOut 0.5s';
	setTimeout(function () {
		document.getElementById('modal-bg').style.display = 'none';
		checkOnce = true;
	}, 500);
	document.getElementById('shareQuizMenu').style.animation = 'modalPopout 0.3s';
	setTimeout(function () {
		document.getElementById('modal-popupA').style.display = 'none';
		document.getElementById('shareQuizMenu').style.display = 'none';
	}, 300);
	document.getElementById('title').innerHTML = decodeURI(makeData);
	addQuiz();
	document.getElementById('createButtonA').addEventListener('click', function () {
		createQuiz();
	});
}

function studentGameProcessor(input) {
	var inputInternal = JSON.parse(input);
	if(inputInternal.hasOwnProperty('gameStart')) {
		if(inputInternal.gameStart == true) {

			gameStateStudent = {
				competitors: inputInternal.competitors,
				competitorAvatars: inputInternal.competitorConfigs,
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
			document.getElementById('gameStartScreenStudent').style.display = "none";
			var $loader = document.querySelector(".loader");
			$loader.classList.remove('loader--active');
			document.getElementById('title').style.display = "none";
			document.getElementById('studentPlayScreen').style.display = "block";
			setQuestion();
			setTimeout(() => {
				document.getElementById('loader-1').style.display = "none";
				document.getElementById("errorMessageA").style.display = "none";
			}, 1000);
		}
	}
	else if (inputInternal.hasOwnProperty('error')) {
		throwExcept(inputInternal.error);
		gameStateStudent.gameErrorState = inputInternal.gameErrorState;
	}
	else if(inputInternal.hasOwnProperty('kickPlayer')) {
		document.getElementById("errorActual").innerText = 'Kicked From Game';
		document.getElementById("errorMessageA").style.display = "block";
		document.getElementById('gameStartScreenStudent').style.display = "none";
		document.getElementById('studentPlayScreen').style.display = "none";
		var $loader = document.querySelector(".loader");
		$loader.classList.remove('loader--active');
		document.getElementById('title').style.display = "block";
		goBack();
		setTimeout(() => {
			document.getElementById('loader-1').style.display = "none";
			document.getElementById("errorMessageA").style.display = "none";
		}, 1000);
	}
	else if(inputInternal.hasOwnProperty('isQuestionCorrect')) {
		gameStateStudent.currentQuestionData.question = inputInternal.nextQuestion;
		gameStateStudent.currentQuestionData.answers = inputInternal.choices;
		if(inputInternal.isQuestionCorrect) {
			Array.from(document.getElementById('studentAnswersFlex').children).forEach((object, index) => {
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
			document.getElementById('titleButtonStudent').classList.add('transitionQuestionA');
			setTimeout(() => {
				setQuestion();
			}, 400);
			setTimeout(() => {
				document.getElementById('titleButtonStudent').classList.remove('transitionQuestionA');
			}, 800);
		}
		else {
			console.log("Incorrect");
		}
	}
	console.log(gameStateStudent);
}

function setQuestion() {
	document.getElementById('studentAnswersFlex').style.display = 'flex';
	document.getElementById('titleButtonStudent').innerText = decodeURI(gameStateStudent.currentQuestionData.question);
	var options = document.getElementById('studentAnswersFlex').children;
	for (i = 0; i < options.length; i++) {
		if (!gameStateStudent.currentQuestionData.answers[i]) {
			options[i].style.display = 'none';
		}
		else {
			options[i].style.display = 'block';
			options[i].firstElementChild.textContent = decodeURI(gameStateStudent.currentQuestionData.answers[i]);
		}
	}
	if (gameStateStudent.currentQuestionData.answers.join("").length == 0) {
		document.getElementById('resettableCharLimited').innerText = '0/180';
		document.getElementById('studentAnswersFlex').style.display = 'none';
		document.getElementById('studentShortAnswer').style.display = 'block';
		document.getElementById('studentShortAnswerText').textContent = null;
		document.getElementById('studentShortAnswerText').classList.remove('contentEditableDisabled');
		document.getElementById('studentShortAnswerText').contentEditable = true;
		document.getElementById('shortAnswerSubmitButton').disabled = false;
	}
	else {
		document.getElementById('studentShortAnswer').style.display = 'none';
	}
}

function copyShareLink() {
	navigator.clipboard.writeText(document.getElementById('coolTextArea').textContent);
	document.getElementById("errorActual").innerText = 'Link Copied';
	document.getElementById("errorMessageA").style.display = "block";
	setTimeout(function () {
		document.getElementById("errorMessageA").style.display = "none";
	}, 1000);
}