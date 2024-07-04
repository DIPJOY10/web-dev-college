import React from "react";
import "../css/Home.css";
import FacebookIcon from "@material-ui/icons/Facebook";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import $ from "jquery";
import { Waypoint } from "react-waypoint";

function Home() {
  return (
    <div className="home">
      <section id="home">
        <Waypoint
          onEnter={() => {
            var active_link = $('.navbar__contents a[href="#home"]');
            $(".navbar__contents>a.active").removeClass("active");
            active_link.addClass("active");
          }}
        />
        <div className="home__info">
          <h1>I'm Dipjoy.</h1>
          <p>
            I am a B.Tech Student at IIT Kharagpur <br />
            A Competitive Programmer by day and Web Developer by night. <br />
            #dj.js
          </p>
          <FacebookIcon
            onClick={(event) =>
              (window.location.href =
                "https://www.facebook.com/dipjoy.basak.12")
            }
            className="home__icon"
          />
          <LinkedInIcon
            onClick={(event) =>
              (window.location.href =
                "https://www.linkedin.com/in/dipjoy-basak-3738b8191/")
            }
            className="home__icon"
          />
          <InstagramIcon
            onClick={(event) =>
              (window.location.href = "https://www.instagram.com/basakdipjoy/")
            }
            className="home__icon"
          />
          <GitHubIcon
            onClick={(event) =>
              (window.location.href = "https://github.com/DIPJOY10")
            }
            className="home__icon"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
