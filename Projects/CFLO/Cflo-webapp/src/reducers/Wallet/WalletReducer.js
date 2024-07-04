const initialState = {
  adminWallets: [],
  userWallet: {},
  checkout: {},
  plaidBankAccountDictionary: {},
  billingAccountDictionary: {},
  walletDictionary: {},
  transactionDictionary: {},
  chartAccountDictionary: {},
  newFinanceActivity: null,
  navFinanceState: 'Financial Statements',
  categories: [],
  group: null,
  subTypes: null,
  invoice: null, 
  billList: null,
  billItemDictionary: {},
  dwollaCustomerDictionary: {},
  toggleBarBool : false,
};

export default (state = initialState, action) => {
  // console.log(action,' is the action')

  switch (action.type) {
    case 'AddWallet':
      return {
        ...state,
        ...action.payload,
      };

    case 'changeToggleBar':
      return {
        ...state,
        ...action.payload,
      };

    case 'WalletReset':
      return initialState;

    case 'AddChartAccount':
      return {
        ...state,
        ...action.payload,
      };

    case 'ChartAccountReset':
      return initialState;

    case 'AddJournalEntry':
      return {
        ...state,
        ...action.payload,
      };

    case 'JournalEntryReset':
      return initialState;

    default:
      return state;
  }
};
