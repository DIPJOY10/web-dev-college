import configObject from '../../../../config';

export const getSubscriptionProducts = ()=>{
  const product1 = {
    title: 'Professional 🤝',
    cost: '$5 ',
    costText: ' per month',
    subText1: 'Superpowers at just $5',
    subText2: 'Cancel anytime you want',
    priceStripeId: configObject.stripePrices.monthly,
  };

  const product2 = {
    title: 'Believer 👏',
    cost: '$50 ',
    costText: ' yearly',
    subText1: 'Priority customer support 🤗 ',
    subText2: 'We will always love you',
    priceStripeId: configObject.stripePrices.annual,
  };
  return [product1, product2];
};
