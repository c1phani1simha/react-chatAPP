import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { db } from '../../config/firebase';
import './ChatBox.css';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { arrayUnion } from 'firebase/firestore/lite';
import upload from '../lib/upload';

const ChatBox = () => {

  const { userData, messagesId, chatUser, messages, setMessages,chatVisible,setChatVisible } = useContext(AppContext);
  
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      // console.log(messagesId);
      if (input && messagesId) {
        await setDoc(
          doc(db, "messages", messagesId),
          {
            messages: [
              ...messages, // Keep existing messages
              {
                sId: userData.id,
                text: input,
                createdAt: new Date(),
              },
            ],
          },
          { merge: true }
        ); 


        const userIDs = [chatUser.rId, userData.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData : userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }

    setInput("");
  }

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messagesId) {
        await setDoc(
          doc(db, "messages", messagesId),
          {
            messages: [
              ...messages, // Keep existing messages
              {
                sId: userData.id,
                image: fileUrl,
                createdAt: new Date(),
              },
            ],
          },
          { merge: true }
        ); 

         const userIDs = [chatUser.rId, userData.id];

         userIDs.forEach(async (id) => {
           const userChatsRef = doc(db, "chats", id);
           const userChatsSnapshot = await getDoc(userChatsRef);

           if (userChatsSnapshot.exists()) {
             const userChatData = userChatsSnapshot.data();
             const chatIndex = userChatData.chatsData.findIndex(
               (c) => c.messageId === messagesId
             );
             userChatData.chatsData[chatIndex].lastMessage = "Image";
             userChatData.chatsData[chatIndex].updatedAt = Date.now();
             if (userChatData.chatsData[chatIndex].rId === userData.id) {
               userChatData.chatsData[chatIndex].messageSeen = false;
             }

             await updateDoc(userChatsRef, {
               chatsData: userChatData.chatsData,
             });
           }
         });
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour>12) {
      return hour - 12 + ":" + minute + " PM";
    } else {
      return hour + ":" + minute + " AM";
    }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        const m = res.data();
        if (m) {
          setMessages(res.data().messages.reverse());
        } else {
          setMessages([]);
        }
        
        // console.log(res.data().messages.reverse());
      });

      return () => {
        unSub();
      }
    }
  },[messagesId]);
  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} />
          ) : null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img onClick={()=>setChatVisible(false)} src={ assets.arrow_icon} className='arrow' alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg["image"] ? (
              <img className="msg-img" src={msg.image} />
            ) : (
              <p className="msg">{msg.text}</p>
            )}

            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
          name=""
          id=""
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png,image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
}

export default ChatBox



// import { doc, getDoc, onSnapshot, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
// import assets from '../../assets/assets';
// import { AppContext } from '../../context/AppContext';
// import { db } from '../../config/firebase';
// import './ChatBox.css';
// import React, { useContext, useEffect, useState } from 'react'
// import { toast } from 'react-toastify';

// const ChatBox = () => {

//   const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);
  
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     try {
//       if (input && messagesId) {
//         // 1. Update messages document (add new message to array)
//         await updateDoc(doc(db, 'messages', messagesId), {
//           messages: arrayUnion({
//             sId: userData.id,
//             text: input,
//             createdAt: serverTimestamp() // Use serverTimestamp for accurate time
//           })
//         });

//         // 2. Update userChatsRef document (update last message and seen status)
//         const userIDs = [chatUser.rId, userData.id];

//         userIDs.forEach(async (id) => {
//           const userChatsRef = doc(db, 'chats', id);
//           const userChatsSnapshot = await getDoc(userChatsRef);

//           if (userChatsSnapshot.exists()) {
//             const userChatData = userChatsSnapshot.data();

//             // 2.1 Update last message and seen status
//             await updateDoc(userChatsRef, {
//               "chatsData": {
//                 [messagesId]: {
//                   "lastMessage": input.slice(0, 30),
//                   "updatedAt": serverTimestamp(), // Use serverTimestamp for accurate time
//                   "messageSeen": id === userData.id ? false : userChatData.chatsData[messagesId].messageSeen // Update messageSeen only for the sender
//                 }
//               }
//             });
//           } else {
//             // 2.2 If userChatsRef doesn't exist, create it
//             await setDoc(userChatsRef, {
//               chatsData: {
//                 [messagesId]: {
//                   lastMessage: input.slice(0, 30),
//                   updatedAt: serverTimestamp(),
//                   messageSeen: id === userData.id ? false : true // Update messageSeen only for the sender
//                 }
//               }
//             });
//           }
//         });
//       }
//     } catch (error) {
//       toast.error("Failed to send message");
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (messagesId) {
//       const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
//         setMessages(res.data().messages.reverse());
//         console.log(res.data().messages.reverse());
//       });

//       return () => {
//         unSub();
//       }
//     }
//   }, [messagesId]);

//   return chatUser ? (
//     // ... rest of your ChatBox component
//   ) : (
//     // ... rest of your ChatBox component
//   );
// };

// export default ChatBox;
