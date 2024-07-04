const union = (array1,array2)=>{
    var arr1 = JSON.parse(JSON.stringify(array1))
    var arr2 = JSON.parse(JSON.stringify(array2))
    var set = new Set([...arr1,...arr2])
    return Array.from(set);
}

const unionBy = (array1,array2,key)=>{
    var set = new Set([]);
    var arr1 = JSON.parse(JSON.stringify(array1))
    var arr2 = JSON.parse(JSON.stringify(array2))
    var newArray = []
    arr1.forEach(elem=>{
        var elemKey = elem[key];
        if(set.has(elemKey)){
            //do nothing
        }else{
            set.add(elemKey);
            newArray.push(elem)
        }
    });

    arr2.forEach(elem=>{
        var elemKey = elem[key];
        if(set.has(elemKey)){
            //do nothing
        }else{
            set.add(elemKey);
            newArray.push(elem)
        }
    })

    return newArray;
}

module.exports = {
    union,
    unionBy
}