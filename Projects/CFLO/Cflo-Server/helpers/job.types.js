const Legal = {
    subJobs: [  'Real Estate Attorney','Law Firm','Accountant','Accounting Firm']
}

const Appraisal = {
    subJobs: [ 
        'Appraisal - Real Estate','Appraisal - General',
        'Home Inspector',   'Inspection - Roofing',
        'Inspection - Waterproofing','Land Surveyor',
        'Permit Service'
    ]

}

const Builders = {
    subJobs: [ 
        'Residential Builders','Commercial Builders','Green Design','Urban Design','Industrial',
        'Civil Engineer', 'Design-Build Firms','Home Builders','Construction Companies'
    ]
}

const Contractors = {
    subJobs: [ 
        'General Contractor','Masonry, Stonework, Tile Setting, and Plastering','Painting and Paper Hanging','Electrical Work',
        'Plumbing, Heating, and Air-Conditioning (HVAC)','Carpentry and Floor Work','Roofing, Siding, and Sheet Metal Work','Landscape',
        'Concrete Work','Glass and glazing work','Excavation','Demolition','Steel erection','Other'
   ]   
}

const Interior = {
    subJobs: [ 'Interior - Residential','Interior - Commercial','Interior - Feng Shui','Interior - Kitchen','Interior - Bathroom' ] 
}

const Remodeling = {
    subJobs: [ 'Multi-Family Remodeling','Home Remodeling','Restaurant Remodeling','Commercial Remodeling','Office Remodeling','Bathroom Remodeling','Kitchen Remodeling']
}

const Brokerage = {
    subJobs: [ "Buyer's Agent","Seller's (Listing) Agent","Dual Agent","Transaction Coordinator" ] 
}

const PropertyManagement = {
    subJobs: [ 'Residential Property Management','Commercial Property Management','Tenant Management','Cleaning and Maintaince','Security' ]  
}

const Misc = {
    subJobs: ['Photography', 'Moving', 'Storage']
}

const jobPrimary = {
    primaryJobs:[
        'Legal And Tax Professional','Appraisal, surveying and permit','Architect, Engineer and Builders',
        'General and Sub-Contractors','Interior and Decorators','Remodeling and Renovation',
        'Brokerage and Realtors','Home and Property Management','Photography, Moving, storage misc.'
    ],
    'Legal And Tax Professional':Legal,
    'Appraisal, surveying and permit':Appraisal,
    'Architect, Engineer and Builders':Builders,
    'General and Sub-Contractors':Contractors,
    'Interior and Decorators':Interior,
    'Remodeling and Renovation':Remodeling,
    'Brokerage and Realtors':Brokerage,
    'Home and Property Management':PropertyManagement,
    'Photography, Moving, storage misc.':Misc

}

module.exports = jobPrimary;