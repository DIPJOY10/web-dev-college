const mongoose = require("mongoose");

const {Schema, model} = mongoose;

/**
 * Rental Relation are connecting the RentalUnit to the
 * Tenant
 */

const RentalRelationSchema = new Schema(
    {
        tenantPassword: {
            type: String,
            default: "",
        },

        monthlyBills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TxTemplate",
            },
        ],
        rent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TxTemplate",
        },
        oneTimeBills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TxTemplate",
            },
        ],

        tenantFullInfo: {
            contactInfo: {
                firstName: {
                    type: String,
                    default: "",
                },
                lastName: {
                    type: String,
                    default: "",
                },
                phoneNumber: {
                    type: String,
                    default: "",
                },
                email: {
                    type: String,
                    default: "",
                },
                address: {
                    line1: {
                        type: String,
                        default: "",
                    },
                    line2: {
                        type: String,
                        default: "",
                    },
                    city: {
                        type: String,
                        default: "",
                    },
                    state: {
                        type: String,
                        default: "",
                    },
                    zip: {
                        type: String,
                        default: "",
                    },
                    country: {
                        type: String,
                        default: "",
                    },
                },
                personalInfo: {
                    dob: {
                        type: Date,
                        default: "",
                    },
                    taxpayerID: {
                        type: String,
                        default: "",
                    },
                    comments: {
                        type: String,
                        default: "",
                    },
                },
                emergencyContact: {
                    contactName: {
                        type: String,
                        default: "",
                    },
                    relation: {
                        type: String,
                        default: "",
                    },
                    email: {
                        type: String,
                        default: "",
                    },
                    phone: {
                        type: Schema.Types.Number,
                        default: "",
                    },
                },
            },
        },

        currency: {
            type: String,
            default: "usd",
        },

        // rentGenerator: {
        //     type: Schema.Types.ObjectId,
        //     ref: "TxTemplate",
        // },

        unit: {
            type: Schema.Types.ObjectId,
            ref: "RentalUnit",
        },

        tenant: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        // isTenantAdded: {
        //
        //     type: Boolean,
        //     default: false,
        // },

        leaseStarted: {
            type: Date,
            default: Date.now,
        },

        leaseEnd: {
            type: Date,
            default: Date.now,
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        projectTeam: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        // appNetwork: {
        //
        //     //Ignore
        //     type: Schema.Types.ObjectId,
        //     ref: "BrandAppNetwork",
        // },

        rentalReq: {
            //Ignore
            type: Schema.Types.ObjectId,
            ref: "RentalRequest",
        },

        conversation: {
            //Need to handle
            type: Schema.Types.ObjectId,
            ref: "Conversation",
        },

        template: {
            //Need to handle
            type: Schema.Types.ObjectId,
            ref: "IssueTemplate",
        },

        rentalPolicy: {
            //Need to handle
            type: Schema.Types.ObjectId,
            ref: "RentalPolicy",
        },

        docFolderProfile: {
            //Need to handle
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const RentalRelation = model("RentalRelation", RentalRelationSchema);

module.exports = RentalRelation;
