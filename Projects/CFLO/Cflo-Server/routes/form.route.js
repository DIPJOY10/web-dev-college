

const {
    create: createQuestion,
    createDefaultQuestion,
    update: updateQuestion,
    getQuestions,
    deleteQuestion,
    createOption, updateOption, deleteOption
} = require("../controllers/form.question.controller");


const {
    manageFormRes, update:updateFormRes
} = require("../controllers/form.response.controller")


const {
    create,
    update,
    getFormHelper,
} = require("../controllers/form.controller");

module.exports = app => {
    app.post("/api/question/create", createQuestion);
    app.post("/api/question/create/default", createDefaultQuestion);

    app.post("/api/question/create", createQuestion);

    app.post("/api/question/update", updateQuestion);

    app.post("/api/question/option/create", createOption);
    app.post("/api/question/option/delete", deleteOption);
    app.post("/api/question/option/update", updateOption);



    app.post("/api/question/getQuestions", getQuestions);
    app.post("/api/question/delete", deleteQuestion);

    app.post("/api/form/create", create);
    app.post("/api/form/update", update);
    app.post("/api/form/getFormHelper", getFormHelper);

    app.post("/api/form/manageRes",manageFormRes)
    app.post("/api/form/updateRes",updateFormRes)

};



