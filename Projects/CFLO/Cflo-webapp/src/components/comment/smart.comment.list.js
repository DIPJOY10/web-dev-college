import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Api from "../../helpers/Api";
import ChatMsgSlack from "../chat/ChatMsgSlack";
import { getCommentByIds } from "./comment.utils";
import CommentCreate from "./comment.create";
import CommentUpdate from "./comment.update";
import CommentCard from "./comment.card";
import arrayToReducer from "../../helpers/arrayToReducer";

const useStyles = makeStyles((theme) => ({
	root: (props) => ({
		flex: 1,
		marginBottom: "1rem",
		marginTop: "1rem",
		...(props || {}),
	}),
	marginTop: {
		flex: 1,
		marginTop: "1rem",
	},
}));

const SmartCommentList = (props) => {
	const {
		parent,
		parentModelName,
		limit = -1,
		styleBody,
		sentProfile,
		guestView
	} = props;

	const [editMode, setEditMode] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const classes = useStyles(styleBody);
	const dispatch = useDispatch();

	const [comments, setComments] = useState([]);
	const [commentIds, setCommentIds] = useState([]);
	const [commentDictionary, setCommentDictionary] = useState({});
	useEffect(() => {
		const commentRequestObj = {
			parent,
			model: parentModelName,
		};
		if (limit >= 0) commentRequestObj.limit = limit;

		Api.post("comment/getComments", commentRequestObj).then((cmnts) => {
			setComments(cmnts);
		});
	}, []);

	useEffect(() => {
		const { newDict, idArr } = arrayToReducer(comments);
		setCommentIds(idArr);
		setCommentDictionary(newDict);
	}, [comments?.length]);

	useEffect(() => {}, [commentIds?.length]);

	return (
		<div className={classes.root}>
			{editMode ? (
				<CommentUpdate
					commentId={selectedId}
					setEditMode={setEditMode}
					commentDictionary={commentDictionary}
					setCommentIds={setCommentIds}
					setCommentDictionary={setCommentDictionary}
					sentProfile={sentProfile}
				/>
			) : (
				<CommentCreate
					setCommentIds={setCommentIds}
					setCommentDictionary={setCommentDictionary}
					parent={parent}
					parentModelName={parentModelName}
					sentProfile={sentProfile}
					guestView={guestView}
				/>
			)}
			<div className={classes.marginTop}>
				{commentIds &&
					commentIds?.length > 0 &&
					commentIds.map((commentId) => {
						const comment = commentDictionary[commentId];
						if (comment && comment?._id) {
							return (
								<CommentCard
									key={comment._id}
									commentId={commentId}
									comment={comment}
									setEditMode={setEditMode}
									setSelectedId={setSelectedId}
									setCommentDictionary={setCommentDictionary}
									sentProfile={sentProfile}
								/>
							);
						}
					})}
			</div>
		</div>
	);
};

export default SmartCommentList;
