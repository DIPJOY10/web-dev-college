import _ from 'lodash';

export const addInWallets = ( transactions, walletIds, walletReducer, dispatch )=>{
  const {walletDictionary, transactionDictionary} = walletReducer;

  const transactionObject = {};
  const transactionArray = [];
  const newWalletDictionary = {};

  transactions.map((transaction)=>{
    const transactionId = transaction._id;
    transactionObject[transactionId] = transaction;
    transactionArray.push(transactionId);
  });

  walletIds.map((walletId)=>{
    const data = walletDictionary&&walletDictionary[walletId]?walletDictionary[walletId]:{};
    if (data&&data?.transactions) {
      newWalletDictionary[walletId] = {
        ...data,
        transactions: _.uniq(_.concat(data?.transactions, transactionArray)),
      };
    }
    else {
      newWalletDictionary[walletId] = {
        ...data,
        transactions: transactionArray,
      };
    };
  });


  dispatch({
    type: 'AddWallet',
    payload: {
      walletDictionary: newWalletDictionary,
      transactionDictionary: {
        ...transactionDictionary,
        ...transactionObject,
      },
    },
  });
};

export const setTransactions = ( transactions = [], walletId, walletReducer, dispatch )=>{
  const {walletDictionary, transactionDictionary} = walletReducer;
  const data = walletDictionary&&walletDictionary[walletId]?walletDictionary[walletId]:{};
  const transactionObject = {};
  const transactionArray = [];
  const newWalletDictionary = {};

  transactions.map((transaction)=>{
    const transactionId = transaction._id;
    transactionObject[transactionId] = transaction;
    transactionArray.push(transactionId);
  });

  if (data&&data?.transactions) {
    newWalletDictionary[walletId] = {
      ...data,
      transactions: _.uniq(_.concat(data?.transactions, transactionArray)),
    };
  }
  else {
    newWalletDictionary[walletId] = {
      ...data,
      transactions: transactionArray,
    };
  };

  dispatch({
    type: 'AddWallet',
    payload: {
      walletDictionary: newWalletDictionary,
      transactionDictionary: {
        ...transactionDictionary,
        ...transactionObject,
      },
    },
  });
};

export const getTeamWallet = (teamId, teamReducer)=>{
  const {teamDictionary} = teamReducer;
  const team = teamDictionary[teamId];
  const wallet = team.wallet;
  return [wallet];
};
