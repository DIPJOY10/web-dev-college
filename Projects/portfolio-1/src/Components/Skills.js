import React from "react";
import SkillRow from "./SkillRow";
import "../css/Skills.css";
import $ from "jquery";
import { Waypoint } from "react-waypoint";

function Skills() {
  return (
    <div className="skills">
      <section id="skills">
        <Waypoint
          onEnter={() => {
            var active_link = $('.navbar__contents a[href="#skills"]');
            $(".navbar__contents>a.active").removeClass("active");
            active_link.addClass("active");
          }}
        />
        <h1 className="skills__heading">Skills</h1>
        <div className="wrapper">
          <div className="skills__left">
            <h2>Experience</h2>
            <p>
              I have been working with Java for the past 5 years in Competitive
              Coding. I also have a 1+ year experience in Javascript and Web
              Development, both front end and back end. I have proficient
              knowledge in ES6 and React.js. I am working with MERN for
              Full-Stack Development.
            </p>
          </div>
          <div className="skills__right">
            <SkillRow skill="Java" percentage="80%" />
            <SkillRow skill="React" percentage="75%" />
            <SkillRow skill="JavaScript" percentage="60%" />
            <SkillRow skill="CSS" percentage="40%" />
            <SkillRow skill="HTML" percentage="90%" />
            <SkillRow skill="Node" percentage="50%" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Skills;
