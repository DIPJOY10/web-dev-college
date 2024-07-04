import React, { useState, useEffect } from "react";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Button, IconButton, Tooltip } from "@material-ui/core";

function AssignBtn(props) {
	const { open, setOpen } = props;

	return (
		<Tooltip title="Assign Issue">
			<Button
				startIcon={<PersonAddIcon />}
				variant="contained"
				color="primary"
				onClick={() => {
					setOpen(true);
				}}
			>
				Assign
			</Button>
		</Tooltip>
	);
}

export default AssignBtn;
