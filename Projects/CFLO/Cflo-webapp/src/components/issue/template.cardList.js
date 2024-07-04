import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Api from "../../helpers/Api";
import ListCard from "./list.card";
import Choose from "../select/choose";
import { Button } from "@material-ui/core";
import arrayToReducer from "../../helpers/arrayToReducer";

const useStyles = makeStyles((theme) => ({
  root: {
    // border: "1px solid red",
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "20px",
  },
  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
}));
export default function TemplateCardList(props) {
  const [openChoose, setOpenChoose] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const {
    templateIds,
    templateDictionary,
    setTemplateIds,
    setTemplateDictionary,
    onDelete,
    issueIds,
    issueDictionary,
    grouped,
    profileId,
  } = props;

  console.log(Object.values(templateIds), grouped);

  // const listcards=()=>{
  //     return Object.values(templateIds).map((templateId, index) => {
  //         return (
  //         )})
  // }

  const importTemplate = async (arr) => {
    if (arr?.length > 0) {
      const templateIds = arr.map((e) => e?._id);
      const res = await Api.post("issue/template/import", {
        templateIds,
        profileId,
      });
      const data = res?.data;

      if (data) {
        const { newDict, idArr } = arrayToReducer(data);
        const newSet = new Set([...idArr, ...templateIds]);
        const newArr = Array.from(newSet);
        setTemplateIds(newArr);
        setTemplateDictionary({
          ...templateDictionary,
          ...newDict,
        });
      }
    }
  };

  //issue->made of templates
  //template -> form -> questions
  //task:make a new template out of pre defined templates
  //template: population of pipeline,start state, final states, shared, managers, forms, profile, default title:"Untitled"
  //club all together
  //get all pipelines first,merge them in an array and send to backend

  const cloneTemplates = async () => {
    const templateIdArray = [
      "63d8de74b493b3179430154e",
      "63d8e040b493b3179430155d",
      "63d95c4c5a558b2a2c3f655b",
    ];
    const res = await Api.post("issue/template/clone", {
      templateIdArray,
      profileId,
    });
    const data = res?.data;
  };

  return (
    <div className={classes.root}>
      <div>
        <Button
          style={{ textTransform: "none", borderRadius: "1.2rem" }}
          variant="outlined"
          color="primary"
          onClick={() => setOpenChoose(true)}
        >
          Import
        </Button>
        <Button
          style={{ textTransform: "none", borderRadius: "1.2rem" }}
          variant="outlined"
          color="primary"
          onClick={() => cloneTemplates()}
        >
          Clone
        </Button>
        <Choose
          open={openChoose}
          setOpen={setOpenChoose}
          parentModelName={"Template"}
          multiple={true}
          disableModelChange={true}
          placeHolder={"Import Template"}
          onSelected={(arr) => {
            console.log(arr, " is the array");
            importTemplate(arr);
          }}
        />
      </div>

      {templateIds.map((templateId, index) => {
        const title = templateDictionary[templateId]?.title;
        const issues = grouped[templateId] || [];
        const filterIssueIds = issues.map((issue) => issue?._id);
        return (
          <ListCard
            templateId={templateId}
            title={title}
            onDelete={onDelete}
            issueIds={filterIssueIds}
            issueDictionary={issueDictionary}
          />
        );
      })}
    </div>
  );
}
