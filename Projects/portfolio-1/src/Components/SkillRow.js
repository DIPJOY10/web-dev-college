import React from "react";
import "../css/SkillRow.css";

function SkillRow({ skill, percentage }) {
  let class_skill = skill.toLowerCase();
  return (
    <div className="skillrow">
      <p>{skill}</p>
      <div className="container">
        <div className={`skillbar ${class_skill}`}>{percentage}</div>
      </div>
    </div>
  );
}

export default SkillRow;
