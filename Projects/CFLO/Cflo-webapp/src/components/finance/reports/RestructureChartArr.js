
export function createTreeDataStructureWithChartWithAllTotal( chartAccounts , parentId = null) {

    if(chartAccounts && chartAccounts.length > 0) {

    const chartAccountTree = [];
    let mainTotal = 0
    let filteredChartAccs;
    if (parentId == null) {
        filteredChartAccs = chartAccounts.filter(chart => chart.parent == undefined || chart.parent == null);
    } else {
        filteredChartAccs = chartAccounts.filter(chart => chart.parent == parentId);
    }

    for (let chart of filteredChartAccs) {

        let curTotal = chart.balance

        let childData = createTreeDataStructureWithChartWithAllTotal(chartAccounts, chart._id)

        curTotal = curTotal + childData.total

        mainTotal = mainTotal + curTotal

        chartAccountTree.push({
            _id: chart._id,
            name: chart.name,
            parentId: chart.parent,
            balance: chart.balance,
            totalAmount : curTotal,
            children: childData.child
        });

    }

    return {
        total : mainTotal,
        child : chartAccountTree
    } 
    }else{
        return {} 
    }
};


export function getTotalAmountChartAccounts(chartAccounts){
    let total = 0
    chartAccounts?.length > 0 && chartAccounts.map((acc)=>{
         total = total + acc.balance
    })
    return total
}

// module.exports = {
//     createTreeDataStructureWithChartWithAllTotal,
//     getTotalAmountChartAccounts
// }