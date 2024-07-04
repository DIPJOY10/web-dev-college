import React, {useState, useEffect} from 'react';
import {Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';


const styles = StyleSheet.create({

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

});

function Bottom() {
  const {
    row,
  } = styles;


  return (

    <View style={row}>
    </View>

  );
}


export default Bottom;
