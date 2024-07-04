import { useState, useEffect } from "react";
import socket from "./socketio";
import { useSelector, useDispatch } from "react-redux";
import arrayToReducer from "../arrayToReducer";
import { db } from "../../index"

function useChatHook(profileId) {

  const [convIds, setConvIds] = useState([])
  const [convDict, setConvDict] = useState({})

  const [msgMap, setMsgMap] = useState({})
  const [msgDict, setMsgDict] = useState({})

  useEffect(() => {

    const path = "profile/" + profileId;

    // console.log(path, "path");
    // const path = "profile/" + "62c7bcb52689552964853662";
    console.log(path, "path");
    const ref = db.ref("chats/" + path);
    ref.on('value', (snapshot) => {
      const data = JSON.parse(snapshot.val());
      console.log(data, "data");
      if (data?.type == 'onMessage') {
        const payload = data?.payload
        const messages = payload?.messages || [];
        // console.log(data);

        if (messages?.length > 0) {
          const conversation = payload?.conversation
          addMsgHelper(messages, conversation, true)
        }
      }
    })
    // ref.child("chats").child(path).get().then((snapshot) => {
    //   if (snapshot.exists()) {
    //     let data = JSON.parse(snapshot.val());
    //     console.log(data, ' is the data');


    // }
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });
    // })
    // this.setState({ chats });
    // console.log(snapshot, "Snapshot");
    // });



    // socket.on(path, (data) => {
    //   console.log(data, ' is the socketdata')
    //   if (data.type == 'onMessage') {
    //     const payload = data?.payload
    //     const messages = payload?.messages || [];
    //     console.log(data);

    //     if (messages.length > 0) {
    //       const conversation = payload?.conversation


    //       addMsgHelper(messages, conversation, true)
    //     }

    //   }
    // });


  }, [profileId]);


  const addMsgHelper = async (msgs, convOrConvId, front) => {

    const {
      idArr, newDict
    } = arrayToReducer(msgs)
    var newMsgDict = {
      ...msgDict,
      ...newDict
    }

    setMsgDict(newMsgDict)


    var convId = convOrConvId?._id

    if (convId) {
      const {
        newDict: newConvObj
      } = arrayToReducer([convOrConvId])

      const newConvDict = {
        ...convDict,
        ...newConvObj
      }

      setConvDict(newConvDict)

    } else {
      convId = convOrConvId
    }


    var oldMsgs = msgMap[convId] || []


    var newMsgIds = front ? [...idArr, ...oldMsgs] : [...oldMsgs, ...idArr]
    var newMsgMapObj = {}
    newMsgMapObj[convId] = Array.from(new Set(newMsgIds))
    var newMsgMap = {
      ...msgMap,
      ...newMsgMapObj
    }


    setMsgMap(newMsgMap)

    if (front) {
      var convSet = new Set(convIds)
      convSet.delete(convId)
      var newConvIds = [convId, ...Array.from(convSet)]

      setConvIds(newConvIds)
    }

  }




  return {
    convIds, setConvIds,
    convDict, setConvDict,
    msgMap, setMsgMap,
    msgDict, setMsgDict,
    addMsgHelper
  }
}

export default useChatHook;
