

export const findItem = (option, optionCol, options, optionCols)=>{
    let optionIdxs = []
    options.map((el,i)=>{
        if(el==option){
            optionIdxs.push(i)
        }
    });
    if(optionIdxs.length==0){
        return -1
    }else{
        var index = -1
        optionIdxs.map(i=>{
            var col = optionCols[i]
            if(optionCol==col){
                index = i
            }
        })

        return index
    }
}

export const addItem = (option, optionCol, options, optionCols)=>{
    
    var newOptions = [...options, option]
    var newOptionCols = [...optionCols, optionCol]

    return {
        options: newOptions,
        optionCols: newOptionCols
    }

}

export const removeItem = (index, options, optionCols)=>{
    
    var newOptions = [...options]
    var newOptionCols = [...optionCols]
    var removed = newOptions.splice(index, 1)
    var removedCol = newOptionCols.splice(index, 1)

    return {
        options: newOptions,
        optionCols: newOptionCols
    }

}