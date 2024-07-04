import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react'
import arrayToReducer from '../../helpers/arrayToReducer';
import QuestionView from './questionView';
import _ from "lodash";
import Api from "../../helpers/Api";
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    }
}));
export default function Response(props) {
    const classes = useStyles();
    const [questionIds, setQuestionIds] = React.useState([]);
    const [questionDict, setQuestionDict] = React.useState({});
    const [formResIds, setformResIds] = React.useState([]);
    const [formResDict, setformResDict] = React.useState({});
    const [formQMap, setFormQMap] = React.useState({});

    const { questions, issue } = props;
    useEffect(() => {
        const { idArr, newDict } = arrayToReducer(questions);
        setQuestionIds(idArr);
        setQuestionDict(newDict);

        const formResponses = issue?.formResponses || []
        const newQMap = _.groupBy(formResponses, 'question')
        console.log(newQMap)
        console.log(formResponses)
        setFormQMap(newQMap);

        const { idArr: idArrRes, newDict: newDictRes } = arrayToReducer(formResponses);
        setformResIds(idArrRes);
        setformResDict(newDictRes);


    }, [questions, setQuestionIds, setQuestionDict, issue.formResponses]);
    console.log(questionIds, questionDict);

    const updateApi = async (resBody) => {
        const res = await Api.post("form/updateRes", resBody);
        const data = res?.data
        if (data) {
            const { idArr, newDict } = arrayToReducer([data])
            setformResDict({
                ...formResDict,
                ...newDict
            })
        }
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                {
                    questionIds.map((questionId, index) => {
                        const question = questionDict[questionId];
                        if (question.questionText) return (
                            <QuestionView
                                questionId={questionId}
                                question={question}
                                key={index}
                                qMap={formQMap}
                                formResDict={formResDict}
                                setformResDict={setformResDict}
                                updateApi={updateApi}
                            />
                        );
                    })
                }
            </Grid>
        </div>
    )
}
