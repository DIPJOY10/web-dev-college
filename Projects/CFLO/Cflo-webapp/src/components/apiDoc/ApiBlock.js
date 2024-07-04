import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JSONPretty from 'react-json-prettify';
import baseStyle from "../styled/base/index";

const useStyles = makeStyles((theme) => ({
    ...baseStyle,
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function ApiBlock(props) {


    const classes = useStyles();
    const [data, setData] = useState(null)


    let name = data?.name
    let route = data?.route
    let description = data?.description
    let input = data?.input
    let output = data?.output

    return (

        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.heading}>Transaction</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {data?.name?<>
                    <Typography>
                        {data?.name}
                    </Typography>
                    <Typography>
                        {data?.route}
                    </Typography>
                    <Typography>
                        {data?.description}
                    </Typography>
                    <div className={row}>
                        <div className={row}>
                            <JSONPretty json={data?.input} />
                        </div>
                        <div className={row}>
                            <JSONPretty json={data?.output} />
                        </div>
                    </div>
                </>:null}


            </AccordionDetails>
        </Accordion>
    
    );
}