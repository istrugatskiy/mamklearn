import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, Reference, child, onValue, set } from 'firebase/database';
import { setCharImage } from './app';
import { throwExcept } from './utils';
import { $ } from './utils';

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
let charConfig: Reference;
let errorHasBeenThrown = false;
let hasInitialized = false;

const listener = onAuthStateChanged(auth, (user) => {
    if (!hasInitialized) {
        networkManager.onReady();
        hasInitialized = true;
    }
    if (user) {
        if (user!.email!.endsWith('mamkschools.org')) {
            let currentUser = ref(database, `userProfiles/${getAuth().currentUser!.uid}`);
            charConfig = child(currentUser, 'charConfig');
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
            throwExcept(error.message);
            errorHasBeenThrown = true;
        }
    );
};

export class networkManager {
    static onLoginSuccess: () => void;
    static onLoginFail: () => void;
    static onInit: () => void;
    static onReady: () => void;

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
}
