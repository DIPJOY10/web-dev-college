import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';




const useStyles = makeStyles((theme) => ({
    titleCont: {
        width: "600px"
    },
    headerTitle: {
        fontSize: "20px",
        fontWeight: "550",
    },
    dialogCont: {
        width: "100%",
        height: "200px",
        paddingTop: "15px",
        paddingBottom: "25px",
    }
}));

export default function ShowPortfolios(props) {
    const history = useHistory();
    const { teamId } = useParams();
    const {
        accessablePortfolios, 
        setSelectedAccessablePortfolio, 
        selectedAccessablePortfolio
    } = props;
    const DateNow = new Date();
    const { auth } = useSelector((state) => state);
    const [allAccessablePortfolios, setAllAccessablePortfolios] = useState([]);
    const [accessablePortfolioValue, setAccessablePortfolioValue] = useState();
    const [accessablePortfolioText, setAccessablePortfolioText] = useState("");




    useEffect(() => {
        setAllAccessablePortfolios(accessablePortfolios)
        if (selectedAccessablePortfolio) {
            setAccessablePortfolioValue(selectedAccessablePortfolio)
        } else {
            setAccessablePortfolioValue(accessablePortfolios[0])
        }
    }, [accessablePortfolios, selectedAccessablePortfolio])

    const getOptionLabel = (option) => {
        return option?.name || ""
    }

    const onPortfolioSelected = (value) => {
        setAccessablePortfolioValue(value)
        setSelectedAccessablePortfolio(value)
    }

    return (
        <div>
            {allAccessablePortfolios.length > 0 ? (
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={accessablePortfolioValue}
                    inputValue={accessablePortfolioText}
                    options={allAccessablePortfolios}
                    getOptionLabel={getOptionLabel}
                    getOptionSelected={(option) => {
                        return option?._id == accessablePortfolioValue?._id;
                    }}
                    onChange={(event, value) => {
                        onPortfolioSelected(value)
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Portfolios" margin="normal" variant="outlined" />
                    )}
                    onInputChange={(event, newValue) => {
                        setAccessablePortfolioText(newValue);
                    }}
                    renderOption={(option, state) => {
                        if (option) {
                            return (
                                <div style={{ width: "100%" }} >
                                    <span style={{ fontSize: "17px" }} >{option?.name}</span>
                                    <span style={{ fontSize: "12px", opacity: '0.7', marginLeft: "10px" }} >({option?.idCode})</span>
                                </div>
                            )
                        }
                        else {
                            return null;
                        }
                    }}
                    style={{ width: "100%" }}
                    size="small"
                />
            ) : (
                <div>No Portfolio available</div>
            )}
        </div>
    );
}
