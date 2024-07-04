const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const OfferingRelationSchema = new Schema(
  {

    offering: {
      type: Schema.Types.ObjectId,
      ref: 'Offering'
    },

    chartAccount: {
      type: Schema.Types.ObjectId,
      ref: 'ChartAccount'
    },

    doYouOwnIt: {
      type: Boolean,
      default: true
    },

    name: {
      type: String,
      default: ''
    },

    description: {
      type: String,
      default: ''
    },

    model: {
      type: String,
      default: 'Product'
    },

    isInventory: {
      type: Boolean,
      default: false
    },

    taxRate: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      default: 0
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet'
    },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

  },
  {
    timestamps: true
  }
);


const OfferingRelation = model('OfferingRelation', OfferingRelationSchema);

module.exports = OfferingRelation;