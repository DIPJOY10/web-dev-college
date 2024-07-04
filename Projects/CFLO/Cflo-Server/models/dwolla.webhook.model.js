const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const dwollaWebhookSchema = new Schema(
  {

    subscriptionPath :{
        type:String
    }

  },
  {
    timestamps: true
  }
);


const DwollaWebhook = model('DwollaWebhook', dwollaWebhookSchema);

module.exports = DwollaWebhook;