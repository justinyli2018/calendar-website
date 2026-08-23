import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  projectId: "student-schedule-mgr-app",
  appId: "1:146379539054:web:0ebbcb18d0fbee5810dc7f",
  storageBucket: "student-schedule-mgr-app.firebasestorage.app",
  apiKey: "AIzaSyCKUb3QG7WMdCcKpx7Z533MVa7G48-6_vk",
  authDomain: "student-schedule-mgr-app.firebaseapp.com",
  messagingSenderId: "146379539054",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
