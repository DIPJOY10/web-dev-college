const Project = require("../models/project.model");
const Profile = require("../models/profile.model");
const File = require("../models/file.model");
const Team = require("../models/team.model");
const TopProjectInfo = require("../models/top.project.info");
const TaskMap = require("../models/task.map.model");
const { create: createWallet } = require("./accounting/wallet.controller");
const _ = require("lodash");
const async = require("async");
const { sampleTask } = require("../controllers/task.controller");
const rePrimary = require("../helpers/property.type");
const { forEach } = require("lodash");
const Doc = require("../models/doc.model");
const ProjectExp = require("../models/projectExp.model");

var imagePath = "https://i.ibb.co/L87QjS5/msproject.png";


const createPublicProject = async (req, res) => {
    try {
        const projectData = req.body;
        const profileId = req.body.createrProfile;
        const projectExpDesc = req.body.projectExpDesc;
        const projectRole = req.body.projectRole;
        const startMonth = req.body.startMonth;
        const startYear = req.body.startYear;
        const endMonth = req.body.endMonth;
        const endYear = req.body.endYear;
        const isCurrentlyWorking = req.body.isCurrentlyWorking;

        const newProjecct = new Project(projectData);

        const newProjectExp = new ProjectExp({
            project: newProjecct._id,
            desc: projectExpDesc,
            role: projectRole,
            startMonth: startMonth,
            startYear: startYear,
            endMonth: endMonth,
            endYear: endYear,
            isCurrentlyWorking: isCurrentlyWorking,
            profile: profileId
        })

        await newProjecct.save();

        await newProjectExp.save();

        const newProjectExpId = newProjectExp._id;

        let updatedProfile = await Profile.findOneAndUpdate({ _id: profileId }, { $push: { projectExp: newProjectExpId } }, { new: true })

        res.json({
            status: 200,
            data: updatedProfile,
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            err: error
        });
    }
};



const addFilesWithProject = async (req, res) => {
    try {
        const docsArr = req.body.docsArr;
        const projectId = req.body.projectId;
        const userProfile = req.body.userProfile;
        const userId = req.body.userId;
        let docObjArr = [];
        let allDocIds = []

        docsArr.map((docData) => {
            let imgId = docData?.image
            let imgArr = [imgId];

            const docObj = new Doc({
                title: docData?.title || "",
                description: docData?.desc || "",
                tag: docData?.tag || "",
                files: imgArr,
                parentModelName: "Project",
                parent: projectId,
                profile: userProfile,
                user: userId
            })

            docObjArr.push(docObj)
            allDocIds.push(docObj._id)
        })

        await Doc.insertMany(docObjArr);

        const updatedProject = await Project.findOneAndUpdate({ _id: projectId }, { $push: { docs: { $each: allDocIds } } }, { new: true })

        res.json({
            status: 200,
            data: updatedProject,
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            err: error
        });
    }
}


const removeFileFromProject = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const docIds = req.body.docIds;

        let updatedProfile = await Project.findByIdAndUpdate(projectId, { $pull: { docs: { $in: docIds } } }, { new: true })

        res.json({
            status: 200,
            data: updatedProfile,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            err: error
        });
    }
}




const shareProject = async (req, res) => {
    try {
        const cloneProjectId = req.body.selectedProjectId;
        const projectExpDesc = req.body.projectExpDesc;
        const userRole = req.body.userRole;
        const startMonth = req.body.startMonth;
        const startYear = req.body.startYear;
        const endMonth = req.body.endMonth;
        const endYear = req.body.endYear;
        const profileId = req.body.userProfile;
        const isCurrentlyWorking = req.body.isCurrentlyWorking;

        const newProjectExp = new ProjectExp({
            project: cloneProjectId,
            desc: projectExpDesc,
            role: userRole,
            startMonth: startMonth,
            startYear: startYear,
            endMonth: endMonth,
            endYear: endYear,
            isCurrentlyWorking: isCurrentlyWorking,
            profile: profileId
        });

        await newProjectExp.save();

        const newProjectExpId = newProjectExp._id;

        let updatedProfile = await Profile.findOneAndUpdate({ _id: profileId }, { "$push": { projectExp: newProjectExpId } }, { new: true })

        res.json({
            status: 200,
            data: updatedProfile,
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            err: error
        });
    }
}


const cloneProject = async (req, res) => {
    try {
        const selectedProjectId = req.body.selectedProjectId;
        const modelId = req.body.modelId;
        const user = req.body.user;
        const userModelName = req.body.userModelName;
        const profileId = req.body.createrProfile;
        const projectExpDesc = req.body.projectExpDesc;
        const projectRole = req.body.userRole;
        const startMonth = req.body.startMonth;
        const startYear = req.body.startYear;
        const endMonth = req.body.endMonth;
        const endYear = req.body.endYear;
        const isCurrentlyWorking = req.body.isCurrentlyWorking

        const projectData = await Project.findById(selectedProjectId)

        const docs = projectData.docs;

        const newProjecct = new Project({
            displayName: projectData?.displayName,
            displayPicture: projectData?.displayPicture,
            description: projectData?.description,
            address: {
                streetAddress: projectData?.address?.streetAddress,
                zip:  projectData?.address?.zip,
                city:  projectData?.address?.city,
                region:  projectData?.address?.region,
                country:  projectData?.address?.country
            },
            category: projectData?.category,
            subCategory: projectData?.subCategory,
            area: projectData?.area,
            year: projectData?.year,
            lotSize: projectData?.lotSize,
            latitude: projectData?.latitude,
            longitude: projectData?.longitude,
            price: projectData?.price,
            docs: docs,
            user: modelId,
            userModelName: userModelName,
            createrProfile: profileId,
            creator: user,
        })

        const newProjectExp = new ProjectExp({
            project: newProjecct._id,
            desc: projectExpDesc,
            role: projectRole,
            startMonth: startMonth,
            startYear: startYear,
            endMonth: endMonth,
            endYear: endYear,
            isCurrentlyWorking: isCurrentlyWorking,
            profile: profileId
        })

        await newProjecct.save();

        await newProjectExp.save();

        const newProjectExpId = newProjectExp._id;

        let updatedProfile = await Profile.findOneAndUpdate({ _id: profileId }, { $push: { projectExp: newProjectExpId } }, { new: true })

        res.json({
            status: 200,
            data: updatedProfile,
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            err: error
        });
    }
}



module.exports = {
    createPublicProject,
    addFilesWithProject,
    removeFileFromProject,
    shareProject,
    cloneProject
};
