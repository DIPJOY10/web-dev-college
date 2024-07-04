import React, { useState, useEffect } from "react";
import "../css/Navbar.css";

function Navbar() {
  const [show, handleShow] = useState(false);
  // const [active,handleActive]=useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);

  return (
    <div className={`navbar ${show && "nav__black"}`}>
      <div className="navbar__contents">
        <a className="scroll active" href="#home">
          Home
        </a>
        <a className="scroll" href="#about">
          About
        </a>
        <a className="scroll" href="#skills">
          Skills
        </a>
        <a className="scroll" href="#work">
          Work
        </a>
        <a className="scroll" href="#contact">
          Contact
        </a>
      </div>
    </div>
  );
}

export default Navbar;

// var sections = document.getElementsByClassName("section");
// var links=document.getElementsByClassName("scroll");
//dynamically updating navigation links
//   sections.waypoint({

//     handler: function(event, direction) {

//      var active_section;

//     active_section = document.getElementsByClassName(this);
//     if (direction === "up") active_section = active_section.prev();

//     var active_link = document.getElementsByClassName(active_section.attr("id"));

//        links.parent().removeClass("active");
//        active_link.parent().addClass("active");

//   },
//   offset: '35%'

// });

// window.onscroll = ()=> {
//   var bScroll = document.body.scrollTop;

//   for (var i = 0; i < section.length; i++) {
//     var sHeight = section[i].offsetHeight;
//     var offsets = section[i].offsetTop;

//     if (bScroll > offsets && bScroll < offsets + sHeight) {
//       links[i].classList.add("active");
//     } else {
//       links[i].classList.remove("active");
//     }
//   }

// }
