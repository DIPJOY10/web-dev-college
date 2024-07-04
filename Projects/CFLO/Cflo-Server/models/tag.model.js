const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const TagSchema = new Schema(
    {
        on: {
            type: Schema.Types.ObjectId,
            required: true,
            // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
            // will look at the `onModel` property to find the right model.
            refPath: 'onModel'
        },
        onModel: {
            type: String,
            required: true,
            enum: ['User','Organization']
        },
    }
)

const Tag = model('Tag', TagSchema);

module.exports = Tag;