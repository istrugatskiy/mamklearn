import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, Reference, child, onValue, set, off, push, remove } from 'firebase/database';
import { getPerformance } from 'firebase/performance';
import { setCharImage } from './app';
import { throwExcept } from './utils';
import { $ } from './utils';

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
    questionObjects: questionObject[];
}

// Configuration for firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAFnj_KFkypyRhlBLceV7FIQwLBOk-13ek',
    authDomain: 'mamklearn.com',
    databaseURL: 'https://mamaroneck-learn-default-rtdb.firebaseio.com',
    projectId: 'mamaroneck-learn',
    storageBucket: 'mamaroneck-learn.appspot.com',
    messagingSenderId: '917106980205',
    appId: '1:917106980205:web:6d36bd431bbc3d91fa5664',
    measurementId: 'G-G1J2MYS1LJ',
};

// Configures firebase authentication
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
let provider = new GoogleAuthProvider();
auth.useDeviceLanguage();
const database = getDatabase();
getPerformance();
let charConfig: Reference;
let currentUser: Reference;
let quizList: Reference;
let newValue: { [key: string]: string } = {};
let errorHasBeenThrown = false;
let hasInitialized = false;

const listener = onAuthStateChanged(auth, (user) => {
    if (!hasInitialized) {
        networkManager.onReady();
        hasInitialized = true;
    }
    if (user) {
        if (user!.email!.endsWith('mamkschools.org')) {
            currentUser = ref(database, `userProfiles/${getAuth().currentUser!.uid}`);
            charConfig = child(currentUser, 'charConfig');
            quizList = child(currentUser, 'quizList');
            monitorUserState();
            networkManager.onLoginSuccess();
            listener();
        } else {
            networkManager.onLoginFail();
            getAuth().signOut();
        }
    }
});

const monitorUserState = () => {
    onValue(
        charConfig,
        (snap) => {
            if (!errorHasBeenThrown && auth.currentUser) {
                if (snap.val()) {
                    window.currentUserConfig = snap.val();
                    if ($('currentUserArms')) {
                        setCharImage('currentUser', window.currentUserConfig);
                    }
                } else {
                    for (let index = 0; index < 5; index++) {
                        set(child(charConfig, `${index}`), 0);
                    }
                }
            }
        },
        (error) => {
            throwExcept(`@MonitorUserState: ${error.message}`);
            errorHasBeenThrown = true;
        }
    );
};

export class networkManager {
    static onLoginSuccess: () => void;
    static onLoginFail: () => void;
    static onInit: () => void;
    static onReady: () => void;
    static _setClientQuizList: (quizList: { [key: string]: string }) => void;
    private static currentQuizObject: Reference;
    private static prevQuizList: { [key: string]: string } = {};
    static authInstance = getAuth();
    static hasBeenInitialized = false;

    static set setClientQuizList(newFunction: () => void) {
        this._setClientQuizList = newFunction;
        networkManager._setClientQuizList(newValue);
    }

    static startLogin() {
        signInWithPopup(auth, provider).catch((error) => {
            $('loginError1').textContent = `${error.code}: ${error.message}`;
        });
    }

    static setCharImage(newChar: number[]) {
        for (let index = 0; index < 5; index++) {
            set(child(charConfig, `${index}`), newChar[index]);
        }
    }

    static setQuizList(changedQuiz: string, callback: () => void, changedQuizId: string = '') {
        if (changedQuiz !== null && changedQuiz !== undefined) {
            if (changedQuizId == '') {
                push(quizList, changedQuiz).then(() => {
                    callback();
                });
            } else {
                set(child(quizList, `${changedQuizId}`), changedQuiz).then(() => {
                    callback();
                });
            }
        }
        else {
            remove(child(quizList, `${changedQuizId}`));
        }
    }

    static initQuizList(callback: () => void) {
        if(this.hasBeenInitialized) {
            callback();
        }
        onValue(
            quizList,
            (snap) => {
                newValue = {};
                this.prevQuizList = {};
                if (!errorHasBeenThrown && auth.currentUser) {
                    if(!this.hasBeenInitialized) {
                        callback();
                        this.hasBeenInitialized = true;
                    }
                    if (snap.val()) {
                        this.prevQuizList = snap.val();
                        let newSnap = Object.keys(snap.val());
                        const values = Object.values(snap.val());
                        newSnap.forEach((el: string, index: number) => {
                            if (values[index]) {
                                newValue[`quizID_${el}`] = values[index] as string;
                            }
                        });
                    }
                    networkManager._setClientQuizList ? networkManager._setClientQuizList(newValue) : false;
                }
            },
            (error) => {
                throwExcept(`@InitQuizList: ${error.message}`);
                errorHasBeenThrown = true;
            }
        );
    }

    static setQuiz(quizID: string, quizObject: quizObject | null, callback: () => void) {
        if (this.prevQuizList[quizID] !== null) {
            set(child(child(currentUser, 'quizData'), quizID), quizObject).then(() => {
                callback();
            });
            return quizID;
        } else {
            return push(child(currentUser, 'quizData'), quizObject);
        }
    }

    static handleCurrentQuiz(quizID: string, callback: (value: any) => void) {
        this.currentQuizObject = child(child(currentUser, 'quizData'), quizID);
        onValue(this.currentQuizObject, (snap) => {
            callback(snap.val());
            off(this.currentQuizObject);
        });
    }

    static getSharedQuiz(shareLink: string, callback: () => void) {
        const shareUser = shareLink.split('_')[0];
        const actualQuiz = shareLink.split('_')[1];
        onValue(ref(database, `sharedQuizzes/${shareUser}/${actualQuiz}`), (snap) => {
            if(snap.val()) {
                console.log(snap.val());
                callback();
            }
            else {
                throwExcept('@GetSharedQuiz: quiz does not exist');
            }
        }, (error) => {
            throwExcept(`@GetSharedQuiz: ${error.message}`);
        });
    }

    static shareQuiz(quizId: string, quizObject: quizObject) {
        console.log(quizId + quizObject);
    }
}
