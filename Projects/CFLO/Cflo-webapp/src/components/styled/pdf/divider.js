import React, {useState, useEffect} from 'react';
import {Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';


const styles = StyleSheet.create({

  lineRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
  },

});

function Divider() {
  const {
    lineRow,
  } = styles;


  return (

    <View style={lineRow}>
    </View>

  );
}


export default Divider;
