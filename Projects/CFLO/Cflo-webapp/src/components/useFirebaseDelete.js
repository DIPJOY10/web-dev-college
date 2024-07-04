import React, {useState, useEffect} from 'react';
import firebase from 'firebase';


function useFirebaseDelete() {
  useEffect(() => {
    const storageRef = firebase.storage().ref();
    // Create a reference
    // console.log(' useFirebaseDelete called')
    async function fetchData() {
      const res = await storageRef.list({maxResults: 1000});


      Promise.allSettled(res.items.map(function(file) {
        return file.delete();
      })).
          then((results) => fetchData());
    }

    storageRef.listAll().then(function(result) {
      // console.log(result,' is the storageres')
    }).catch(function(error) {
      // Handle any errors
    });

    fetchData();
    // const interval = setInterval(() => {
    //     fetchData()
    //   }, 2000);

    //   return () => clearInterval(interval);
  }, []);
}

export default useFirebaseDelete;
