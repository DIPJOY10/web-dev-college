import { useState, useEffect } from 'react';
import Choose from "./choose";

function useSelectManager({
    // type of item being selected
    parentModelName, 

    onParentModelSelect,

    disableModelChange,
    
    // if radiomode is false select multiple
    multiple,
    // if only one item was selected
    // if multiple items were selected

    onSelected,

    placeholder
}){
    const [open, setOpen] = useState(false)



    const ChooseDialog = <Choose 
    		openDialog={open}
			setOpenDialog={setOpen}
            multiple={multiple}
    />

    return {
        open,
        setOpen
    }

}

export default useSelectManager