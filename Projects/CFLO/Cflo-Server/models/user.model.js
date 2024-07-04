const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const userSchema = new Schema(
    {
        location: {
            type: {
                type: "String",
                // default: "Point",
                enum: ["Point"],
            },
            coordinates: [Number], //[longitude, latitude]
            cityName: String,
            countryName: String,
            stateName: String,
            zipCode: Number,
        },
        latitude: {type: String, default: ""},
        longitude: {type: String, default: ""},
        zip: {type: String, default: ""},
        description: {
            type: String,
            default: "",
        },
        about: {
            type: String,
            default: "",
        },
        education: [
            {
                school: {type: String, default: ""},
                degree: {type: String, default: ""},
                field: {type: String, default: ""},
                start_date: {type: String, default: ""},
                end_date: {type: String, default: ""},
                grade: {type: String, default: ""},
                description: {type: String, default: ""},
            },
        ],
        experience: [
            {
                title: {type: String, default: ""},
                employmentType: {type: String, default: ""},
                companyName: {type: String, default: ""},
                location: {type: String, default: ""},
                start_date: {type: String, default: ""},
                end_date: {type: String, default: ""},
                description: {type: String, default: ""},
                orgTitle: {type: String, default: ""},
                position: {type: String, default: ""},
                associated: {type: String, default: ""},
                start_date_org: {type: String, default: ""},
                end_date_org: {type: String, default: ""},
                description_org: {type: String, default: ""},
            },
        ],

        skillSet: [
            {
                skillTag: {type: Schema.Types.ObjectId, default: ""},
            },
        ],
        projects: [
            {
                title: {type: String, default: ""},
                start_date: {type: String, default: ""},
                end_date: {type: String, default: ""},
                associated: {type: String, default: ""},
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
        languages: [
            {
                name: {type: String, default: ""},
                proficiency: {type: String, default: ""},
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
                title_honor: {type: String, default: ""},
                associated_honor: {type: String, default: ""},
                start_date_honor: {type: String, default: ""},
                issuer: {type: String, default: ""},
                description: {type: String, default: ""},
            },
        ],

        profileCompleted: {
            type: Boolean,
            default: false,
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        email: {
            type: String,
        },

        phone: {
            type: String,
        },

        companyNo: {
            type: String,
            default: "",
        },

        locationCountry: {
            type: String,
        },
        locationCity: {
            type: String,
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

        model: {
            type: String,
            default: "User",
        },

        displayName: {
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

        firebaseUid: {
            type: String,
            required: true,
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        // skills: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Category",
        //     },
        // ],

        skills: [
            {
                type: String,
            },
        ],

        address: {
            line1: {type: String, default: ""},
            postal_code: {type: String, default: ""},
            city: {type: String, default: ""},
            state: {type: String, default: ""},
            country: {type: String, default: ""},

            streetAddress: {type: String, default: ""},
            zip: {type: String, default: ""},
            region: {type: String, default: ""},
        },
        timeDiff: {
            //In minutes
            type: Number,
            default: 0,
        },
        timeZone: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({location: "2dsphere"});

const User = model("User", userSchema);

module.exports = User;
