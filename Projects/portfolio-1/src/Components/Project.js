import React from "react";
import "../css/Project.css";

function Project({ project_title, project_image, project_url }) {
  return (
    <div className="project">
      <div className="container">
        <a href={project_url}>
          <img className="project-image" src={project_image} alt="" />
          <div className="overlay">
            <div className="project_description">
              <h5>{project_title}</h5>
            </div>
            <div className="link-icon">
              <i className="fa fa-link" aria-hidden="true"></i>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default Project;

//code for overlay
// eslint-disable-next-line no-lone-blocks
{
  /* <div class="container">
  <img src="img_avatar.png" alt="Avatar" class="image">
  <div class="overlay">
    <a href="#" class="icon" title="User Profile">
      <i class="fa fa-user"></i>
    </a>
  </div>
</div> */
}
