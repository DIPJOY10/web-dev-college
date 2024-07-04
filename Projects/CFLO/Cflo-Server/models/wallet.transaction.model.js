const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const TransactionSchema = new Schema(
    {
        invNo: {
            type: Number,
        },
        billNo: {
            type: Number,
        },
        status: {
            //"Partially Paid" is not in use currently
            //Submit state is not added currently
            type: String,
            default: "Draft",
            enum: ["Draft", "Submitted", "Sent", "Opened", "Partially Paid", "Processing", "Failed", "Paid"],
        },
        BankChartAccount: {
            type: Schema.Types.ObjectId,
            ref: "ChartAccount",
        },
        type: {
            type: String,
        },
        isOneTimeBill: {
            type: Boolean,
            default: false,
        },
        deleteStatus: {
            type: Boolean,
            default: false,
        },
        processed: {
            type: Boolean,
            default: false,
        },
        templateId: {
            type: Schema.Types.ObjectId,
            ref: "TxTemplate",
        },
        memo: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        amount: {
            //before tax
            type: Number,
        },
        finalAmount: {
            //after tax and all
            type: Number,
        },
        amountPaid: {
            //include 3rd party charges
            type: Number,
        },
        currency: {
            type: String,
            default: "usd",
        },
        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],
        dueDate: {
            type: Date,
            default: Date.now,
        },
        invoiceDate: {
            type: Date,
            default: Date.now,
        },
        lateFeeApplicable: {
            type: Boolean,
            default: false,
        },
        lateFeeAmount: {
            type: Number,
            default: 0,
        },
        lateFeeDate: {
            type: Date,
            default: Date.now,
        },
        term: {
            type: Schema.Types.ObjectId,
            ref: "Term",
        },
        billList: {
            type: Schema.Types.ObjectId,
            ref: "BillList",
        },
        firstPartyWallet: {
            //Person creating the transaction
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },
        firstParty: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
        secondPartyWallet: {
            //Recipent (Person for whom transaction has been created)
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },
        secondParty: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
        wallets: [
            {
                type: Schema.Types.ObjectId,
                ref: "Wallet",
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        parent: {
            type: Schema.Types.ObjectId,
            refPath: "parentModelName",
        },
        parentModelName: {
            type: String,
        },
        data: {
            type: Schema.Types.ObjectId,
            refPath: "dataModel",
        },
        dataModel: {
            type: String,
        },
        attachedFiles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Doc",
            },
        ],
        //All payment related Datas------------------------------------------------------------
        dwollaBankAccount: {
            type: Schema.Types.ObjectId,
            ref: "DwollaBankAccount",
        },
        //this is a array to store avaliable payment methods
        providers: [
            {
                type: String,
                enum: ["DwollaACH", "StripeCard"],
            },
        ],
        //receiver's dwolla account which receive payment
        dwollaConfig: {
            receiverDwollaBankAcc: {
                type: String,
            },
        },
        //receiver's stripe account which receive payment
        stripeConfig: {
            receiverStripeAcc: {
                type: String,
            },
        },
        //is the payment happened with Cash or Cheque
        paymentBy: {
            type: String,
            default: "online",
        },
        paymentByDetails: {
            type: String,
            default: "",
        },
        //to store for which reason the payment is done like "Payment to Platform" or "Payment to Other User"
        paymentType: {
            type: String,
            enum: ["Platform", "Marketplace"],
        },
        //with which payment gateway the payment is done like "Stripe" or "Dwolla" or
        paymentProvider: {
            type: String,
            enum: ["Dwolla", "Stripe"],
        },
        //is the payment happened with bank account (stripe ACH Or Dwolla ACH)
        achBankPaymentAccount: {
            type: Boolean,
            default: false,
        },
        //If the payment happened with dwolla then it store the dwolla payment Tx Id
        dwollaTxId: {
            type: String,
        },
        //we have to create payment intent to pay through stripe
        stripePaymentIntent: {
            intentId: {
                type: String,
            },

            clientSecret: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = model("Transaction", TransactionSchema);

module.exports = Transaction;
