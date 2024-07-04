const axios = require("axios");
var buffer = require("buffer/").Buffer;
const fs = require("fs");
const docusign = require("docusign-esign");
const Doc = require("../models/doc.model");
const keys = require("../keys/keys");
const getAuthdata = (req, res) => {
    try {
        const authToken = req.body.codeFromUrl;
        const integrationKey = keys.DOCUSIGN_INTEGRATION_KEY;
        const secretKeyFromDocuSign = keys.DOCUSIGN_SECRET_KEY;
        const secretKeyFromDocuSignBase64 = buffer
            .from(integrationKey + ":" + secretKeyFromDocuSign)
            .toString("base64");
        const headerString = `Basic ${secretKeyFromDocuSignBase64}`;
        const params = new URLSearchParams();
        params.append("code", authToken);
        params.append("grant_type", "authorization_code");
        const url = keys.DOCUSIGN_BASE_SIGNIN_URI + "/token";
        axios
            .post(url, params, {headers: {Authorization: headerString}})
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(500).send(err);
    }
};

const sendMail = (req, res) => {
    try {
        const apiVersion = keys.DOCUSIGN_API_VERSION;
        const accountId = req.body.accountId;
        const baseUrlToSendMail = keys.DOCUSIGN_BASE_URI;
        // const baseUrlToSendMail = "https://demo.docusign.net/restapi/";
        const mailUrl = baseUrlToSendMail + apiVersion + "/accounts/" + accountId + "/envelopes";
        var accessToken = req.body.accessToken;
        const headerString = `Bearer ${accessToken}`;
        const documentBase64 = req.body.documentBase64;
        const documentId = req.body.documentId;
        const user1_email = req.body.user1_email;
        const user1_name = req.body.user1_name;
        const recipientId = req.body.recipientId;
        const payload = {
            documents: [
                {
                    documentBase64: documentBase64,
                    documentId: documentId,
                    fileExtension: "pdf",
                    name: "document",
                },
            ],
            emailSubject: "Simple Signing Example",
            recipients: {
                signers: [
                    {
                        email: user1_email,
                        name: user1_name,
                        recipientId: recipientId,
                    },
                ],
            },
            status: "sent",
        };
        axios
            .post(mailUrl, payload, {headers: {Authorization: headerString, "Content-Type": "application/json"}})
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(500).send(err);
    }
};

const getUserData = (req, res) => {
    try {
        var accessToken = req.body.accessToken;
        const headerString = `Bearer ${accessToken}`;
        const url = keys.DOCUSIGN_BASE_SIGNIN_URI + "/userinfo";
        axios
            .get(url, {headers: {Authorization: headerString}})
            .then(resp => {
                res.send(resp.data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(500).send(err);
    }
};

function makeSenderViewRequest(args) {
    let viewRequest = new docusign.ReturnUrlRequest();
    // Data for this method
    // args.dsReturnUrl

    // Set the url where you want the recipient to go once they are done signing
    // should typically be a callback route somewhere in your app.
    viewRequest.returnUrl = args.dsReturnUrl;
    return viewRequest;
}

function makeEnvelope(
    documentBase64,
    documentId,
    signerName,
    signerEmail,
    signerId,
    ccEmail,
    ccName,
    ccId,
    docName,
    signersArray
) {
    let env = new docusign.EnvelopeDefinition();
    env.emailSubject = `ContractFlo: Please sign the document sent to ${signerName} `;

    let doc1 = new docusign.Document();
    doc1.documentBase64 = documentBase64;
    doc1.name = docName; // can be different from actual file name
    doc1.fileExtension = "txt"; // Source data format. Signed docs are always pdf.
    doc1.documentId = documentId; // a label used to reference the doc

    env.documents = [doc1];

    let signer1 = docusign.Signer.constructFromObject({
        email: signerEmail,
        name: signerName,
        recipientId: signerId,
        routingOrder: "1",
    });
    let signersList = signersArray.map((signer, idx) =>
        docusign.Signer.constructFromObject({
            email: signer.mail,
            name: signer.name,
            recipientId: signer.id,
            routingOrder: idx + 1,
        })
    );
    // create a cc recipient to receive a copy of the documents, identified by name and email
    // We're setting the parameters  via setters
    let cc1 = new docusign.CarbonCopy();
    (cc1.email = ccEmail), (cc1.name = ccName), (cc1.routingOrder = ccId), (cc1.recipientId = "2");

    // Add the recipients to the envelope object
    let recipients = docusign.Recipients.constructFromObject({
        // signers: [signer1],
        signers: signersList,
        carbonCopies: [cc1],
    });
    env.recipients = recipients;
    env.status = "created";
    return env;
}
const uploadEnvelope = async (req, res) => {
    try {
        let {
            accessToken,
            documentBase64,
            signerName,
            signerEmail,
            signerId,
            ccEmail,
            ccName,
            ccId,
            docName,
            documentId,
            signersArray,
        } = req.body;
        let dsApiClient = new docusign.ApiClient();
        let envelopeArgs = {};
        let accountId = keys.DOCUSIGN_ACCOUNT_ID;
        // for production environment update to 'www.docusign.net/restapi'
        var basePath = keys.DOCUSIGN_BASE_URI;

        dsApiClient.setBasePath(basePath); //basepath we will give basepath as localhost:3000
        dsApiClient.addDefaultHeader("Authorization", "Bearer " + accessToken); //  provide our accessToken from the state

        let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

        let envelope = makeEnvelope(
            documentBase64,
            documentId,
            signerName,
            signerEmail,
            signerId,
            ccEmail,
            ccName,
            ccId,
            docName,
            signersArray
        ); //args.envelopeArgs

        let results = await envelopesApi.createEnvelope(accountId, {
            envelopeDefinition: envelope,
        });

        let envelopeId = results.envelopeId;

        // Step 2. create the sender view
        let dsReturnUrl = keys.DOCUSIGN_RETURN_URL;
        let viewRequest = makeSenderViewRequest(dsReturnUrl);
        // Call the CreateSenderView API
        // Exceptions will be caught by the calling function
        results = await envelopesApi.createSenderView(accountId, envelopeId, {
            returnUrlRequest: viewRequest,
        });

        // Switch to Recipient and Documents view if requested by the user
        let url = results.url;
        let startingView = "recipient";
        if (startingView === "recipient") {
            url = url.replace("send=1", "send=0");
        }
        res.status(200).send({status: "sent", envelopeId: envelopeId, redirectUrl: url});
    } catch (err) {
        console.log("err envelope", err);
        res.status(500).send(err);
    }
};
const getEnvelopeStatus = (req, res) => {
    try {
        var accessToken = req.body.accessToken;
        var envelopeId = req.body.envelopeId;
        var docId = req.body.docId;
        const headerString = `Bearer ${accessToken}`;
        const baseURI = keys.DOCUSIGN_BASE_URI;
        const apiVersion = keys.DOCUSIGN_API_VERSION;
        const accountId = keys.DOCUSIGN_ACCOUNT_ID;

        axios
            .get(`${baseURI}${apiVersion}/accounts/${accountId}/envelopes/${envelopeId}`, {
                headers: {Authorization: headerString},
            })
            .then(async resp => {
                const respStatus = resp.data.status;
                let doc = await Doc.findOneAndUpdate({_id: docId}, {$set: {"signTracker.status": respStatus}});
                res.status(200).send(resp.data);
            })
            .catch(err => {
                console.log("Error occuerd in getting status", err);
                res.status(500).send(err);
            });
    } catch (err) {
        res.status(500).send(err);
    }
};
module.exports = {
    getAuthdata,
    sendMail,
    getUserData,
    uploadEnvelope,
    getEnvelopeStatus,
};
