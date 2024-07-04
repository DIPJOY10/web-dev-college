import React, {useState} from 'react';

function UpdateSubscription(props) {
  const handleClick = (evt) => {
    evt.preventDefault();
    return fetch('/update-subscription', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId: subscriptionId,
        newPriceId: priceId,
      }),
    })
        .then((response) => {
          return response.json();
        })
        .then((cancelSubscriptionResponse) => {
        // Display to the user that the subscription has been cancelled.
        });
  };

  return (
    <button handleClick={handleClick} type="submit">
      Update subscription
    </button>
  );
}

export default UpdateSubscription;
