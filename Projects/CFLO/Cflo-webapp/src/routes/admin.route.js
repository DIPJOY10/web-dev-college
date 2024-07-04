import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import AdminRoute from "../components/PrivateRoute/AdminRoute";

import BankingSetup from "../components/finance/bank/banking.setup";
import PaymentSetup from "../components/finance/payment/payment.networks.page";

import Bank from "../components/finance/bank/index";
import Statement from "../components/finance/reports/index";
import Network from "../components/finance/network/Network";
import Offering from "../components/finance/offering/index";
//import SalesAndInvoices from '../components/finance/sales/index';
import Expenses from "../components/finance/expenses/index";

import NewChartAccount from "../components/finance/chartaccount/chartActivity";
import NewJournal from "../components/finance/entries/journal";
import invoiceEdit from "../components/finance/invoice/invoice.edit";
import NewFinance from "../components/finance/new";
import StripeConnectHandle from "../components/finance/stripe/stripe.connect.handle";
import HandlePlaidAuth from "../components/finance/plaid/handle.auth";
import Transactions from "../components/finance/transaction/transactions";
import TxEdit from "../components/finance/transaction/transaction.edit";

// import UserProfile from "../components/account/user.profile";
// import OrgProfile from "../components/account/org.profile";
// import PropertyProfile from "../components/account/property.profile";
// import ProjectRental from "../components/ProjectAnalysis/project.rental.manage";
import TeamAppPanel from "../components/brandApp/teamAppPanel";

// import ApiCheck from "../components/apiDoc/ApiCheck";
import SaleAndInvoices from "../components/finance/invoice/index.js";
import TxTemplateEdit from "../components/finance/generator/template.edit";
import ShowFullTxs from "../components/finance/network/ShowFullTxs";
import RelationAnalysis from "../components/finance/network/Relation.Analysis";
import CreateJournalEntry from "../components/finance/journalEntry/CreateJournalEntry";

const Routes = () => {
  return [
    <AdminRoute
      exact
      path="/admin/:walletId/app_management"
      component={TeamAppPanel}
    />,

    <AdminRoute exact path="/admin/new" component={NewFinance} />,
    <AdminRoute
      exact
      path="/admin/:walletId/banking_setup"
      component={BankingSetup}
    />,
    <AdminRoute
      exact
      path="/admin/:walletId/payment_setup"
      component={PaymentSetup}
    />,
    <AdminRoute exact path="/admin/:walletId" component={Bank} />,
    <AdminRoute
      exact
      path="/admin/:walletId/transactions"
      component={Transactions}
    />,
    <AdminRoute exact path="/admin/:walletId/accounts" component={Bank} />,
    <AdminRoute
      exact
      path="/admin/:walletId/statements"
      component={Statement}
    />,
    <AdminRoute
      exact
      path="/admin/:walletId/network/:option"
      component={Network}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/journalentry/:journalId/edit"
      component={CreateJournalEntry}
    />,

    <AdminRoute exact path="/admin/:walletId/offering" component={Offering} />,

    <AdminRoute
      exact
      path="/admin/:walletId/related/tx/:secondPartyWallet/:option"
      component={ShowFullTxs}
    />,
    <AdminRoute
      exact
      path="/admin/:walletId/relation/analysis/:secondPartyWallet/:option"
      component={RelationAnalysis}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/salesAndInvoices"
      component={SaleAndInvoices}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/expenseAndBills"
      component={Expenses}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/chartOfAccounts"
      component={Bank}
    />,
    <AdminRoute exact path="/admin/:walletId/journal" component={Bank} />,
    <AdminRoute
      exact
      path="/admin/:walletId/new/chartaccount"
      component={NewChartAccount}
    />,
    <AdminRoute
      exact
      path="/admin/:walletId/new/journal"
      component={NewJournal}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/new/invoice"
      component={invoiceEdit}
    />,
    <AdminRoute
      exact
      path="/admin/:walletId/:invoiceId/invoice/"
      component={invoiceEdit}
    />,
    <AdminRoute
      exact
      path="/admin/:walletId/:invoiceId/invoice/edit"
      component={invoiceEdit}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/:invoiceId/invoice/edit"
      component={invoiceEdit}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/tx/:txId/edit"
      component={TxEdit}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/tx/:txId/view"
      component={TxEdit}
    />,

    <AdminRoute
      exact
      path="/admin/:walletId/txtmplate/:txtemplateId/edit"
      component={TxTemplateEdit}
    />,

    // <Route exact path="/apiCheck">
    //   <ApiCheck />
    // </Route>,

    <Route exact path="/stripe/connect/:status">
      <StripeConnectHandle />
    </Route>,
    <Route exact path="/plaid/oauth">
      <HandlePlaidAuth />
    </Route>,


  ];
};

export default Routes;
