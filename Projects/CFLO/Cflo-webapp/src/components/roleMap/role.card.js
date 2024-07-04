import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import RoleView from './role.view';


export default function S(props) {
  const { roleId, onEditClick, onDeleteClick } = props;

  const history = useHistory();
  const dispatch = useDispatch();

  const {
    roleMap: roleMapReducer,
  } = useSelector((state) => state);

  const {
    roleMapDictionary,
  } = roleMapReducer;

  const role = roleMapDictionary[roleId];


  return (

    <RoleView
      role={role}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />

  );
}
