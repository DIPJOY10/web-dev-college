module.exports = app => {
    require("./auth.route")(app);
    require("./activity.route")(app);
    require("./apply.route")(app);

    require("./blog.route")(app);
    require("./brand.app.route")(app);
    require('./language.route')(app)
    require("./calendar.event.route")(app);
    require("./category.route")(app);
    require("./chat.route")(app);
    require("./checkout.route")(app);
    require("./skills.route")(app);
    require("./comment.route")(app);
    require("./coupon.route")(app);
    require("./community.route")(app);

    require("./dashboard.route")(app);
    require("./discussion.route")(app);
    require("./doc.route")(app);
    require("./doc.sign.route")(app);
    require("./dwolla.route")(app);
    require("./feed.route")(app);

    require("./file.route")(app);
    require("./follow.route")(app);
    require("./form.route")(app);
    require("./investment.route")(app);
    require("./invite.route")(app);
    require("./issue.route")(app);

    require("./job.route")(app);
    require("./join.route")(app);

    require("./like.route")(app);

    require("./notification.route")(app);

    require("./organization.route")(app);
    require("./pal.route")(app);
    require("./participant.route")(app);
    require("./pipeline.route")(app);
    require("./plaid.route")(app);
    require("./poll.route")(app);
    require("./post.route")(app);
    require("./profile.route")(app);
    require("./project.route")(app);
    require("./property.manage.route")(app);
    require("./roleMap.route")(app);
    require("./report.route")(app);
    require("./reportItem.route")(app);
    require("./save.route")(app);
    require("./schedule.route")(app);
    require("./scheduler.route")(app);
    require("./search.route")(app);
    require("./shared.route")(app);

    require("./stripe.route")(app);

    require("./task.route")(app);
    require("./team.route")(app);
    require("./transaction.route")(app);
    require("./txTemplate.route")(app);
    require("./user.route")(app);
    require("./wallet.route")(app);
    require("./product.route")(app);
    require("./discountOrTax.route")(app);
    require("./access.role.route")(app);
    require("./portfolio.route")(app);
};
