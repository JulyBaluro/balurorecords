import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCkbuHDa3p-3t6VIeruC_tZIcyN3iRtwws',
    authDomain: 'studentrecords-project.firebaseapp.com',
    projectId: 'studentrecords-project',
    storageBucket: 'studentrecords-project.firebasestorage.app',
    messagingSenderId: '287203479095',
    appId: '1:287203479095:web:84c4be7788aa9a8fc879b2',
    measurementId: 'G-1CCQL5MGV3',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { analytics, app, db };
