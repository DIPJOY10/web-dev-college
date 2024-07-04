import {
	Breadcrumbs,
	Button,
	CircularProgress,
	List,
	makeStyles,
	Typography,
    Avatar, Radio, Checkbox,
} from "@material-ui/core";
import SearchBar from "../../share/searchbar";

import React, { useEffect, useState } from "react";

import IssueListItem from "../listItems/issue.list.item";
import TemplateItem from "../listItems/template.list.item";

import useProfileIssueData from "../../issue/useProfileIssueData";
import useGetTemplates from "../../issue/useGetTemplates";
import arrayToReducer from "../../../helpers/arrayToReducer";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles((theme) => ({
	hoverUnderline: {
		"&:hover": {
			textDecoration: "underline",
			color: "blue",
			cursor: "pointer",
		},
	},
    row: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
}));

const useIssueData = (selectedProfile )=>{
    let {
        issueIds:itemIds,
        issueDictionary:itemDict,
        loading,
    } = useProfileIssueData(selectedProfile || false);

    return {
        itemIds,
        itemDict,
        loading
    }
}

const useTemplateData = (selectedProfile )=>{
    let {
        templateIds:itemIds,
        templateDictionary:itemDict,
        loading,
    } = useGetTemplates(selectedProfile || false);

    return {
        itemIds,
        itemDict,
        loading
    }
}

const getData = ( parentModelName )=>{

    switch (parentModelName) {
        case 'Issue':
            
            return useIssueData

            break;
  
        case 'Template':

            return useTemplateData;

            break;
        default:
            break;
    }

  
}

const filterItems = (text, items,parentModelName) => {
    if(text?.length>0){
        return items
    }else{
        switch (parentModelName) {
            case 'Issue':
                return items.filter(item=>{
                    const title = item?.title || ''
                    return title
                        .toLowerCase()
                        .includes(
                            text.toLocaleLowerCase()
                        );
                })
                break;
        
            case 'Template':
                return items.filter(item=>{
                    const title = item?.title || ''
                    return title
                        .toLowerCase()
                        .includes(
                            text.toLocaleLowerCase()
                        );
                })
                break;
            default:
                break;
        }
    }

}

const IssueList = ({
    // profile from where data is retrieved
    selectedProfile,
    parentModelName,
	selectedDict, setSelectedDict, 
	selectedIds,setSelectedIds, multiple
}) => {
	const classes = useStyles();
    let ItemView = <></>
    const [text, setText] = useState('')

	const {
		itemIds,
		itemDict,
		loading,
	} = getData(parentModelName)(selectedProfile);

    const items = itemIds?.length>0? itemIds.map(itemId =>itemDict[itemId]):[]
    const filteredItems = filterItems(text,items, parentModelName)

	const handleToggle = (entity) => {
        const entityId = entity?._id
        const { newDict, idArr } = arrayToReducer([entity])
        var index = selectedIds.indexOf(entityId)
        const isSelected = index !== -1;
        if(isSelected){
            var tempArr = [...selectedIds]
            var removed = tempArr.splice(index,1)
            setSelectedIds(tempArr)
        }else{
            setSelectedIds([...selectedIds,entityId])
            setSelectedDict({
                ...selectedDict,
                ...newDict
            })
        }
	};

	const handleRadioToggle = (entity) => {
        const entityId = entity?._id
		setSelectedIds([entityId]);
        const { newDict, idArr } = arrayToReducer([entity])
        setSelectedDict(newDict)
	};

    switch (parentModelName) {
        case 'Template':
            ItemView = TemplateItem
            break;
    
        case 'Issue':
            ItemView = IssueListItem
            break;

        default:
            break;
    }

    	
	return (
				<List
						dense
						sx={{ width: "100%", bgcolor: "background.paper" }}
					>
						<SearchBar
							text={text}
							setText={setText}
							placeholder={"Search Issues"}
							style={{ margin: 0, width: "100%" }}
						/>

						{loading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<CircularProgress />
							</div>
						) : itemIds.length === 0 ? (
							<Typography
								variant="subtitle1"
								component="div"
								align="center"
							>
								No {parentModelName} Found
							</Typography>
						) : (
							<List
								dense
								sx={{
									width: "100%",
									bgcolor: "background.paper",
								}}
							>
								<>
									{filteredItems.map((entity) => {
                                            const entityId = entity?._id
											return (
                                                <ListItem className={classes.row}>
                                                    <ItemView entity={entity} />
                                    
                                                    {multiple ?(
                                                        <Checkbox
                                                            edge="end"
                                                            onChange={() => handleToggle(entity)}
                                                            checked={selectedIds.indexOf(entityId) !== -1}
                                                            color="primary"
                                                        />
                                                    ): (
                                                        <Radio
                                                            color="primary"
                                                            value={entityId}
                                                            checked={(selectedIds || []).indexOf(entityId) !== -1}
                                                            onChange={() => handleRadioToggle(entityId)}
                                                        />
                                                    ) }
                                            </ListItem>
											);
										})}
								</>
							</List>
						)}
					</List>
			
	);
};

export default IssueList;
