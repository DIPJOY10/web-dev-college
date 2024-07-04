import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CreateTreeViewOfChartAccounts from '../CreateTreeViewOfChartAccounts';
import { getTotalAmountChartAccounts } from '../RestructureChartArr';
import ReportPaperPdf from '../ReportPaperPdf';
const _ = require("lodash");

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  rootTree: {
    flexGrow: 1,
    width: "100%",
  },

  divider: {
    width: '100%',
    borderTop: "1px solid #E1E2E5",
  },

  downloadCont: {
    width: '100%',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px"
  },

}));

export default function BalanceSheetPDF(props) {
  const { walletId, accts } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { divider } = classes;
  const walletReducer = useSelector((state) => state.wallet);
  const { walletDictionary } = walletReducer;
  const wallet = walletDictionary[walletId];

  let ar = 'Account Receivable (A/R)'
  let oca = "Other Current Assets"
  let fa = 'Fixed Assets'
  let oa = 'Other Assets'
  let ap = 'Accounts Payables (A/P)'
  let cc = 'Credit Card'
  let ocl = 'Other Current Liabilities'
  let ltl = 'Long Term Liabilities'
  let cog = "Cost of Goods Sold"
  let oe = 'Other Expense'
  let oi = 'Other Income'



  const [chartAccountGroup, setChartAccountGroup] = useState(null)

  const [totalCurrentAssets, setTotalCurrentAssets] = useState(0)
  const [totalNonCurrentAssets, setTotalNonCurrentAssets] = useState(0)
  const [totalAssets, setTotalAssets] = useState(0)

  const [totalCurrentLiabilities, setTotalCurrentLiabilities] = useState(0)
  const [totalNonCurrentLiabilities, setTotalNonCurrentLiabilities] = useState(0)
  const [totalLiabilities, setTotalLiabilities] = useState(0)

  const [totalEquity, setTotalEquity] = useState(0)

  const [totalLiabilitiesAndEquity, setTotalLiabilitiesAndEquity] = useState(0)

  const [equityChartArr, setEquityChartArr] = useState([])


  useEffect(() => {
    const chartAccGroupByClassification = _.groupBy(accts, 'classification')
    setChartAccountGroup(chartAccGroupByClassification)

    let total_current_assets = getTotalAmountChartAccounts(chartAccGroupByClassification?.Bank) + getTotalAmountChartAccounts(chartAccGroupByClassification?.[ar]) + getTotalAmountChartAccounts(chartAccGroupByClassification?.[oca])
    setTotalCurrentAssets(total_current_assets)

    let total_non_current_assets = getTotalAmountChartAccounts(chartAccGroupByClassification?.[fa]) + getTotalAmountChartAccounts(chartAccGroupByClassification?.[oa])
    setTotalNonCurrentAssets(total_non_current_assets)

    let total_assets = total_current_assets + total_non_current_assets
    setTotalAssets(total_assets)

    let total_current_Liabilities = getTotalAmountChartAccounts(chartAccGroupByClassification?.[ap]) + getTotalAmountChartAccounts(chartAccGroupByClassification?.[cc]) + getTotalAmountChartAccounts(chartAccGroupByClassification?.[ocl])
    setTotalCurrentLiabilities(total_current_Liabilities)

    let total_non_current_Liabilities = getTotalAmountChartAccounts(chartAccGroupByClassification?.[ltl])
    setTotalNonCurrentLiabilities(total_non_current_Liabilities)

    let total_Liabilities = total_current_Liabilities + total_non_current_Liabilities
    setTotalLiabilities(total_Liabilities)

    let total_equity = getTotalAmountChartAccounts(chartAccGroupByClassification?.Equity)
    setTotalEquity(total_equity)

    let total_Liabilities_and_equity = total_Liabilities + total_equity
    setTotalLiabilitiesAndEquity(total_Liabilities_and_equity)

    let net_income = getTotalAmountChartAccounts(chartAccGroupByClassification?.Income) +
    getTotalAmountChartAccounts(chartAccGroupByClassification?.[oi])
    - getTotalAmountChartAccounts(chartAccGroupByClassification?.[cog])
    - getTotalAmountChartAccounts(chartAccGroupByClassification?.Expense)
    - getTotalAmountChartAccounts(chartAccGroupByClassification?.[oe])

  const netIncomeChartAcc = {
    _id : "NET INCOME",
    name : "NET INCOME",
    parent : null,
    balance : net_income
  }

  const equityChartAccs = chartAccGroupByClassification?.Equity
  const equityChartAccsWithNetIncome = [...equityChartAccs, netIncomeChartAcc]

  setEquityChartArr(equityChartAccsWithNetIncome)



  }, [walletId, accts]);


  let name = '';

  switch (wallet?.parentModelName) {
    case 'User':
      name = wallet?.parent?.displayName || '';
      break;
    case 'Team':
      name = wallet?.parent?.parent?.displayName || '';
      break;
    default:
      break;
  }
  const assetsIdsArr = [
    `Assets9089`,
    `CurrentAssets9089`,
    `totalCurrentAssets`,
    `NonCurrentAssets9089`,
    `totalNonCurrentAssets`,
    `totalAssets`
  ]

  const liabilitesAndEquityIdsArr = [
    `LiabilitesAndEquity9089`,
    `Liabilites9089`,
    `CurrentLiabilites9089`,
    `totalCurrentLiabilites`,
    `NonCurrentLiabilites9089`,
    `totalNonCurrentLiabilites`,
    `totalLiabilites`,
    `EquityTop9089`,
    `totalEquity`,
    `totalLiabilitiesAndEquity`
  ]

  return (
      <ReportPaperPdf
        title={name}
        subTitle='Balance Sheet'
      >
        <List component="nav" className={classes.root} aria-label="mailbox folders">

          {/* Assets */}
          <div className={divider} ></div>
          <ListItem button>
            <TreeView
              className={classes.rootTree}
              defaultExpanded={['3']}
              defaultCollapseIcon={<ArrowDropDownIcon />}
              defaultExpandIcon={<ArrowRightIcon />}
              defaultEndIcon={<div style={{ width: 24 }} />}
              style={{ marginBottom: "5px" }}
              expanded={assetsIdsArr}
            >
              <TreeItem nodeId={`Assets9089`} label={
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                  <div>ASSETS</div>
                  <div></div>
                </div>}>

                <div className={divider} ></div>

                <TreeItem nodeId={`CurrentAssets9089`} label={
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <div>CURRENT ASSETS</div>
                    <div></div>
                  </div>}>

                  <div className={divider} ></div>

                  <CreateTreeViewOfChartAccounts
                    chartAccounts={chartAccountGroup && chartAccountGroup?.Bank}
                    mainLabel="BANK ACCOUNT"
                    forPrint={true}
                  />

                  <div className={divider} ></div>

                  <CreateTreeViewOfChartAccounts
                    chartAccounts={chartAccountGroup && chartAccountGroup?.[ar]}
                    mainLabel="ACCOUNT RECEIVABLE"
                    forPrint={true}
                  />

                  <div className={divider} ></div>

                  <CreateTreeViewOfChartAccounts
                    chartAccounts={chartAccountGroup && chartAccountGroup?.[oca]}
                    mainLabel="OTHER CURRENT ASSETS"
                    forPrint={true}
                  />

                  <div className={divider} ></div>

                  <TreeItem
                    nodeId={`totalCurrentAssets`}
                    label={
                      <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <div>TOTAL CURRENT ASSETS</div>
                        <div>${totalCurrentAssets?.toFixed(2)}</div>
                      </div>}
                  />

                </TreeItem>

                <div className={divider} ></div>

                <TreeItem nodeId={`NonCurrentAssets9089`} label={
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <div>NON CURRENT ASSETS</div>
                    <div></div>
                  </div>}>

                  <div className={divider} ></div>

                  <CreateTreeViewOfChartAccounts
                    chartAccounts={chartAccountGroup && chartAccountGroup?.[fa]}
                    mainLabel="FIXED ASSETS"
                    forPrint={true}
                  />

                  <div className={divider} ></div>

                  <CreateTreeViewOfChartAccounts
                    chartAccounts={chartAccountGroup && chartAccountGroup?.[oa]}
                    mainLabel="OTHER ASSETS"
                    forPrint={true}
                  />

                  <div className={divider} ></div>

                  <TreeItem
                    nodeId={`totalNonCurrentAssets`}
                    label={
                      <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <div>TOTAL NON CURRENT ASSETS</div>
                        <div>${totalNonCurrentAssets?.toFixed(2)}</div>
                      </div>}
                  />

                </TreeItem>

                <div className={divider} ></div>

                <TreeItem
                  nodeId={`totalAssets`}
                  label={
                    <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                      <div>TOTAL ASSETS</div>
                      <div>${totalAssets?.toFixed(2)}</div>
                    </div>}
                />
              </TreeItem>
            </TreeView>
          </ListItem>



          {/* Liabilities and Equity */}
          <div className={divider} ></div>
          <ListItem button>
            <TreeView
              className={classes.rootTree}
              defaultExpanded={['3']}
              defaultCollapseIcon={<ArrowDropDownIcon />}
              defaultExpandIcon={<ArrowRightIcon />}
              defaultEndIcon={<div style={{ width: 24 }} />}
              style={{ marginBottom: "5px" }}
              expanded={liabilitesAndEquityIdsArr}
            >
              <TreeItem nodeId={`LiabilitesAndEquity9089`} label={
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                  <div>LIABILITIES AND EQUITY</div>
                  <div></div>
                </div>}>
                <TreeItem nodeId={`Liabilites9089`} label={
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <div>LIABILITIES</div>
                    <div></div>
                  </div>}>
                  <TreeItem nodeId={`CurrentLiabilites9089`} label={
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                      <div>CURRENT LIABILITIES</div>
                      <div></div>
                    </div>}>

                    <div className={divider} ></div>

                    <CreateTreeViewOfChartAccounts
                      chartAccounts={chartAccountGroup && chartAccountGroup?.[ap]}
                      mainLabel="ACCOUNT PAYABLES"
                      forPrint={true}
                    />

                    <div className={divider} ></div>

                    <CreateTreeViewOfChartAccounts
                      chartAccounts={chartAccountGroup && chartAccountGroup?.[cc]}
                      mainLabel="CREDIT CARDS"
                      forPrint={true}
                    />

                    <div className={divider} ></div>

                    <CreateTreeViewOfChartAccounts
                      chartAccounts={chartAccountGroup && chartAccountGroup?.[ocl]}
                      mainLabel="OTHER CURRENT LIABILITIES"
                      forPrint={true}
                    />

                    <div className={divider} ></div>

                    <TreeItem
                      nodeId={`totalCurrentLiabilites`}
                      label={
                        <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                          <div>TOTAL CURRENT LIABILITIES</div>
                          <div>${totalCurrentLiabilities?.toFixed(2)}</div>
                        </div>}
                    />

                  </TreeItem>
                  <TreeItem nodeId={`NonCurrentLiabilites9089`} label={
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                      <div>NON CURRENT LIABILITIES</div>
                      <div></div>
                    </div>}>

                    <div className={divider} ></div>

                    <CreateTreeViewOfChartAccounts
                      chartAccounts={chartAccountGroup && chartAccountGroup?.[ltl]}
                      mainLabel="LONG TERM LIABILITIES"
                      forPrint={true}
                    />

                    <div className={divider} ></div>

                    <TreeItem
                      nodeId={`totalNonCurrentLiabilites`}
                      label={
                        <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                          <div>TOTAL NON CURRENT LIABILITIES</div>
                          <div>${totalNonCurrentLiabilities?.toFixed(2)}</div>
                        </div>}
                    />

                  </TreeItem>

                  <div className={divider} ></div>

                  <TreeItem
                    nodeId={`totalLiabilites`}
                    label={
                      <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <div>TOTAL LIABILITIES</div>
                        <div>${totalLiabilities?.toFixed(2)}</div>
                      </div>}
                  />

                </TreeItem>
                <TreeItem nodeId={`EquityTop9089`} label={
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <div>EQUITY</div>
                    <div></div>
                  </div>}>

                  <div className={divider} ></div>

                  <CreateTreeViewOfChartAccounts
                    chartAccounts={equityChartArr}
                    mainLabel="EQUITY"
                    forPrint={true}
                  />

                  <div className={divider} ></div>

                  <TreeItem
                    nodeId={`totalEquity`}
                    label={
                      <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <div>TOTAL EQUITY</div>
                        <div>${totalEquity?.toFixed(2)}</div>
                      </div>}
                  />

                </TreeItem>

                <div className={divider} ></div>

                <TreeItem
                  nodeId={`totalLiabilitiesAndEquity`}
                  label={
                    <div style={{ fontWeight: "550", width: "100%", display: "flex", justifyContent: "space-between" }} >
                      <div>TOTAL LIABILITIES AND EQUITY</div>
                      <div>${totalLiabilitiesAndEquity?.toFixed(2)}</div>
                    </div>}
                />

              </TreeItem>
            </TreeView>
          </ListItem>
          <div className={divider} ></div>
        </List>
      </ReportPaperPdf>
  );
}
