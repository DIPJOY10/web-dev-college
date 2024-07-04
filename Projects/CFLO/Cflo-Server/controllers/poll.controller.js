const Poll = require("../models/poll.model");

const vote = async (req, res) => {
    try {
        const {pollId, option, profile} = req.body;
        console.log(req.body);
        let poll = await Poll.findById(pollId);

        if (option >= poll?.options.length || option < 0) throw new Error("Option of poll is invalid");
        console.log({poll});
        console.log(poll.votes);
        poll.votes.set(profile, option);

        poll = await poll.save();

        res.status(200).json({
            poll,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};

module.exports = {vote};
