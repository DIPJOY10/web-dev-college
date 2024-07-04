import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OrganizationSection from "../sections/OrganizationSection";
import SkillSection from "../sections/SkillSection";
import EducationSection from "../sections/EducationSection";
import ExperienceSection from "../sections/ExperienceSection";
import AboutSection from "../sections/AboutSection";
import ProjectSection from "../sections/ProjectSection";
import LanguageSection from "../sections/LanguageSection";
import LicenseSection from "../sections/LicenseSection";
import HonorSection from "../sections/HonorSection";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const UserAbout = ({
  isOwnProfile,
  profile,
  setDialog,
  setShowAbout,
  setShowExperience,
  setShowExperienceEdit,
  setShowEducation,
  isEducation,
  setShowEducationEdit,
  setShowSkill,
  setShowSkillEdit,
  setShowOrganization,
  setShowOrganizationEdit,
  setShowProject,
  setShowProjectEdit,
  setShowGallery,
  setGalleryFileIds,
  setShowLang,
  setShowLangEdit,
  setShowLicense,
  setShowLicenseEdit,
  setShowHonor,
  setShowHonorEdit,
  progress,
  setProgress,
  dialog
}) => {
  const classes = useStyles();


  return (
    <div>
      <AboutSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowAbout={setShowAbout}
        setShowExperience={setShowExperience}
        setShowEducation={setShowEducation}
        setShowSkill={setShowSkill}
        isEducation={isEducation}
        progress={progress}
        setProgress={setProgress}
        dialog={dialog}
      />
      <ExperienceSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowExperience={setShowExperience}
        setShowExperienceEdit={setShowExperienceEdit}
        setShowOrganization={setShowOrganization}
        setShowOrganizationEdit={setShowOrganizationEdit}
      />
      <EducationSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowEducation={setShowEducation}
        setShowEducationEdit={setShowEducationEdit}
        setProgress={setProgress}
      />
      <SkillSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowSkill={setShowSkill}
        setShowSkillEdit={setShowSkillEdit}
      />
      {/* <OrganizationSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowOrganization={setShowOrganization}
        setShowOrganizationEdit={setShowOrganizationEdit}
      /> */}
      <ProjectSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowProject={setShowProject}
        setShowProjectEdit={setShowProjectEdit}
        setShowGallery={setShowGallery}
        setGalleryFileIds={setGalleryFileIds}
      />
      <LanguageSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowLang={setShowLang}
        setShowLangEdit={setShowLangEdit}
        setProgress={setProgress}
      />
      <LicenseSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowLicense={setShowLicense}
        setShowLicenseEdit={setShowLicenseEdit}
      />
      <HonorSection
        isOwnProfile={isOwnProfile}
        profile={profile}
        setDialog={setDialog}
        setShowHonor={setShowHonor}
        setShowHonorEdit={setShowHonorEdit}
      />
    </div>
  );
};

export default UserAbout;
