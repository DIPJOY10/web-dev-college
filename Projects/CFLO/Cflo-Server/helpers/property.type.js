const Agricultural = {
    type:['Farms','Ranches','Timberland','Orchards','Vacant Land']
}

const Residential = {
    type : ['Single-Family','Apartment','Condominiums', 'Cooperative', 'Townhouses', 'Duplexes', 'Triple-deckers', 'Quadplexes', 'high-value homes', 'Multi-generational and vacation homes']
}

const Commercial = {
    type : ['Office spaces', 'Shopping centers', 'Malls', 'Stores', 'Entertainment facilities' ,'Hotels','Restaurants', 'Motels', 'Parking Facilities' ]
}

const Industrial = {
    type : ['Manufacturing','Storage and Warehouses','Research & Production']
}

const Special = {
    type : ['Highways','Road','Place of Religion','Schools','Colleges','Universities','Park','Cemeteries']
}

const Mixed = {
    type : []
}

const rePrimary = {
    primary:[
        'Agricultural','Residential','Commercial',
        'Industrial','Special Use','Mixed Use'
    ],
    'Agricultural':Agricultural,
    'Residential':Residential,
    'Commercial':Commercial,   
    'Industrial':Industrial,
    'Special Use':Special,
    'Mixed Use':Mixed

}

module.exports = rePrimary;