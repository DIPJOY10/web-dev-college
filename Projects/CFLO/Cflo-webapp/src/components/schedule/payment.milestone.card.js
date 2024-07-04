import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import CardView from './payment.milestone.card.view';

export default function S(props) {
  const {milestoneId, onEditClick} = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const {
    schedule: scheduleReducer,
  } = useSelector((state) => state);

  const {
    paymentMilestoneDictionary,
  } = scheduleReducer;

  const pM = paymentMilestoneDictionary[milestoneId];

  return (
    <CardView
      milestone={pM}
      onEditClick={onEditClick}
    />
  );
}
