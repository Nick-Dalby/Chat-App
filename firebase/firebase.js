// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBIJ37IvBn1Cbk7vMC6IiGJ7RnGLV8_bpU',
  authDomain: 'chat-app-60d55.firebaseapp.com',
  projectId: 'chat-app-60d55',
  storageBucket: 'chat-app-60d55.appspot.com',
  messagingSenderId: '976992003076',
  appId: '1:976992003076:web:63af33e1f883539de00151',
  measurementId: 'G-LMVDP8WT37',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth();