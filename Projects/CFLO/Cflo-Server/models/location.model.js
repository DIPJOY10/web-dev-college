const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
});

const LocationSchema = new Schema(
    {   
 
        name: String,
        location: {
          type: pointSchema,
          index: '2dsphere' // Create a special 2dsphere index on `City.location`
        }
        
    }
);

const Location = model('Location', LocationSchema);

module.exports = Location;
