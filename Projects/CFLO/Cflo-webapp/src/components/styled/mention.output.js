import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import mentionTextProcessor from "./mentionTextProcessor";

const useStyles = makeStyles((theme) => ({
	root: (props) => {
		const styles = props ? props.root : {};

		return {
			...styles,
		};
	},
	link: (props) => {
		const styles = props ? props.link : {};

		return {
			textDecoration: "none",
			...styles,
		};
	},
}));

function MentionOutput({ text = "", styleBody }) {
	const classes = useStyles(styleBody);
	// console.log("classes = ", classes);

	const [textArray, setTextArray] = useState([]);
	useEffect(() => {
		// const arr = text.split("|--|");

		// const newArr = arr.map((el) => {
		//   if (el.startsWith("@") && el.includes("||")) {
		//     let [id = "", name = ""] = el.split("||");
		//     id = id?.slice(1, id.length);
		//     name = name?.slice(0, name.length);
		//     return {
		//       type: "mention",
		//       id,
		//       name: "@" + name,
		//     };
		//   }
		//   return {
		//     type: "text",
		//     text: el,
		//   };
		// });
		// console.log("processedTxt", mentionTextProcessor(text));
		setTextArray(mentionTextProcessor(text));
	}, [text]);

	return (
		<div className={classes.root}>
			<Typography variant="body">
				{textArray.map((el) => {
					if (el.type === "text") return el.text;
					return (
						<Link
							className={classes.link}
							to={`/profile/view/${el.id}`}
						>
							{el.name}
						</Link>
					);
				})}
			</Typography>
		</div>
	);
}

export default MentionOutput;
