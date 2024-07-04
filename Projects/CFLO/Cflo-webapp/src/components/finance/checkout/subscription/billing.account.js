import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import configObject from '../../../../config';
import ProductCard from './product.card.view';
import AccountCard from '../../BillingAccount/BillingAccountCard';
import Api from '../../../../helpers/Api';
import {Divider} from '@material-ui/core';
import BillingAddressForm from '../../BillingAccount/BillingAddressForm';
import {useMediaQuery} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },

  sidebar: {
    width: '33vw',
    height: '100vh',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4vw',
    [theme.breakpoints.down('sm')]: {
      width: '33vw',
      height: '40%',
    },
  },

  right: {

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    [theme.breakpoints.up('xs')]: {
      width: '66vw',
      height: '100vh',
      paddingBottom: '4vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },


  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainText: {
    fontSize: '1.8rem',
    fontWeight: '500',
    textAlign: 'center',
    color: '#424242',
    marginTop: '3rem',
    marginBottom: '2.4rem',

    [theme.breakpoints.up('sm')]: {
      fontSize: '2.2rem',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '4rem',
      marginBottom: '2.4rem',
    },

  },

  mainTextBlock: {
    margin: '2rem 0',
  },

  addNewBtn: {
    height: '2rem',
    width: '8rem',
    marginLeft: '34vw',
    marginTop: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#00c853',
    color: 'white',
    borderRadius: '1rem',
  },

}));


export default function HandleBillingAccount(props) {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [edit, setEditMode] = useState(false);
  const {
    user, userProfile,
  } = useSelector((state) => state.auth);

  const {
    onSelect, product, setProductEdit,
    accounts, setAccounts,
  } = props;


  const {
    row, root, col, mainText, sidebar, right, addNewBtn,
  } = classes;

  const walletId = user?.model==='User'?user?.wallet:userProfile?.wallet;
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));


  return (

    <div className={root}>


      {isMobile?<ProductCard
        product={product}
        onSelect={()=>{
          setProductEdit();
        }}
      />: <div className={sidebar}>

        <ProductCard
          product={product}
          onSelect={()=>{
            setProductEdit();
          }}
        />

      </div>}

      {isMobile?<Divider />: <Divider
        orientation={'vertical'}
      />}


      {isMobile?<div className={col}>
        <Typography className={mainText}>
          {accounts.length>0&&!edit?'Select':'Add'} Billing Account
        </Typography>


        {
                        accounts.length>0&&!edit?<>
                          <ButtonBase
                            className={addNewBtn}
                            onClick={()=>{
                              setEditMode(true);
                            }}
                          >
                                        Add New
                          </ButtonBase>

                          {accounts.map((account)=>{
                            return (
                              <AccountCard
                                key={account?._id}
                                account={account}
                                onSelect={onSelect}
                              />
                            );
                          })}

                        </> :
                            <BillingAddressForm
                              walletId={walletId}
                              onSelect={onSelect}
                              accounts={accounts}
                              onCancel={()=>{
                                setEditMode(false);
                              }}
                            />
        }

      </div>:<div className={right}>

        <Typography className={mainText}>
          {accounts.length>0&&!edit?'Select':'Add'} Billing Account
        </Typography>

        {
                        accounts.length>0&&!edit?<>
                          <div className={col}>

                            <ButtonBase
                              className={addNewBtn}
                              onClick={()=>{
                                setEditMode(true);
                              }}
                            >
                                    Add New
                            </ButtonBase>

                            <div className={row}>

                              {accounts.map((account)=>{
                                return (
                                  <AccountCard
                                    key={account?._id}
                                    account={account}
                                    onSelect={onSelect}
                                  />
                                );
                              })}


                            </div>

                          </div>

                        </>:
                        <>
                          <BillingAddressForm
                            walletId={walletId}
                            onSelect={onSelect}
                            accounts={accounts}
                            onCancel={()=>{
                              setEditMode(false);
                            }}
                          />
                        </>
        }


      </div>}


    </div>

  );
}
