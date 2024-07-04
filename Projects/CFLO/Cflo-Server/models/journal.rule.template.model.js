const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const JournalRuleTemplateSchema = new Schema(
    {        

        type:{
            type:String,
            default:'Invoice'
        },

        steps:[{


   

            accountDebit:{
                type: Boolean,
                default: false
            },

            accountType:{
                type:String
            },


            accountNextType:{ 
                type: String
            }
            
        }],

    },
    {
      timestamps: true
    }
);

const JournalRuleTemplate = model('JournalRuleTemplate', JournalRuleTemplateSchema);

module.exports = JournalRuleTemplate;