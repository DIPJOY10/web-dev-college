import React from "react";
import Picker from "emoji-picker-react";

const EmojiPicker = ({ setTitle, setDescription, focus }) => {
	return (
		<Picker
			pickerStyle={{ width: "100%" }}
			onEmojiClick={(ev, emojiObj) => {
				if (focus === "title") {
					setTitle((prev) => prev + emojiObj.emoji);
					// titleRef.current.focusTextInput();
				} else {
					setDescription((prev) => prev + emojiObj.emoji);
					// descriptionRef.current.focusTextInput();
					// console.log({ descriptionRef });
				}
			}}
		/>
	);
};

export default React.memo(EmojiPicker);
