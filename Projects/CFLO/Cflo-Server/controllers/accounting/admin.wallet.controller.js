const Team = require('../../models/team.model')
const User = require('../../models/user.model')

const BankAccount = require('../../models/wallet.bank.account.model')

const DwollaBankAccount = require('../../models/wallet.dwolla.BankAccount.model')

const getAdminWallets = async (req, res) => {

    try {

        const userProfileId = req.body.userProfileId

        const userWalletId = req.body.userWalletId
        const secondPartyWalletId = req.body.secondPartyWallet
    
        const totalWalletIds = new Set([secondPartyWalletId, userWalletId])
       

        const orgTeams = await Team.find({ 
            participants:{ $in: [userProfileId]},
            parentModelName:'Organization'
        }).populate('parent')
    
        orgTeams.map(team=>{
            const perm = team.permissions
            const role = perm[userProfileId] 

            if(role == 'Admin' || role == 'Owner'){
                const walletId = team.wallet
                totalWalletIds.add(walletId)
            }
        })

   
        const dwollaBankAccounts = await DwollaBankAccount.find({
            wallet : {$in: Array.from(totalWalletIds) }
        })
    
        res.json({
            status: 200,
            data: dwollaBankAccounts 
        });


        
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        });
    }


}

module.exports = {

}