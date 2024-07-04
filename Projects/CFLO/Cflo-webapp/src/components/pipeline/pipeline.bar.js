import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {AppBar, IconButton, Box, Toolbar} from '@material-ui/core';
import {ColorBlob} from './color.cards';
import DraggableCardList from './DraggableCardList';
import DraggableStatusList from './DraggableStatusList';
import SearchBar from '../SearchBar';
import PipelineList from './pipeline.list';
import {ButtonBase} from '@material-ui/core';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import Badge from '@material-ui/core/Badge';


const useStyles = makeStyles((theme) => ({
  searchBar: {
    marginTop: '1rem',
    marginLeft: '2rem',
    marginBottom: 0,
    paddingBottom: 0,
    width: '24rem',
    height: '4rem',
  },
  button: {
    height: '3rem',
  },
  pipelineBox: {
    diplay: 'flex',
    width: '3rem',
    color: theme.palette.primary.main,
    flexDirection: 'column',
  },
  upperPipelineIconStyle: {
    color: theme.palette.primary.main,
    fontSize: '1.9rem',
    marginBottom: '-0.2rem',
  },
  lowerPipelineIconStyle: {
    color: theme.palette.primary.main,
    fontSize: '1.9rem',
    marginTop: '-1.2rem',
  },
}));

export default function PipelineBar(props) {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const pipelineReducer = useSelector((state) => state.pipeline);
  const {

    search,
    type,
    listView,
    setListView,
  } = props;

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm]);

  return (
    <Box flexDirection="row" display="flex" overflow="auto">
      <div className={classes.searchBar}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <ButtonBase
        className={classes.button}
        onClick={()=>{
          setListView(!listView);
        }}
      >
        <div className={classes.pipelineBox}>
          <LinearScaleIcon className={classes.upperPipelineIconStyle}/>
          <LinearScaleIcon className={classes.lowerPipelineIconStyle}/>
        </div>
        <Typography>
                        Manage {type} Pipelines
        </Typography>

      </ButtonBase>
    </Box>
  );
}
