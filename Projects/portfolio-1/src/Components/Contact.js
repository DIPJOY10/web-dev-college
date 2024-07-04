import React from "react";
import "../css/Contact.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
import PeopleIcon from "@material-ui/icons/People";
import HomeIcon from "@material-ui/icons/Home";
import $ from "jquery";
import { Waypoint } from "react-waypoint";

function Contact() {
  return (
    <div className="contact">
      <section id="contact">
        <Waypoint
          onEnter={() => {
            var active_link = $('.navbar__contents a[href="#contact"]');
            $(".navbar__contents>a.active").removeClass("active");
            active_link.addClass("active");
          }}
        />
        <h1 className="contact__header">Get In Touch</h1>
        <div className="contact__info">
          <div className="contact__left">
            <i className=" env fa fa-envelope fa-5x"></i>
            <form className="form" action="">
              <div className="contact__row">
                <label className="label" htmlFor="text">
                  Name
                </label>
                <input type="text" />
              </div>
              <div className="contact__row">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input type="text" />
              </div>
              <div className="contact__row">
                <label htmlFor="text">Subject</label>
                <input type="text" />
              </div>
              <div className="contact__row">
                <label htmlFor="message">Message</label>
                <input type="text" />
              </div>
              <div className="submit">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
          <div className="line"></div>
          <div className="contact__right">
            <div>
              <p>
                <MailOutlineIcon /> email: basakdipjoy@gmail.com
              </p>
            </div>
            <div>
              <PhoneIcon />
              <p> +919775167784</p>
            </div>
            <div>
              <PeopleIcon />
              <a className="link" href="#home">
                {" "}
                Social Media Handles
              </a>
            </div>
            <div>
              <p>
                <HomeIcon /> Samudragarh,Nasaratpur <br /> -713519, S.T.K.K Road
                <br /> West Bengal, India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
