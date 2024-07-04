import React from "react";
import "../css/About.css";
import Profile_photo from "../images/profile_photo.jpg";
import $ from "jquery";
import { Waypoint } from "react-waypoint";

function About() {
  return (
    <div className="about">
      <section id="about">
        <Waypoint
          onEnter={() => {
            var active_link = $('.navbar__contents a[href="#about"]');
            $(".navbar__contents>a.active").removeClass("active");
            active_link.addClass("active");
          }}
        />
        <img src={Profile_photo} alt="Dipjoy's pic" />
        <div className="about__info">
          <h1>About Me</h1>
          <p>
            I am a India based Competitive coder & passionate full-stack
            Web-developer.
          </p>
          <h1>Education</h1>
          <p>
            Currently a Second Year Undergraduate from the department of
            Chemical Engineering <br /> at Indian Institute of Technology,
            Kharagpur.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
