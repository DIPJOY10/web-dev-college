import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const useStyles = makeStyles({
	root: {
		marginTop: "0.4rem",
	},

	textStyle: {
		wordWrap: "break-word",
	},
});

export default function TextView(props) {
	const classes = useStyles();
	const { text, minChar, showMoreHidden } = props;
	const showMoreApplicable = text
		? text.length > minChar
			? true
			: false
		: false;
	const fullMinText = text.slice(0, minChar);
	const cutMinText =
		fullMinText.substring(0, fullMinText.lastIndexOf(" ")) +
		(showMoreApplicable ? " ..." : "");
	const [minText, setMinText] = useState(cutMinText);

	const [showText, setShowText] = useState(minText);

	const [showMore, setShowMore] = useState(true);

	return (
		<ReactQuill
			theme="bubble"
			value={text}
			readOnly={true}
			modules={{
				toolbar: false,
			}}
		/>
		// <div className={classes.root}>
		/* {showText.split("\n").map((i, key) => {
				return (
					<Typography
						key={key}
						paragraph
						variant="body1"
						className={classes.textStyle}
					>
						{i}
					</Typography>
				);
			})}

			{showMoreApplicable ? (
				<>
					{showMore ? (
						<Link
							component="button"
							variant="body2"
							onClick={() => {
								setShowMore(false);
								setShowText(text);
							}}
						>
							Show More
						</Link>
					) : (
						<Link
							component="button"
							variant="body2"
							onClick={() => {
								setShowMore(true);
								setShowText(minText);
							}}
						>
							Show Less
						</Link>
					)}
				</>
			) : null} */
		// {text}

		// </div>
	);
}
