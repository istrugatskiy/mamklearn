import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, useDeviceLanguage } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getPerformance } from 'firebase/performance';

const prod_config = {
    apiKey: 'AIzaSyAFnj_KFkypyRhlBLceV7FIQwLBOk-13ek',
    authDomain: 'mamklearn.com',
    databaseURL: 'https://mamaroneck-learn-default-rtdb.firebaseio.com',
    projectId: 'mamaroneck-learn',
    storageBucket: 'mamaroneck-learn.appspot.com',
    messagingSenderId: '917106980205',
    appId: '1:917106980205:web:6d36bd431bbc3d91fa5664',
    measurementId: 'G-G1J2MYS1LJ',
};

const dev_config = {
    apiKey: 'AIzaSyAgHiNEDaV56gWiVGZHQ4PJzGP4_pHIfi8',
    authDomain: 'dev.mamklearn.com',
    databaseURL: 'https://mamklearn-preview-default-rtdb.firebaseio.com',
    projectId: 'mamklearn-preview',
    storageBucket: 'mamklearn-preview.appspot.com',
    messagingSenderId: '983255855082',
    appId: '1:983255855082:web:6a4e27e797084f519e8c93',
    measurementId: 'G-04FX04JNQ6',
};

const dev_build = window.location.hostname === 'localhost' || window.location.hostname === 'dev.mamklearn.com';

const app = initializeApp(dev_build ? dev_config : prod_config);
getAnalytics(app);
getPerformance(app);

// For public use.
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

useDeviceLanguage(auth);
