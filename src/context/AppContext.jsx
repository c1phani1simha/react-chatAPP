
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase"; // Ensure the path is correct
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app"; // Import initializeApp
import "firebase/firestore";
import { auth } from "../config/firebase";
export const AppContext = createContext();
const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const navigate = useNavigate();

  const loadUserData = async (uid) => {
     // Get the Firestore instance
     // Assuming you're authenticated
    const userRef = doc(db,"users",uid); // Now you can use db.collection()

    try {
      const doc = await getDoc(userRef);
      if (doc.exists) {
        console.log(doc.data());
        setUserData(doc.data());
      } else {
        console.log("No such user document!");
      }
      const userData = doc.data();


      if (userData.avatar && userData.name) {
        navigate("/chat");
      }
      else {
        navigate("/profile");
      }

      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });
      setInterval(async () => {
        if (auth.chatUser) {
           await updateDoc(userRef, {
             lastSeen: Date.now(),
           })
        }
      },60000)
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };
  useEffect(() => {
   
       if (userData) {
         const chatRef = doc(db, "chats", userData.id);
         const unSub = onSnapshot(chatRef, async (res) => {
           const chatItems = res.data().chatsData;
           const tempData = [];
           for (const item of chatItems) {
             const userRef = doc(db, "users", item.rId);
             const userSnap = await getDoc(userRef);
             const userData = userSnap.data();
             tempData.push({ ...item, userData });
           }
           setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
         });
         return () => {
           unSub();
         };
       }
   
      
    
  },[userData]);


  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    setMessagesId,
    messagesId,
    chatUser,
    setChatUser,
    chatVisible,setChatVisible
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
