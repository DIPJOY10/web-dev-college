const {
    createPortfolio,
    updatePortfolio,
    findPortfolioByProfile,
    getPortfolioById,
    getRentRoll,
} = require("../controllers/portfolio.controller");

module.exports = app => {
    app.post("/api/property/portfolio/create", createPortfolio);
    app.post("/api/property/portfolio/update", updatePortfolio);
    app.post("/api/property/portfolio/find/byprofile", findPortfolioByProfile);
    app.post("/api/property/get/portfolio/byid", getPortfolioById);
    app.post("/api/property/get/portfolio/rent-roll", getRentRoll);
};
