import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCRpduINHx4H0EWQjF6ylFBuTPGC2Uxk7c",
  authDomain: "chat-app-gs-67df5.firebaseapp.com",
  projectId: "chat-app-gs-67df5",
  storageBucket: "chat-app-gs-67df5.appspot.com",
  messagingSenderId: "1083824246428",
  appId: "1:1083824246428:web:4188b773340fc26b212759",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const usersCollectionRef = collection(db, "users");
    await addDoc(usersCollectionRef, {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
      lastSeen: Date.now(),
      // Add other user data as needed
    });

    // Create a new document in the "chats" collection for the user
    const chatsCollectionRef = doc(db, "chats", user.uid); // Use doc() for a new document
    await setDoc(chatsCollectionRef, {
      chatData: [],
      // Add other user data as needed
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code);
  }
};

const login = async (email,password) => {
  
}

export { signup };
