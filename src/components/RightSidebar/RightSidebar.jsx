import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import './RightSidebar.css';
import React from 'react'

const RightSidebar = () => {
  return (
    <div className='rs'>
      <div className='rs-profile'>
        <img src={assets.profile_img} alt="" />
        <h3>Phani Simha  <img src={ assets.green_dot} alt="" className='dot' /></h3>
        <p>Hi this is my bio section guys</p>
      </div>

      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1 } alt="" />
          <img src={ assets.pic2} alt="" />
          <img src={ assets.pic3} alt="" />
          <img src={ assets.pic4} alt="" />
          <img src={ assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default RightSidebar