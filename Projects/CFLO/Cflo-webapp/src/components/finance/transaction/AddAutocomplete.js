 import React from 'react';
 import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
 import {makeStyles} from '@material-ui/core/styles';
 import Paper from '@material-ui/core/Paper';
 import InputBase from '@material-ui/core/InputBase';
 import IconButton from '@material-ui/core/IconButton';
 import CancelIcon from '@material-ui/icons/Cancel';
 import _ from 'lodash';
 
  
 const filter = createFilterOptions();
 
 const useStyles = makeStyles((theme) => ({
   inputPaper: {
     padding: '2px 4px',
     display: 'flex',
     alignItems: 'center',
     width: '16rem',
     borderRadius: 0,
     paddingLeft: 10,
   },
   input: {
     marginLeft: theme.spacing(1),
     flex: 1,
   },
   iconButton: {
     padding: 10,
   },
   row: {
     flex: 1,
     display: 'flex',
     flexDirection: 'row',
     alignItems: 'center',
   },
 
   center: {
     justifyContent: 'center',
     alignItems: 'center',
   },
 
   margin: {
     margin: '1rem',
   },
 }));
 
 export default function AddAutocomplete(props) {
   const classes = useStyles();
 
   const {
     value, text, setText, placeholder, results, getOptionLabel, onSelect, onNew,
   } = props;
  
   return (
     <Autocomplete
       id="combo-box-demo"
       value={value} 
       options={results}
       inputValue={text} 
       getOptionLabel={getOptionLabel}
       getOptionSelected={(option) => {
         return option?._id==value?._id;
       }}  
       style={{width: "280px", marginLeft: "18px", marginTop: "5px"}}
       onChange={(event, value) => {
         if (value?._id=='New') {
           onNew();
         }
         else {
           if (onSelect) {
             onSelect(value);
           }
         } 
       }}
       onInputChange={(event, newValue) =>{ setText(newValue); }}
       renderInput={(params) => (
         <Paper  {...params} component="form" className={classes.inputPaper} ref={params.InputProps.ref}>
           <InputBase
             {...params}
             className={classes.input}
             placeholder={placeholder?placeholder:'Add Members'}
             inputProps={{'aria-label': 'Add Members'}}
             {...params.inputProps}
           />
           {text.length>0?
                       <IconButton className={classes.iconButton} aria-label="clear-search"
                         onClick={()=>{
                           setText('');
                         }}>
                         <CancelIcon />
                       </IconButton>:null}
         </Paper>
       )}
     />
 
   );
 }
 