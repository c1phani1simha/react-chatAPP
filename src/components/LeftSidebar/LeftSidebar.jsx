import React, { useContext, useEffect, useState } from 'react'
import './LeftSidebar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, logout } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData,chatData,chatUser,setChatUser,setMessagesId,messagesId,chatVisible,setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        // console.log(querySnap);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          // console.log(querySnap.docs[0].data());
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          })
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
          
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
      
    } catch (err) {
      
    }
  } 

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      })
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen:true
        }),
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      })


      const uSnap = await getDoc(doc(db, "users", user.id));
      const uData = uSnap.data();
      setChat({
        messagesId: newMessageRef.id,
        lastMessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData:uData
      })

      setShowSearch(false);
      setChatVisible(true);
    

    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, 'users', chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser(prev => ({...prev,userData:userData}))
      }
    }
    updateChatUserData();
  },[chatData])

  //  const inputHandler = async (e) => {
  //    const input = e.target.value;

  //    // Debounce the input
  //    clearTimeout(inputHandler.timeout);
  //    inputHandler.timeout = setTimeout(async () => {
  //      try {
  //        const userRef = collection(db, "users");
  //        const q = query(userRef, where("username", "==", input.toLowerCase()));
  //        const querySnap = await getDocs(q);

  //        // Update state with search results
  //        setSearchResults(querySnap.docs.map((doc) => doc.data()));
  //      } catch (err) {
  //        console.error("Error fetching users:", err);
  //      }
  //    }, 500); // Adjust the delay (500ms) as needed
  //  };

  const setChat = async (item) => {
    try {

       setMessagesId(item.messageId);
       setChatUser(item);
       const userChatsRef = doc(db, "chats", userData.id);
       const userChatsSnapshot = await getDoc(userChatsRef);
       const userChatsData = userChatsSnapshot.data();
       const chatIndex = userChatsData.chatsData.findIndex(
         (c) => c.messageId === item.messageId
       );
      // console.log(userChatsData.chatsData[chatIndex].messageSeen);
       userChatsData.chatsData[chatIndex].messageSeen = true;
       await updateDoc(userChatsRef, {
         chatsData: userChatsData.chatsData,
       })
      
      setChatVisible(true);
     
    } catch (err) {
      toast.error(err.message);
      console.log(err);
   }

   
  }

  return (
    <div className={ `ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={logout}>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            type="text"
            onChange={inputHandler}
            placeholder="Search user...."
          />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
           chatData.map((item, index) => (
             <div onClick={() => setChat(item)} key={index} className={ `friends ${item.messageSeen  || item.messageId === messagesId ? "" : "border"}`}>
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{ item.userData.name}</p>
                <span>{ item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftSidebar