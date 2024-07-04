import { blue, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';

const questiontypeStyles = makeStyles((theme) => ({
    select: {
        display: 'flex',
        minWidth: 200,
        background: 'white',
        color: blue[500],
        // fontWeight: 200, 
        borderStyle: 'none',
        borderWidth: 2,
        borderRadius: 12,
        paddingLeft: 24,
        paddingTop: 14,
        paddingBottom: 15,
        // boxShadow: '0px 5px 8px -3px rgba(0,0,0,0.14)',
        "&:focus": {
            borderRadius: 12,
            background: 'white',
            borderColor: blue[100]
        },
    },
    icon: {
        color: blue[300],
        right: 12,
        position: 'absolute',
        userSelect: 'none',
        pointerEvents: 'none'
    },
    paper: {
        borderRadius: 12,
        marginTop: 8,
        boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);"
    },
    list: {
        paddingTop: 8,
        paddingBottom: 8,
        // paddingRight: 8,
        // paddingLeft: 8,
        background: 'white',
        boxShadow: 'none',
        "& li": {
            fontWeight: 200,
            paddingTop: 12,
            paddingBottom: 12,
        },
        "& li:hover": {
            background: grey[50]
        },
        "& li.Mui-selected": {
            color: 'black',
            background: blue[50]
        },
        "& li.Mui-selected:hover": {
            background: blue[50]
        }
    },
    listIcon: {
        minWidth: 32,
        // marginTop: 3
        // display: 'block',
        // alignItems: 'center',
        // justifyContent: 'center',
        // display: 'none' // hide the ListItemIcon in the dropdown
    }
}));

export default questiontypeStyles;