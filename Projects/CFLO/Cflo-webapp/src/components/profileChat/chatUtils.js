export const prepareMessagesSlack = (conversation,  profile, msgIds, msgDict)=>{
    const dates = new Set([]);
    const dateMessages = new Map();
    const messages = msgIds.map(msgId =>msgDict[msgId]);

    if (conversation&&conversation.participants) {

        
  
      if (messages?.length>0) {
        // const length = messages.length;
        // if array is already reversed don't reverse again
        // if (length>1) {
        //   const firstMessageCreatedAt = new Date(messages[0].createdAt);
        //   const secondMessageCreatedAt = new Date(messages[1].createdAt);
        //   if (secondMessageCreatedAt-firstMessageCreatedAt<0) {
        //     messages = messages.reverse();
        //   }
        // }
  
        messages.map((message, index)=>{
          const date = message.createdAt;
          const dateFormat = moment(date).format('DD MMM YYYY');
          dates.add(dateFormat);
          const user = message.user;
  
          if (dateMessages.has(dateFormat)) {
            const dayMessages = dateMessages.get(dateFormat);
            const arrayLength = dayMessages.length;
            const lastBlock = dayMessages[arrayLength - 1];
  
            if (lastBlock?.user?._id===user) {
              // if last block is of same type just add in array
  
              lastBlock.messages.push(message);
              dateMessages.set(dateFormat, dayMessages);
            }
            else {
              // create new block if type is different and push in parent array
  
  
              if (profileDictionary[user]&&profileDictionary[user].parent) {
                const newBlock = {
                  user: profileDictionary[user].parent,
                  messages: [message],
                };
                dayMessages.push(newBlock);
              }
            }
          }
          else {
            if (profileDictionary[user]&&profileDictionary[user].parent) {
              const newDayMessageObject = {
                user: profileDictionary[user].parent,
                messages: [message],
              };
  
              dateMessages.set(dateFormat, [newDayMessageObject]);
            }
          }
        });
      }
    }
  
    return {
      dates: Array.from(dates),
      dateMessages,
    };
  };