import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, useDeviceLanguage } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getPerformance } from 'firebase/performance';

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

const app = initializeApp(firebaseConfig);
getAnalytics(app);
getPerformance(app);

// For public use.
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

useDeviceLanguage(auth);
