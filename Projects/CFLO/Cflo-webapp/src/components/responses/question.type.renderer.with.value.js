import DateFnsUtils from '@date-io/date-fns';
import { TextField } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react'
import LinearScaleResponseWithValue from './linear.scale.response.with.value';
import MultipleChoiceGridResponse from './multiple.choice.grid.response.with.value';
import CheckboxGrid from "./checkbox.grid.response";
import MultipleChoiceResponse from './multiple.choice.response.with.value';


export default function QuestionTypeRendererWithValue(props) {
    const { question, type, value, setValue, updateApi, questionId, formResDict, qMap, setformResDict } = props;
    const renderType = (type) => {
        switch (type) {
            case 'Multiple Choice':
                return <MultipleChoiceResponse question={question} value={value} setValue={setValue} />
            case 'Linear Scale':
                return <LinearScaleResponseWithValue question={question} value={value} setValue={setValue} />
            case 'Short Answer':
                return <div style={{ width: "100%" }}>
                    <TextField
                        variant="standard"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        label="Your Answer"
                        style={{ width: "60%" }}
                    />
                </div>
            case 'Long Answer':
                return <div style={{ width: "100%" }}>
                    <TextField
                        variant="standard"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        label="Your Answer"
                        style={{ width: "90%" }}
                    />
                </div>
            case 'Multiple Choice Grid':
                return <MultipleChoiceGridResponse updateApi={updateApi} questionId={questionId} setformResDict={setformResDict} formResDict={formResDict} qMap={qMap} question={question} value={value} setValue={setValue} />

            case 'Checkbox Grid':
                return <CheckboxGrid updateApi={updateApi} questionId={questionId} setformResDict={setformResDict} formResDict={formResDict} qMap={qMap} question={question} value={value} setValue={setValue} />


            case 'Date':
                return <div style={{ width: "100%" }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            margin="normal"
                            id="date-picker-dialog"
                            label="Date picker"
                            format="MM/dd/yyyy"
                            value={value ? value : new Date()}
                            onChange={(date) => setValue(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
        }
    }
    return (
        <>{renderType(type)}</>
    )
}
