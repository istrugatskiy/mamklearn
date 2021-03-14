// Defines imports and globals
import '../css/style.css';
import {$, getCaretCharacterOffsetWithin, characterCount, createTemplate, setTitle, throwExcept, setCaretPosition, signOut, clearChildren} from './utils';
import {eventHandle} from './events';
import {initParticles} from './loadParticles';
declare global {
	interface Window {
		onSignIn: any,
		currentUserConfig: any,
		customOptionsIncrement: any,
		clickEvents: any,
		clickIncludesEvents: any,
		keyboardIncludesEvents: any,
		submitEvents: any,
		studentGameProcessor: any,
		quizStartTestCase: string,
		anotherTestCase: string,
		anotherTestCase2: string,
		anotherTestCase3: string,
		anotherTestCase4: string
	}
}
window.onSignIn = onSignIn;
var customOptionsIncrement = 0;
window.customOptionsIncrement = customOptionsIncrement;
var currentUserConfig = [0, 0, 0, 0, 0];
window.currentUserConfig = currentUserConfig;
var errorCount = 0;

console.log("%cUse link to get quiz answers:https://bit.ly/31Apj2U", "font-size: 32px;");
const customOptions = ["Eyes", "Nose", "Mouth", "Shirt", "Arms"];

const initializeApp = () => {
	contentEditableUpdate();
	$('mainLoader').classList.remove('loader--active');
	initParticles();
	if (new URLSearchParams(window.location.search).get('shareQuiz')) {
		setTimeout( () => {
			$("errorActual").innerText = 'Quiz Copied';
			$("errorMessageA").style.display = "block";
			setTimeout( () => {
				$("errorMessageA").style.display = "none";
				window.history.pushState(null, "mamkLearn", "index.html");
			}, 1000);
		}, 500);
	}
}

window.clickEvents = {
	"btn2": playCode,
	"makebtn": makeCode,
	"signOutbtn": signOut,
	"loginBtn": () => {login()},
	"customButtonChange": updateImageState,
	"customButtonChange2": updateImageState,
	"leftCustomizeArrow": () => {arrowButtonPress(true)},
	"arrowCustomizeRight": () => {arrowButtonPress(false)},
	"playMenuBack": goBack,
	"AboutLink": () => {userClick('about.html')},
	"aboutWindowButton": () => {userClick('index.html', 'aboutWindowButton')}
};

// These are the events that include the text in the elements id.
window.clickIncludesEvents = {};

window.submitEvents = {
	"joinQuizForm": JoinGame,
};

window.keyboardIncludesEvents = {};

// Initializes the app once its fully loaded.
window.addEventListener('load', () => {
	gapi.load('auth2', () => {
		gapi.auth2.init({
			client_id: '917106980205-im519fknf8sfb1jc1gs1tr6eafmto4vs.apps.googleusercontent.com',
		}).then( () => {
			initializeApp();
			eventHandle();
		}
		);
	});
});

const login = () => {
	$('loginPage').style.display = 'block';
	$('loginBtn').disabled = true;
}

function userClick(link: string, disableObject?: string) {
	$('mainLoader').classList.remove('loader--active');
	if (disableObject) {
		$(disableObject).disabled = true;
	}
	setTimeout(function () {
		window.location.href = link;
	}, 1000);
};

function onSignIn(googleUser: any) {
	var $error = $('loginError1');
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
		$error.innerText = 'Please use an account that ends in \'mamkschools.org\' or \'student.mamkschools.org\'';
	}
};

// make and play on button click functions here!
function makeCode() {
	const makeButton = $('makebtn');
	const playButton = $('btn2');
	const signOutButton = $('signOutbtn');
	const title = $('homeText');
	makeButton.disabled = true;
	playButton.disabled = true;
	clearChildren('makebtn');
	createTemplate('svgLoader', makeButton.id);
	// replace this with request to server and await callback or if 5 seconds passes undo
	import('./make').then( (obj) => {
		errorCount = 0;
		obj.initEvents();
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
			obj.addQuiz();
		}, 300);
	}).catch ( (error) => {
		errorCount++;
		console.warn(`Failed to fetch chonk (${error})! Retrying...`);
		if(errorCount < 100) {
			setTimeout( () => {
			makeCode();
		}, 2000);
		}
		else {
			throwExcept('BIG_CHONK4512');
		}
	});
}

function playCode() {
	var makeButton = $('makebtn');
	var playButton = $('btn2');
	var signOutButton = $('signOutbtn');
	var title = $('homeText');
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
				const eventTarget = event.target! as HTMLElement;
				var a69 = getCaretCharacterOffsetWithin(eventTarget);
				setTimeout( () => {
					var a70 = String(eventTarget.textContent!.replace(/(\r\n|\r|\n)/ , ""));
					const maxLength = (eventTarget.getAttribute("maxlength") as unknown as number);
					if(maxLength) {
						eventTarget.innerText = a70.substring(0, );
					}
					try {
						setCaretPosition(eventTarget, a69);
					}
					catch {
						setCaretPosition(eventTarget, eventTarget.innerText.length);
					}
					characterCount(eventTarget, eventTarget.getAttribute("maxlength"));
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
	clearChildren('submitID');	
	createTemplate('svgLoader', 'submitID');
	if ($("gameID").value == "2794") {
		import('./play').then( (obj) => {
			errorCount = 0;
			$('mainLoader').classList.add('loader--active');
			obj.initEvents();
			setTimeout( () => {
				$('loader-1').style.display = 'none';
				$("gameStartScreenStudent").style.display = 'block';
				setTimeout( () => {
					$('mainLoader').classList.remove('loader--active');
				}, 1000);
			}, 1000);
			setTimeout( () => {
				window.studentGameProcessor(window.quizStartTestCase);
			}, 2000);
		}).catch ( (error) => {
			errorCount++;
			if(errorCount < 15) {
				setTimeout( () => {
					console.warn(`Failed to fetch chonk (${error})! Retrying...`);
					JoinGame();
				}, 2000);
			}
			else {
				throwExcept('BIG_CHONK4569');
			}
		});
	} else {
		setTimeout(function () {
			$("errorActual").textContent = 'Invalid ID';
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
			$('submitID').innerText = 'Join';
		}, 1000);
	}
}

export function goBack() {
	$('codeText').classList.add('titleTransition');
	$('gameID').classList.add('btnTransitionA');
	$('submitID').classList.add('btnTransitionA');
	$('playMenuBack').classList.add('linkTransitionF');
	setTimeout(function () {
		setTitle('homeScreen');
		$('title').style.height = "800px";
		$('title').style.top = "15%";
		setCharImage('currentUser', currentUserConfig);
		customOptionsIncrement = 0;
	}, 300);
}

function arrowButtonPress(isLeft: boolean) {
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
	$("customButtonChange").innerText = customOptions[customOptionsIncrement];
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

export function setCharImage(charID: string, currentUserConfig: number[]) {
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
		throwExcept('MISTAKE');
	}
	else {
		console.log(e.message);
	}
});