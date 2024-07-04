function mentionTextProcessor(text) {
  //WORKING OF FUNCTION
  //In text argument, if anyone is mentioned then it will be in the form of |--|@ID||NAME|--|      eg. |--|@6204f7726192b9465a6a9870||Som Ahirwar|--|
  //Algorithm
  //1. Split String from |--|
  //2. For Each Element:
  //    a. If element starts with '@' and also contains '||' so we know that it is a mention
  //        Then, We know that ID and NAME is seprated with by '||', so, we again split it from '||',
  //        Now, We know that first element is the ID with '@' appended at the beginning, and 2nd element is name
  //        We Store it in the object with properties, type: "mention",id (from 1st element) , name: "@" + name (from 2nd element)
  //    b. ELSE we know that element is normal text, so we Store it object type: "text", text: element

  //Split String from |--|
  const arr = text.split("|--|");

  //2. For Each Element:
  const newArr = arr.map((el) => {
    if (el.startsWith("@") && el.includes("||")) {
      // Handling Mention
      //    a. If element starts with '@' and also contains '||' so we know that it is a mention
      //        Then, We know that ID and NAME is seprated with by '||', so, we again split it from '||',
      //        Now, We know that first element is the ID with '@' appended at the beginning, and 2nd element is name
      //        We Store it in the object with properties, type: "mention",id (from 1st element) , name: "@" + name (from 2nd element)
      let [id = "", name = ""] = el.split("||");
      id = id?.slice(1, id.length);
      name = name?.slice(0, name.length);
      return {
        type: "mention",
        id,
        name: "@" + name,
      };
    }

    //Handling Normal Text
    //    b. ELSE we know that element is normal text, so we Store it object type: "text", text: element
    return {
      type: "text",
      text: el,
    };
  });

  //OUTPUT
  //Output of the function will we array of object
  //Each object Contains a property type, whose value can be "text" or "mention"
  //if type==="text", then object will contain one other property "text" which value will we normal text
  //If type==="mention", then object will contain two other properties, 1.) "id" which will contain id of mentioned user 2.) "name" which will contain name of mentioned user with @ appended at the beginning
  return newArr;
}

export default mentionTextProcessor;
