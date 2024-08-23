import assets from '../../assets/assets';
import './ChatBox.css';
import React from 'react'

const ChatBox = () => {
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>
          Phani Simha
          <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>

      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
            aspernatur dolore error asperiores similique odit aliquam id
            dignissimos magni soluta molestiae nemo quisquam, provident est
            nihil inventore, nobis eligendi repellat.
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="s-msg">
          <img className="msg-img"src={ assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>

        <div className="r-msg">
          <p className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
            aspernatur dolore error asperiores similique odit aliquam id
            dignissimos magni soluta molestiae nemo quisquam, provident est
            nihil inventore, nobis eligendi repellat.
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2:30 PM</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input type="text" placeholder="Send a message" name="" id="" />
        <input type="file" id="image" accept="image/png,image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  );
}

export default ChatBox