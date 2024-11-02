import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCC55cfj_U4JvWH0xW2klNw2Nfb8g_GEfk",
  authDomain: "quiz-app-22f5a.firebaseapp.com",
  projectId: "quiz-app-22f5a",
  storageBucket: "quiz-app-22f5a.firebasestorage.app",
  messagingSenderId: "581366630216",
  appId: "1:581366630216:web:286e046b589c47f29a557d",
  measurementId: "G-HLBYVS5NH6"
}


const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db, app }