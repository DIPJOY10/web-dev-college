import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { createTreeDataStructureWithChartWithAllTotal } from './RestructureChartArr';



const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: "100%",
    },
});

export default function CreateTreeViewOfChartAccounts(props) {
    const { chartAccounts, mainLabel, forPrint } = props;
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const { root } = classes;

    const [chartAccs, setChartAccs] = useState(null)
    const [allIds, setAllIds] = useState([])

    useEffect(() => {
        const restructuredData = createTreeDataStructureWithChartWithAllTotal(chartAccounts)
        setChartAccs(restructuredData)

        let rootID = `${mainLabel}${restructuredData?.total}`

        if (restructuredData !== undefined && !allIds.includes(rootID)) {
            let newAllIds = [...allIds, rootID]
            setAllIds(newAllIds)
        }

        console.log(restructuredData)

    }, [chartAccounts]);

    // working

    const renderCategories = (categories) => {
        let myCategories = [];
        let ids = [];
        categories.length > 0 && categories.map((category, i) => {

            ids.push(`${category.name}${i}`)

            myCategories.push(
                (category?.balance !== 0 || category.children.length > 0) &&
                (<TreeItem key={`${category.name}${i}`} nodeId={`${category.name}${i}`} label={
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                        <div>{category?.name}</div>
                        <div>${category?.balance?.toFixed(2)}</div>
                    </div>}>
                    {category && category.children.length > 0 ? renderCategories(category.children) : null}
                </TreeItem>)
            );

            if (category && category.children.length > 0) {

                ids.push(`${category.name} Total ${category.totalAmount}`)

                myCategories.push(
                    <TreeItem key={`${category.name} Total ${category.totalAmount}`} nodeId={`${category.name} Total ${category.totalAmount}`} label={
                        <div style={{ width: "100%", fontWeight: "bold", display: "flex", justifyContent: "space-between" }} >
                            <div>{`Total ${category?.name}`}</div>
                            <div>${category?.totalAmount?.toFixed(2)}</div>
                        </div>}>
                    </TreeItem>
                );

            }

        })

        if (ids.length > 0 && !allIds.includes(ids[0])) {
            let newAllIds = [...allIds, ...ids]
            setAllIds(newAllIds)
        }
        return myCategories
    }

    return (
        <>
            {forPrint ? (
                <TreeView
                    className={classes.root}
                    defaultExpanded={['3']}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                    style={{ marginBottom: "5px" }}
                    expanded={allIds}
                >
                    <TreeItem nodeId={`${mainLabel}${chartAccs?.total}`} label={
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                            <div>{mainLabel}</div>
                            <div>${chartAccs?.total?.toFixed(2)}</div>
                        </div>}>
                        {chartAccs && chartAccs?.child?.length > 0 ? renderCategories(chartAccs.child) : null}
                    </TreeItem>
                </TreeView>
            ) : (
                <TreeView
                    className={classes.root}
                    defaultExpanded={['3']}
                    defaultCollapseIcon={<ArrowDropDownIcon />}
                    defaultExpandIcon={<ArrowRightIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                    style={{ marginBottom: "5px" }}
                >
                    <TreeItem nodeId={`${mainLabel}${chartAccs?.total}`} label={
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                            <div>{mainLabel}</div>
                            <div>${chartAccs?.total?.toFixed(2)}</div>
                        </div>}>
                        {chartAccs && chartAccs?.child?.length > 0 ? renderCategories(chartAccs.child) : null}
                    </TreeItem>
                </TreeView>
            )}
        </> 
    );
}
