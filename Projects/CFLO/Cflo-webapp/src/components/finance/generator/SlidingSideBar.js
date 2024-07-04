import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import {IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TemplateCard from './TemplateCard';
import { getTxByTemplateId } from '../transaction/api';
import TxCard from './TxCard';


const ActivitySidebar = styled.aside`
  ${({open}) => css`
    position: absolute;
    z-index: 9999;
    top: 0;
    right: ${open ? '0px' : '-100%'};
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    max-height: 100%;
    min-width: 350px;
    overflow: auto;
    box-shadow: -10px 0px 20px 0px #00000030;
    transition: all 0.5s;

    .sidebar-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0.5rem 1rem 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }
  `}
`;

export default function SlidingSideBar(props) {
    const {
        setActivitySidebar,
        activitySidebar,
        selectedGenerator,
        setTxTemplates
    } = props;
    
    const [allTxs, setAllTxs] = useState([]);
    const [txLen, setTxLen] = useState(0);

  useEffect(() => {
    getTxByTemplateId({templateId : selectedGenerator?._id }) // keep bill in an array 
    .then((data) =>{
        setAllTxs(data)
        setTxLen(data.length)
    })
    .catch((error) =>{
          console.log(error);
    })

  }, [selectedGenerator]); 



  return (
    <>
      <ActivitySidebar open={activitySidebar}>
        <div className="sidebar-title">
          <div>{selectedGenerator?.name}</div>
          <IconButton>
            <CloseIcon onClick={() => setActivitySidebar(false)} />
          </IconButton>
        </div>
        <TemplateCard
         temData = {selectedGenerator}
         txLen = {txLen}
         setTxTemplates={setTxTemplates}
         setActivitySidebar={setActivitySidebar}
         />
         <TxCard 
           allTxs={allTxs}
           setAllTxs={setAllTxs}
           templateId={selectedGenerator?._id}
         />
      </ActivitySidebar>
    </>
  );
}
