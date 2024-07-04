import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import DPUpload from '../../file/Uploader/dpUpload';
import Api from '../../../helpers/Api';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    height: (props)=>props.height,
    width: (props)=>props.width,
    position: 'relative',
    margin: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgDiv: {
    height: (props)=>props.height,
    width: (props)=>props.width,
    position: 'absolute',
    top: 0,
    left: 0,
  },


  iconDiv: {
    zIndex: '1000',
    position: 'absolute',
  },

}));
export default function DP(props) {
  const {
    user,
  } = useSelector((state) => state.auth);
  const [isUploading, setIsUploading] = useState(false);


  const [percentage, setPercentage] = useState(0);
  const {
    height, width, file, fileUpdateApi,
    parent, parentModelName,
  } = props;
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(file?.url);
  const classes = useStyles({
    height,
    width,
    file,
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  const uploadApi = ()=>{
    const imgDataUrl = URL.createObjectURL(image);
    setImageUrl(imgDataUrl);

    Api.post('file/upload', {
      name: image.name,
      used: true,
      type: image.type,
      user: user._id,
      userModelType: user.model,
      creator: user._id,
      parent,
      parentModelName,
    }).then((res)=>{
      const {url, file} = res;
      axios.put(url, image, {
        headers: {
          'Content-Type': image.type,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        onUploadProgress: function(progressEvent) {
          const percentage = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          setPercentage(percentage);
        },
      }).then((res)=>{
        fileUpdateApi(file);
        setIsUploading(false);
        setImage(null);
      });
    });
  };

  useEffect(() => {
    if (isUploading&&image&&image?.name) {
      uploadApi();
    }
  }, [isUploading]);

  return (
    <div className={root}>
      <img className={classes.imgDiv} src={imageUrl} />
      <div className={classes.iconDiv} >
        {isUploading?<CircularProgress variant="determinate" value={percentage} />:
                <DPUpload setImage={setImage} isUploading={setIsUploading} />}

      </div>
    </div>
  );
}
