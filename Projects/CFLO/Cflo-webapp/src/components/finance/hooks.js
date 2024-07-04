import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../helpers/Api';
import arrayToReducer from '../../helpers/arrayToReducer';
import {useParams} from 'react-router-dom';
import _ from 'lodash';

export function useReportHelper(walletId) {
  const dispatch = useDispatch();
  const [entries, setEntries] = useState([]);
  const walletReducer = useSelector((state) => state.wallet);

  const {walletDictionary, categories, chartAccountDictionary} = walletReducer;

  const wallet = walletDictionary[walletId];
  const chartAccountIds = wallet?.chartOfAccounts || [];
  const chartAccounts = chartAccountIds.map((acctId) => {
    return chartAccountDictionary[acctId];
  });
  const group = _.groupBy(chartAccounts, 'classification');
  const types = [
    'Account Receivable (A/R)',
    'Other Current Assets',
    'Bank',
    'Fixed Assets',
    'Other Assets',
    'Accounts Payables (A/P)',
    'Credit Card',
    'Other Current Liabilities',
    'Long Term Liabilities',
    'Equity',
    'Income',
    'Other Income',
    'Cost of Goods Sold',
    'Expense',
    'Other Expense',
  ];

  useEffect(() => {
    if (walletId) {
    }
    else {
      Api.post('wallet/journal/get', {wallet: walletId}).then((res) => {
        const entryRes = res.data || [];
        setEntries(entryRes);
      });
    }

    if (categories && categories.length > 0) {
    }
    else {
      Api.post('wallet/chart/types', {}).then((res) => {
        const {classifications, subTypes} = res;

        const {categories, group} = classifications;

        dispatch({
          type: 'AddWallet',
          payload: {
            categories,
            group,
            subTypes,
          },
        });
      });
    }
  }, []);

  return {
    group,
    chartAccounts,
    types,
    entries,
  };
}

export function useFindWallet() {
  const {walletId: walletIdParam} = useParams();
  const {wallet} = useSelector((state) => state);

  const {newFinanceActivity} = wallet;

  if (walletIdParam) {
    return walletIdParam;
  }
  else {
    if (newFinanceActivity?.walletId) {
      return newFinanceActivity?.walletId;
    }
    else {
      return null;
    }
  }
}

export function useGetWallet(walletId) {
  const dispatch = useDispatch();
  const walletReducer = useSelector((state) => state.wallet);

  const {walletDictionary, chartAccountDictionary, plaidBankAccountDictionary, billingAccountDictionary} = walletReducer;

  const [wallet, setWallet] = useState(null);
  const oldWallet = walletDictionary[walletId];
  const [bankAccounts, setBankAccounts] = useState([]);
  const [billingAccts, setBillingAccts] = useState([]);

  useEffect(() => {
    if (walletId) {
      Api.post('wallet/getData', {
        walletId,
      }).then((res) => {
        const data = res?.data;

        if (data) {
          const {transactions, wallet: walletRes, chartAccounts, billingAccounts, bankAccounts: allAccounts} = data;
          setBankAccounts(allAccounts);

          console.log(allAccounts);

          setBillingAccts(billingAccounts);

          const {newDict: newWalletDict} = arrayToReducer([walletRes]);

          const {newDict: newPlaidBankDict} = arrayToReducer(allAccounts);

          const {newDict: newChartAccountDict} = arrayToReducer(chartAccounts);

          setWallet(walletRes);

          dispatch({
            type: 'AddWallet',
            payload: {
              walletDictionary: {
                ...walletDictionary,
                ...newWalletDict,
              },
              chartAccountDictionary: {
                ...chartAccountDictionary,
                ...newChartAccountDict,
              },
              plaidBankAccountDictionary: {
                ...plaidBankAccountDictionary,
                ...newPlaidBankDict,
              },
            },
          });
        }
      });
    }
  }, [walletId]);

  return {
    wallet,
    plaidBankAccounts: bankAccounts,
    billingAccounts: billingAccts,
  };
}

export function useGetInvoice(invoiceId) {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (invoiceId) {
      Api.post('wallet/invoice/get', {invoiceId}).then((res) => {
        const invData = res.data;

        setInvoice(invData);

        dispatch({
          type: 'AddWallet',
          payload: {
            invoice,
            setInvoice,
          },
        });
      });
    }
  }, []);

  return {
    invoice,
    setInvoice,
  };
}

export const processReceivedInvoice = (invoice) => {
  const billList = invoice?.billList;
  const items = billList?.items || [];

  const {newDict: billItemDictionary, idArr} = arrayToReducer(items);

  billList.items = idArr;
  invoice.billList = billList?._id;

  return {
    billItemDictionary,
    billList,
  };
};
