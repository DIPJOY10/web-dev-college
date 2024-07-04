import _ from 'lodash';

const testFields = ( fieldArray, text) =>{
  let fieldTextContain = false;
  fieldArray.map((field)=>{
    const patt = new RegExp(text);
    const res = patt.test(field);
    if (res) {
      fieldTextContain = true;
    }
  });
  return fieldTextContain;
};

export default testFields;