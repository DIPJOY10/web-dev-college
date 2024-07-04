import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    margin: '1rem',
  },

  divStyle: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  avatarDivStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.7rem',
  },
  nameDivStyle: {
    flex: 4,
  },
  nameText: {
    fontSize: 20,
    fontFamily: 'Ovo',
    paddingLeft: '2rem',
    marginTop: '1rem',
  },
}));

const Person = (props) =>{
  const classes = useStyles();
  const {
    _id,
    displayName,
    displayPicture,
  } = props.person;

  const history = useHistory();

  const handleClick = (event) => {
    // console.log(_id,' is the id')
    const path = '/profile/'+_id;
    history.push(path);
  };

  return (
    <Paper variant="outlined">
      <ButtonBase onClick={handleClick} className={classes.root}>
        <Grid container>
          <Grid item xs={2}>
            <div className={classes.avatarDivStyle}>
              <Avatar alt={displayName} src={displayPicture.thumbUrl} />
            </div>
          </Grid>
          <Grid item xs={10}>
            <div className={classes.nameDivStyle}>
              <Typography className={classes.nameText}>
                {displayName}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </ButtonBase>

    </Paper>
  );
};

export default Person;
