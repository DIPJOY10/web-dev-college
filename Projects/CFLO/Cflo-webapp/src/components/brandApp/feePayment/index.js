import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Api from '../../../helpers/Api';
import { Divider } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CardPaymentBasic from '../../finance/stripe/PaymentMethods/CardPaymentBasic';
import { useParams } from 'react-router-dom';
import { setBrandApps } from '../utils';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import { useSpring, animated as a } from 'react-spring'
import Card from './Card';
import Button from '@material-ui/core/Button';
import { cardDataArr } from './cardData';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from '../../../config/index';
import { getCouponData, updateIntentAmount } from './api';



const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
  },
  mainCont: {
    width: "100vw",
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden"
  },
  uperPart: {
    width: "100%",
    height: "40%",
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  titleText: {
    fontSize: "35px",
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: '15px',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: '30px'
    },
  },
  tagLine: {
    textAlign: "center",
    fontSize: "20px",
    color: "white",
    [theme.breakpoints.down('sm')]: {
      fontSize: '17px'
    },
  },
  discription: {
    color: 'white',
    width: '50%',
    textAlign: "center",
    fontSize: "15px",
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
      width: '95%'
    },
  },
  bottomPart: {
    width: "100%",
    height: "60%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  cardCont: {
    width: "65%",
    position: "relative",
    top: "-70px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  couponCard: {
    width: "30%",
    height: "60%",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    position: "relative",
    top: "-70px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    padding: "10px",
    backgroundColor: "white",
    color: "#318FAB",
    borderRadius: "5px",
  },
  couponInput: {
    fontSize: "20px",
    padding: "3px",
    widht: "70%",
    paddingLeft: "5px",
    border: "1px solid #EB6A17",
    color: "#EB6A17"
  },
  selectCardCont: {
    width: "45%",
    position: "relative",
    top: "-130px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    paddingBottom: "30px",
    [theme.breakpoints.down('sm')]: {
      width: "95%",
      top: "-80px"
    },
  },
  PayMentCont: {
    minHeight: "350px",
    width: "300px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "5px",
    position: "relative",
    top: "-10px"
  },

}));

const AppFeePayment = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    couponInput, couponCard, root, mainCont, titleText,
    uperPart, bottomPart, tagLine, discription, cardCont,
    selectCardCont, PayMentCont
  } = classes;
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { appStoreImg } = classes;

  const auth = useSelector((state) => state.auth);
  const { user, userProfile } = auth;
  const dispatch = useDispatch();

  let profile = user;
  if (user?._id) {
    profile = user?.model === 'User' ? user : userProfile;
  }

  // if Account selected and not in Edit mode then move ahead to payment

  const [accountEdit, setAccountEdit] = useState(false);

  const walletId = user?.model === 'User' ? user?.wallet : userProfile?.wallet;
  const [accounts, setAccounts] = useState([]);

  const { appId } = useParams();

  const [brandApp, setBrandApp] = useState(null)
  const [clientSecret, setClientSecret] = useState("")

  var return_url = `${config.BASE_URL}brandApp/paid/success/${appId}/${brandApp?.transaction?._id}`

  useEffect(() => {
    Api.post('brand/app/getById', { appId })
      .then((brandApp) => {
        setBrandApp(brandApp?.data)
        setClientSecret(brandApp?.data?.transaction?.stripePaymentIntent?.clientSecret)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [appId]);

  const [stripePromise, setStripePromise] = useState(() => loadStripe(config.stripePk))

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  }

  const [greetingStatus, displayGreeting] = useState(true);
  const [afterCoupon, setAfterCoupon] = useState(true);

  const optionCardProps = useSpring({
    opacity: greetingStatus ? 1 : 0,
    marginTop: greetingStatus ? 0 : 50
  });

  const couponCardProps = useSpring({
    opacity: greetingStatus ? 0 : 1,
    marginTop: greetingStatus ? 50 : 0
  });

  const selectedCardProps = useSpring({
    opacity: afterCoupon ? 0 : 1,
    marginTop: afterCoupon ? -50 : 0
  });

  const [selectedCard, setSelectedCard] = useState(cardDataArr[0]);
  const [couponCode, setCouponCode] = useState("")
  const [couponData, setCouonData] = useState();

  const cardClick = async (i) => {
    setSelectedCard(cardDataArr[i])
    displayGreeting(false)
  }

  const couponAppy = async () => {
    setAfterCoupon(false);
    const amount = selectedCard.amount;

    await updateIntentAmount({
      appId: appId,
      amount: amount,
      coupon: couponData ? couponData._id : null
    })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })

  }

  return (
    <div className={root}>
      {/* {isMobile ? (
        <>
          hello
        </>
      ) : ( */}
      <div className={mainCont}>
        <div className={uperPart} >
          <Typography className={titleText} >Get started Now</Typography>
          <Typography className={tagLine}>
            Take your <b>Brand</b> to the <b>Next Level</b>
          </Typography>
          <Typography className={discription} >
            App development is costly. It can cost you anywhere from $5,000 - $100,0000+ . We offer you both ios and android for <b>$200</b> only.
            It's time to build your brand.
          </Typography>
        </div>
        <div className={bottomPart} >
          {greetingStatus ? (
            <a.div style={optionCardProps} className={cardCont} >

              {cardDataArr.map((cardData, index) => {
                const Component = cardData.ComIcon
                const colorbg = cardData.colorbg
                return (
                  <Card
                    Title={cardData.title}
                    Comicon={<Component style={{ color: colorbg, fontSize: "80px" }} />}
                    PricingRet={cardData.priceRet}
                    MainF={cardData.mainF}
                    arrSub={cardData.arrSubF}
                    colorbg={colorbg}
                    cardClick={cardClick}
                    index={index}
                    card={true}
                  />)
              })}
            </a.div>
          ) : (<>
            {
              afterCoupon ? (
                <a.div style={couponCardProps} className={couponCard} >
                  <Typography style={{ fontSize: "20px" }} >Have Any ?</Typography>
                  <Typography style={{ fontSize: "20px" }} >Apply Your Coupon & Get Awesome Discount</Typography>

                  <input
                    type="text"
                    placeholder={"ENTER COUPON CODE"}
                    className={couponInput}
                    value={couponCode}
                    onChange={async (event) => {
                      const Code = event.target.value;
                      setCouponCode(event.target.value);
                      await getCouponData({ code: Code })
                        .then((data) => {
                          setCouonData(data)
                          console.log(data)
                        })
                        .catch((error) => {
                          console.log(error)
                        })
                    }}
                  />

                  <p>Discount Summary</p>
                  <table>
                    <tr>
                      <th>Amount</th>
                      <td>$ 500</td>
                    </tr>
                    <tr>
                      <th>Discount</th>
                      <td>50%</td>
                    </tr>
                    <tr>
                      <th>Final Amount</th>
                      <td>$ 250</td>
                    </tr>
                  </table>
                  <Button
                    style={{
                      fontSize: "17px",
                      backgroundColor: "#EB6A17",
                      padding: "5px 15px",
                      color: "white"
                    }}
                    onClick={() => { couponAppy() }}
                  >Apply</Button>
                </a.div>
              ) : (
                <a.div style={selectedCardProps} className={selectCardCont} >
                  <Card
                    Title={selectedCard.title}
                    Comicon={<selectedCard.ComIcon style={{ color: selectedCard.colorbg, fontSize: "80px" }} />}
                    PricingRet={selectedCard.priceRet}
                    MainF={selectedCard.mainF}
                    arrSub={selectedCard.arrSubF}
                    colorbg={selectedCard.colorbg}
                    cardClick={cardClick}
                    displayGreeting={displayGreeting}
                    setAfterCoupon={setAfterCoupon}
                    card={false}
                  />
                  {clientSecret &&
                    <div className={PayMentCont} >
                      <Elements stripe={stripePromise} options={options}  >
                        <CardPaymentBasic
                          clientSecret={clientSecret}
                          btnText={'Lets get Started'}
                          return_url={return_url}
                        />
                      </Elements>
                    </div>
                  }
                </a.div>
              )
            }
          </>
          )}



        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default AppFeePayment;
