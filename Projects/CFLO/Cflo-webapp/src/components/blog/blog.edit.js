import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Checkbox, FormControlLabel, useMediaQuery, TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import { deleteFiles, getCategoryByName, getFiles } from './api.call';
import { useParams } from 'react-router-dom';
import Api from '../../helpers/Api';
import CircularProgress from '@material-ui/core/CircularProgress';
import TitleInput from '../styled/title.input';
import CloseIcon from '@material-ui/icons/Close';
import BlogParaEdit from './blog.para.edit';
import LogoPrimary from "../../Assets/LogoPrimary.svg"
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CategoryAutocomplete from '../styled/CommonComponents/CategoryAutocomplate';
import { pinUpBlogAndUnPinBlogs } from '../styled/CommonComponents/api.call';


const useStyles = makeStyles((theme) => ({
  imgStyle: {
    width: "40px",
    height: "auto",
    cursor: "pointer",
  },
  navbar: {
    width: "100%",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
    padding: "0px 5px",
  },
  logoCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleStyle: {
    color: theme.palette.primary.main,
    fontSize: "20px",
    fontWeight: "510",
  },
  mainComponentCont: {
    width: "100%",
    height: "calc(100vh - 50px)",
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: "#F5F7FA",
    padding: "40px"
  },
  loaderCont: {
    position: 'fixed',
    top: "0px",
    right: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "1000",
    paddingLeft: "0px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputCont: {
    padding: "16px 16px 23px",
    "& h4": {
      fontSize: "20px",
      fontWeight: "500"
    }
  },
  checkCont: {
    display: "flex",
    alignItems: "center",
    padding: "20px 16px",
    "& p": {
      fontSize: "20px",
      fontWeight: "500"
    }
  },
  fileConts: {
    margin: "1rem",
    display: 'flex',
    flexWrap: "wrap",
    "& img": {
      width: "150px",
      height: "auto",
      marginRight: "20px"
    }
  },
  crossIcon: {
    position: "absolute",
    top: "5px",
    right: "25px",
    color: "#EE1D52",
  },
  categoriesCont: {
    display: "flex",
    flexWrap: "wrap",
    "& div": {
      marginRight: "10px",
      borderRadius: "12px",
      padding: "4px 8px",
      border: '1px solid gray',
      marginBottom: "5px",
      display: "flex",
      alignItems: "center",
    }
  }
}));

export default function BlogEdit(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { blogId } = useParams();

  const file = useSelector((state) => state.file);
  const { createdFileIds } = file;
  const { auth } = useSelector((state) => state);
  const profile = auth?.user?.profile
  const userId = auth?.user?._id

  useEffect(() => {
    if (!profile || !userId) {
      history.push("/")
    }
  }, [profile, userId])

  const [blog, setBlog] = useState(null)
  const [title, setTitle] = useState('')
  const [isPublic, setIsPublic] = useState(false);
  const [currentPera, setCurrentPera] = useState(null);
  const [loadingBool, setLoadingBool] = useState(false);
  const [desc, setDesc] = useState("");
  const [isPinUp, setIsPinUp] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([])
  const [currentFiles, setCurrentFiles] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (currentPera === "blogDesc" && createdFileIds.length > 0) {
      getFiles({ files: createdFileIds })
        .then((filesData) => {
          let updatedFiles = [...currentFiles, ...filesData]
          setCurrentFiles(updatedFiles)
          console.log(filesData)
          dispatch({ type: "FileUploadReset" });
          setCurrentPera(null)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [createdFileIds])

  const getBlog = async () => {
    setLoadingBool(true)
    const res = await Api.post('blog/getBlog', { blogId })
    const data = res?.data || null;
    if (data) {
      if (data?.profile?._id !== profile) {
        history.push("/")
      }

      setBlog(data)
      setTitle(data?.title)
      setIsPublic(data?.isPublic)
      setDesc(data?.desc)
      setIsPinUp(data?.isPinUp)
      if (data?.categories && data?.categories.length > 0) {
        setCategories(data?.categories)
      }
      if (data?.DPBlog?.url) {
        setCurrentFiles([data?.DPBlog])
      }
    }
    setLoadingBool(false)
  }

  useEffect(() => {
    getBlog()
  }, [])

  const update = async () => {
    setLoadingBool(true)
    let updatedRemove = [...removeFiles]
    if (currentFiles.length > 1) {
      let len = currentFiles.length;
      let removedFil = currentFiles.slice(1, len)
      updatedRemove = [...removeFiles, ...removedFil]
    }
    if (updatedRemove && updatedRemove.length > 0) {
      await deleteFiles({ files: updatedRemove })
        .then((data) => {
          console.log(data)
        })
    }
    let obj = {
      _id: blogId,
      title: title,
      desc: desc,
      isPinUp: isPinUp
    }

    if (categories && categories.length > 0) {
      let categoryIds = []
      categories.map((cat) => {
        categoryIds.push(cat?._id)
      })
      obj.categories = categoryIds;
    }

    if (currentFiles.length > 0) {
      obj.DPBlog = currentFiles[0]?._id
    }
    const res = await Api.post('blog/admin/update', obj);
    setLoadingBool(false)
  }

  const publish = async () => {
    setLoadingBool(true)
    const res = await Api.post('blog/admin/update', {
      _id: blogId,
      isPublic: !isPublic
    })
    setLoadingBool(false)
  }

  const addPara = async () => {
    setLoadingBool(true)
    const res = await Api.post('blog/admin/addPara', {
      blogId
    })
    const data = res?.data || null
    if (data) {
      setBlog(data)
    }
    setLoadingBool(false)
  }

  const removeFile = async (id) => {
    let removed = [...removeFiles, id]
    setRemoveFiles(removed)
    let updatedFiles = [];
    currentFiles.map((file) => {
      if (id !== file?._id) {
        updatedFiles.push(file)
      }
    })
    setCurrentFiles(updatedFiles)
  }

  const changePinUp = async (value) => {
    setIsPinUp(value)
    if (value) {
      setLoadingBool(true)
      await pinUpBlogAndUnPinBlogs({ _id: blog?._id })
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
      setLoadingBool(false)
    }
  }


  return (
    <div className={classes.root}>
      <div className={classes.navbar} >
        <div className={classes.logoCont} >
          <img
            className={classes.imgStyle}
            src={LogoPrimary}
            onClick={() => { history.push("/") }}
          />
          <p className={classes.titleStyle} >ContractFlo</p>
        </div>
        <div className={classes.logoCont} >
          <Button
            onClick={() => {
              update()
            }}
            style={{ marginRight: "10px" }}
          >Save</Button>
          <Button
            onClick={() => {
              addPara()
            }}
            style={{ marginRight: "10px" }}
          >Add Para</Button>
          <Button
            onClick={() => {
              publish()
            }}
            style={{ marginRight: "10px" }}
          >{isPublic ? 'UnPublish' : 'Publish'}</Button>
        </div>
      </div>

      {blog && (<>
        <div className={classes.mainComponentCont} >
          <TitleInput
            title={title}
            placeholder={'Title (required)'}
            setTitle={(title) => {
              setTitle(title);
            }}
          />
          <div className={classes.inputCont} >
            <h4>Category</h4>
            <CategoryAutocomplete
              categories={categories}
              setCategories={setCategories}
            />
          </div>
          <div className={classes.inputCont} >
            <h4>Description</h4>
            <TextField
              id="outlined-multiline-static"
              size={"small"}
              placeholder={"Enter Description"}
              value={desc}
              onChange={(e) => { setDesc(e.target.value) }}
              multiline
              rows={4}
              style={{ width: "100%" }}
              variant="outlined"
            />
          </div>
          <span
            onClick={() => {
              dispatch({ type: "FileUploadReset" });
              setCurrentPera("blogDesc")
            }}
          >
            <FileUploadButton
              parentType="Doc"
              used={false}
              parentId={null}
              IconColor="white"
              iconBig={true}
              aditionalText={"Add file"}
              attachIconStyle={classes.attachIconFont}
              iconWithTextStyle={classes.iconWithTextStyle}
            />
          </span>
          {currentFiles.length > 0 && (
            <div className={classes.fileConts} >
              {currentFiles && currentFiles.map((file) => (
                <div style={{ position: 'relative' }} >
                  <img src={file?.url} />
                  <HighlightOffIcon
                    className={classes.crossIcon}
                    onClick={() => { removeFile(file?._id) }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className={classes.checkCont} >
            <p>Pin up</p>
            <Checkbox
              style={{
                paddingBottom: "0px",
                paddingTop: "0px"
              }}
              color="primary"
              checked={isPinUp}
              onChange={(e) => { changePinUp(e.target.checked) }}
            />
          </div>
          {blog?.paras?.length ? blog.paras.map(doc => {
            return <BlogParaEdit
              doc={doc}
              currentPera={currentPera}
              setCurrentPera={setCurrentPera}
              setLoadingBool={setLoadingBool}
            />
          }) : null}
        </div>
      </>)}

      {loadingBool &&
        <div className={classes.loaderCont} >
          <CircularProgress
            size={60}
            thickness={3}
            style={{ color: 'rgb(92, 144, 242)' }}
          />
        </div>
      }
    </div>
  );
}
