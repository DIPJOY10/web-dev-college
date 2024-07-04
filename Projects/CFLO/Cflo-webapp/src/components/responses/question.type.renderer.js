import React from 'react'
import LinearScaleResponse from './linear.scale.response';
import LongAnswerResponse from './long.answer.response';
import MultipleChoiceGridResponse from './multiple.choice.grid.response';
import MultipleChoiceResponse from './multiple.choice.response';
import ShortAnswerResponse from './short.answer.response';

export default function QuestionTypeRenderer(props) {
    const { question, type } = props;
    // const type = question?.type;
    const renderType = (type) => {
        switch (type) {
            case 'Multiple Choice':
                return <MultipleChoiceResponse question={question} />
            case 'Linear Scale':
                return <LinearScaleResponse question={question} />
            case 'Short Answer':
                return <ShortAnswerResponse question={question} />
            case 'Long Answer':
                return <LongAnswerResponse question={question} />
            case 'Multiple Choice Grid':
                return <MultipleChoiceGridResponse question={question} />
        }
    }
    return (
        <>{renderType(type)}</>
    )
}
