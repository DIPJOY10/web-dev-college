import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import EditBtn from "../styled/actionBtns/edit.btn";
import moment from "moment";
import _ from "lodash";
import AvatarLocal from "../profile/avatar";
import { Box, Grid } from "@material-ui/core";
import docImage from "../../Assets/FileIcon/docs.png";
import * as h2p from "html2plaintext";
import { AvatarGroup } from "@material-ui/lab";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import Api from "../../helpers/Api";
const useStyles = makeStyles((theme) => ({
  // root: {
  // 	flex: 1,
  // 	display: "flex",
  // 	flexDirection: "row",
  // 	cursor: "pointer",
  // },
  // row: {
  // 	flex: 1,
  // 	display: "flex",
  // 	flexDirection: "row",
  // },

  // topRow: {
  // 	display: "flex",
  // 	flexDirection: "row",
  // 	padding: "0.3rem",
  // },
  // nameText: {
  // 	flex: 1,
  // },

  dP: {
    height: "1.2rem",
    width: "1.2rem",
    marginRight: "5px",
    borderRadius: "50%",
  },
  // card: {
  // 	margin: 16,
  // 	width: 'calc(100% - 16)',
  // 	minHeight: '10vh',
  // 	display: "flex",
  // 	flexDirection: "row",
  // 	justifyContent: "space-between",
  // },
  // container:{
  // 	display: "flex",
  // 	flexDirection: "row",

  // },
  // content:{

  // },

  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  root: {
    flex: 1,
    display: "flex",
    width: "75%",
    // minHeight: '23vh',
    margin: "2vh 0",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    // border: '1px solid red',
    // padding: '1rem',
    // paddingBottom: '0.2rem',
  },
  root_Container: {
    width: "100%",
    // minHeight: '100%',
    // border: '1px solid black',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: 'center',
  },
  parent_Container: {
    width: "100%",
    // minHeight: '80%',
    // border: '1px solid green',
    padding: "2vh 1vw",
    [theme.breakpoints.down("xs")]: {
      padding: "2vh 2vw",
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    position: "relative",
    // border: '1px solid red',

    // alignItems: 'flex-start'
    alignItems: "center",
  },
  img: {
    height: "40px",
    width: "40px",
    // borderRadius: '20px',
    marginRight: "10px",
  },
  title: {
    display: "flex",
    flexDirection: "column",
  },
  details: {
    // border: '1px solid blue',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "2vh 3.3vw 0 3.3vw",
  },
  experience: {
    display: "flex",
    flexDirection: "column",
  },
  payType: {
    display: "flex",
    flexDirection: "column",
  },
  salary: {
    display: "flex",
    flexDirection: "column",
  },
  skills: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // border: '1px solid red',
    // width: '80%',
    margin: "1vh 3.3vw 0 3vw",
    // [theme.breakpoints.down('xs')]: {
    //   flexDirection: 'column'
    // }
    // marginTop: '1vh'
  },
  published: {
    width: "100%",
    backgroundColor: "#f2f2f0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1vh 1vw",
    [theme.breakpoints.down("xs")]: {
      padding: ".5vh 2vw",
    },
  },
  applicationpayType: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    // border: '1px solid red',
    margin: "0 0 2vh 0",
  },
  applicationcomment: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    // border: '1px solid red',
    margin: "0 0 2vh 0",
  },
  applicationfiles: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    // border: '1px solid red',
    // margin: '0 0 2vh 0'
  },
  // svgSize: {
  //   display: 'flex',
  //   height: '40px',
  //   width: '40px',
  //   borderRadius: '20px',
  //   marginRight: '10px',
  // },

  // mapSize: {
  //   display: 'flex',
  //   height: '30px',
  //   width: '30px',
  //   marginTop: '10px',
  // },

  // title: {
  //   fontSize: 14,
  //   marginLeft: 15,
  // },

  // reviewChip: {
  //   height: '1.2rem',
  //   padding: 0,
  //   marginLeft: '0.3rem',
  // },

  // catChip: {
  //   backgroundColor: theme.palette.primary.light,
  //   height: '1.2rem',
  //   padding: 0,
  //   marginLeft: '0.3rem',
  //   color: 'white',
  // },

  // rowDiv: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },

  // locDiv: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '10rem',
  //   maxWidth: '10rem',

  //   [theme.breakpoints.down('xs')]: {
  //     flexDirection: 'column',
  //     width: '8rem',
  //     maxWidth: '8rem',
  //   },
  // },

  // colDiv: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
}));

export default function DocCard(props) {
  const { doc, onSelect, envelopeId, isEnvelope } = props;
  const docSignState = useSelector((state) => state.docSign);
  const accessToken = docSignState.accessToken;
  const [docSignStatus, setDocSignStatus] = useState("Waiting..");
  const dispatch = useDispatch();
  console.log(doc);
  console.log(accessToken, " is the doc");
  const history = useHistory();
  const classes = useStyles();
  const getEnvelopeStatus = (envId, id) => {
    const payload = { accessToken: accessToken, envelopeId: envId, docId: id };
    if (envId != "" && envId != undefined && !!accessToken) {
      console.log("Payload is ", payload);
      Api.post("doc/sign/envelopedata", payload)
        .then((res) => {
          setDocSignStatus(res.status);
        })
        .catch((err) => {
          console.log(err);
          setDocSignStatus("Request Failure");
        });
    }
  };
  useEffect(() => {
    getEnvelopeStatus(envelopeId, doc._id);
    // const statusRequestTimeout = setTimeout(getEnvelopeStatus, 5000);
  }, []);
  if (doc) {
    const user = doc?.user;
    const displayName = user?.displayName;
    const displayPicture = user?.displayPicture?.thumbUrl;
    console.log(_.slice(doc?.shared, 1, doc?.shared.length));
    return (
      // <Card
      // 	className={classes.card}
      // 	onClick={() => {
      // 		dispatch({
      // 			type: "AddDoc",
      // 			payload: {
      // 				tempDoc: doc,
      // 			},
      // 		});
      // 		var path = "/doc/view/" + doc?._id;
      // 		history.push(path);
      // 	}}
      // >
      // 	<CardActionArea>
      // 		{/* <CardMedia
      // 			component="img"
      // 			alt="Doc Icon"
      // 			//   height=""
      // 			//   width={"40%"}
      // 			image={docImage}
      // 			title="Doc Icon"
      // 			sx={{ p: 3 }}
      // 		/> */}
      // 		<CardContent>
      // 			<div
      // 				style={{
      // 					padding: "0.4rem",
      // 					// backgroundColor: "#F9F9F9",
      // 					marginBottom: "1rem",
      // 				}}
      // 			>
      // 				<Typography
      // 					style={{
      // 						display: "flex",
      // 						alignItems: "center",
      // 					}}
      // 				>
      // 					<AvatarLocal
      // 						alt={displayName}
      // 						src={user}
      // 						className={classes.dP}
      // 					/>
      // 					{displayName}
      // 				</Typography>
      // 			</div>
      // 			<Typography
      // 				gutterBottom
      // 				variant="h6"
      // 				component="h4"
      // 			>
      // 				{<b>{(doc?.title).slice(0, 40)}</b>}
      // 			</Typography>
      // 			<Typography
      // 				variant="body2"
      // 				color="textSecondary"
      // 				component="p"
      // 			>
      // 				{h2p(doc?.description).slice(0, 40)}
      // 			</Typography>
      // 		</CardContent>
      // 	</CardActionArea>
      // </Card>

      // <Paper
      // 	className={classes.card}
      // 	onClick={() => {
      // 		dispatch({
      // 			type: "AddDoc",
      // 			payload: {
      // 				tempDoc: doc,
      // 			},
      // 		});
      // 		var path = "/doc/view/" + doc?._id;
      // 		history.push(path);
      // 	}}
      // >
      // 	<div className={classes.container}>
      // 		<img src={docImage} style={{ width: '12%', height: '45%' }} />
      // 		<div className={classes.content}>
      //             <Typography variant="h6">
      // 				{(doc?.title).slice(0, 40)}
      // 			</Typography>
      // 		</div>
      // 	</div>
      // </Paper>

      <Paper className={classes.root} square>
        <div className={classes.root_Container}>
          <div
            className={classes.parent_Container}
            onClick={() => {
              dispatch({
                type: "AddDoc",
                payload: {
                  tempDoc: doc,
                },
              });
              var path = "/doc/view/" + doc?._id;
              history.push(path);
            }}
          >
            {/* <h1>Parent Container</h1> */}
            <div className={classes.titleContainer}>
              <img key={"job"} className={classes.img} src={docImage} />
              <div className={classes.title}>
                <Typography variant="h6">
                  {(doc?.title.length > 18
                    ? `${(doc?.title).slice(0, 18)}...`
                    : doc?.title) || "Untitled"}
                  {isEnvelope ? (
                    <Typography variant="caption">
                      ` ({docSignStatus})`{" "}
                    </Typography>
                  ) : null}
                </Typography>
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AvatarLocal
                    alt={displayName}
                    src={user}
                    className={classes.dP}
                  />
                  {displayName}{" "}
                </Typography>
              </div>
              {doc?.shared.length > 1 ? (
                <div style={{ position: "absolute", right: 0 }}>
                  <AvatarGroup max={1}>
                    {doc?.shared?.map((item) => {
                      if (item?.parent?.displayName) {
                        return (
                          <Avatar
                            key={item._id}
                            className={classes.purple}
                            alt={item?.parent?.displayName}
                            src={item?.parent?.displayPicture?.thumbUrl}
                          />
                        );
                      } else return null;
                    })}
                  </AvatarGroup>
                </div>
              ) : null}
            </div>
          </div>
          <div className={classes.published}>
            <div>
              <Typography variant="caption">
                Last Modified on {moment(doc?.updatedAt).format("DD MMM YYYY")}{" "}
                by{" "}
                <b>
                  {doc?.activeUserProfile
                    ? doc?.activeUserProfile?.parent?.displayName
                    : displayName}
                </b>
              </Typography>
            </div>
          </div>
        </div>
      </Paper>
    );
  } else {
    return null;
  }
}
