const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const OrganizationSchema = new Schema({
    description: {
        type: String,
        default: "",
    },

    email: {
        type: String,
    },

    displayName: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    website: {
        type: String,
        default: "",
    },
    industry: {
        type: String,
        default: "",
    },
    companySize: {
        type: String,
        default: "",
    },
    companyType: {
        type: String,
        default: "",
    },
    tagline: {
        type: String,
        default: "",
    },

    displayPicture: {
        type: Schema.Types.ObjectId,
        ref: "File",
    },
    cover: {
        type: Schema.Types.ObjectId,
        ref: "File",
    },

    projects: [
        {
            title: {type: String, default: ""},
            start_date: {type: String, default: ""},
            end_date: {type: String, default: ""},
            project_url: {type: String, default: ""},
            pictures: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "File",
                },
            ],
            description: {type: String, default: ""},
        },
    ],
    licenses: [
        {
            title: {type: String, default: ""},
            association: {type: String, default: ""},
            start_date: {type: String, default: ""},
            end_date: {type: String, default: ""},
            credentialId: {type: String, default: ""},
            license_url: {type: String, default: ""},
        },
    ],
    honors: [
        {
            title: {type: String, default: ""},
            start_date: {type: String, default: ""},
            issuer: {type: String, default: ""},
            description: {type: String, default: ""},
        },
    ],

    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
    },

    emails: [
        {
            type: String,
        },
    ],

    phones: [
        {
            type: String,
        },
    ],

    phone: {
        type: String,
    },

    companyNo: {
        type: String,
        default: "",
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },

    team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },

    model: {
        type: String,
        default: "Organization",
    },

    stripeCustomer: {
        type: Schema.Types.ObjectId,
        ref: "StripeCustomer",
    },

    address: {
        line1: {type: String, default: ""},
        postal_code: {type: String, default: ""},
        city: {type: String, default: ""},
        state: {type: String, default: ""},
        country: {type: String, default: ""},

        streetAddress: { type: String, default: "" },
        zip: { type: String, default: "" },
        region: { type: String, default: "" },
    },
});

const Organization = model("Organization", OrganizationSchema);

module.exports = Organization;
