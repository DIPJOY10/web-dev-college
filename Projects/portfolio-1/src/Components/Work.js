import React from "react";
import "../css/Work.css";
import covid_pic from "../images/covid-project.PNG";
import airbnb_pic from "../images/airbnb-project.PNG";
import hulu_pic from "../images/hulu-project.PNG";
import netflix_pic from "../images/netflix-project.PNG";
import Project from "./Project.js";
import $ from "jquery";
import { Waypoint } from "react-waypoint";

function Work() {
  return (
    <div className="work">
      <section id="work">
        <Waypoint
          onEnter={() => {
            var active_link = $('.navbar__contents a[href="#work"]');
            $(".navbar__contents>a.active").removeClass("active");
            active_link.addClass("active");
          }}
        />
        <h1>Here's Some of My Works...</h1>
        <div className="work__links">
          <Project
            project_title="COVID-19 Tracker"
            project_image={covid_pic}
            project_url="https://covid-19-tracker-cd29f.web.app/"
          />
          <Project
            project_title="Netflix Clone"
            project_image={netflix_pic}
            project_url="https://netflix-clone-a96d4.web.app/"
          />
          <Project
            project_title="Airbnb Clone"
            project_image={airbnb_pic}
            project_url="https://airbnb-clone-ff15b.web.app/"
          />
          <Project
            project_title="HULU Clone"
            project_image={hulu_pic}
            project_url="https://hulu-clone-f567c.web.app/"
          />
        </div>
      </section>
    </div>
  );
}

export default Work;
//https://covid-19-tracker-cd29f.web.app/
//https://hulu-clone-f567c.web.app/
//https://netflix-clone-a96d4.web.app/
//https://airbnb-clone-ff15b.web.app/
