import React,{ useState,useEffect } from "react";
import "./Nav.css";

function Nav(){

  const [show,handleShow]=useState(false);

  useEffect(()=>{
    window.addEventListener("scroll",()=>{
      if(window.scrollY>100){
        handleShow(true);
      }
      else handleShow(false);
    });
    return ()=>{
      window.removeEventListener("scroll",handleShow);
    };
  },[]);
  return(
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Logo_Netflix.png"
          alt="Netflix logo"
        />
        <img
          className="nav__avatar"
          src="https://pbs.twimg.com/profile_images/1240119990411550720/hBEe3tdn_400x400.png"
          alt="Nav Avatar"
        />
      </div>
    </div>
  );
}

export default Nav;