const Blog = require('../models/blog.model')
const Doc = require('../models/doc.model')

const create = async (req, res) => {

    try {

        let blog = new Blog(req.body)
        let doc = new Doc({
            parent: blog._id,
            parentModelName: "Blog"
        })
        blog.paras = [doc._id]
        await blog.save()
        await doc.save()

        res.status(200).json({
            data: {
                ...blog,
                paras: [doc]
            }
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }

}

const addPara = async (req, res) => {

    try {

        const blogId = req.body.blogId;

        const newDoc = new Doc({
            parent: blogId,
            parentModelName: "Blog"
        })

        await newDoc.save()
        const docId = newDoc._id;
        var updateObj = {
            $addToSet: { paras: docId },
        };

        const blog = await Blog.findByIdAndUpdate(blogId, updateObj, { new: true })
            .populate({
                path: "paras",
                populate: {
                    path: 'files'
                }
            })
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })

        res.status(200).json({
            data: blog
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }


}

const removePara = async (req, res) => {

    try {

        const blogId = req.body.blogId;
        const paraId = req.body.paraId;

        var updateObj = {
            $pull: { paras: paraId },
        };

        const blog = await Blog.findByIdAndUpdate(blogId, updateObj, { new: true })
            .populate({
                path: "paras",
                populate: {
                    path: 'files'
                }
            })
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })

        await Doc.findByIdAndDelete(paraId)

        res.status(200).json({
            data: blog
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }

}

const update = async (req, res) => {
    try {
        const blogId = req.body._id
        const blog = await Blog.findByIdAndUpdate(blogId, req.body, { new: true })
            .populate({
                path: "paras",
                populate: {
                    path: 'files'
                }
            })
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })

        res.status(200).json({
            data: blog
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }

}

const deleteBlog = async (req, res) => {

    try {
        const blogId = req.body.blogId

        await Blog.findByIdAndDelete(blogId)

        await Doc.deleteMany({
            parent: blogId,
            parentModelName: "Blog",
        })

        res.status(200).json({
            data: null
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }

}

const getPublicBlogs = async (req, res) => {
    try {

        let blogs = await Blog.find({
            isPublic: true
        })
            .select("title desc isPinUp isPublic profile DPBlog categories")
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "DPBlog",
                model: "File"
            })
            .populate({
                path: "categories",
                model: "Category"
            })

        res.status(200).json({
            data: blogs
        })

    } catch (error) {
        res.status(400).json({
            data: []
        })
    }
}

const getAllAdminBlogs = async (req, res) => {
    try {
        const profileId = req.body.profile
        let blogs = await Blog.find()
            .select("title desc isPinUp isPublic profile DPBlog categories")
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "DPBlog",
                model: "File"
            })
            .populate({
                path: "categories",
                model: "Category"
            })

        res.status(200).json({
            data: blogs
        })
    } catch (error) {
        res.status(400).json({
            data: []
        })
    }
}

const getBlog = async (req, res) => {
    try {
        const blogId = req.body.blogId
        let blog = await Blog.findById(blogId)
            .populate({
                path: "paras",
                populate: {
                    path: 'files'
                }
            })
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "DPBlog",
                model: "File"
            })
            .populate({
                path: "categories",
                model: "Category"
            })
        res.status(200).json({
            data: blog
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        })
    }
}

const blogPinUp = async (req, res) => {
    try {
        const _id = req.body._id;

        const blogs = await Blog.updateMany(
            {
                isPinUp: true,
            },
            {
                $set: {
                    isPinUp: false
                },
            },
            { multi: true });


        const blog = await Blog.findByIdAndUpdate(_id, { isPinUp: true }, { new: true })

        res.json({
            status: 200,
            data: {
                blog,
                blogs
            }
        });

    } catch (err) {
        res.status(400).json({
            data: null,
            err
        })
    }
}

module.exports = {
    create,
    update,
    getAllAdminBlogs,
    getPublicBlogs,
    getBlog,
    deleteBlog,
    addPara,
    removePara,
    blogPinUp
}