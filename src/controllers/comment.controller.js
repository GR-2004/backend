import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query    //if it not in url then the default value is given
    if(!videoId.trim() || !isValidObjectId(videoId)){
        throw new ApiError(404, "Invalid Videoid")
    }

    try {
        const allComments = await Comment.aggregate([
            {
                $match: {
                video: new mongoose.Types.ObjectId(videoId)  //When matching the raw Video id to video id in Database
                },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: parseInt(limit, 10),
            },
        ]);
        return res
        .status(200)
        .json(new ApiResponse(200, { allComments }, "Successfully fetched all comments"));
    } catch (e) {
        throw new ApiError(400, e.message);
    }
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    try {   
        const {content} = req.body
        const userId = req.user?._id
        const {videoId} = req.params
        if(!videoId.trim() || !isValidObjectId(videoId)){
            throw new ApiError(404, "Invalid videoId")
        }
        if(!content) throw new ApiError(400, "Please write comment")
        const addcomment = await Comment.create({
            content,
            owner: new mongoose.Types.ObjectId(userId),
            video: new mongoose.Types.ObjectId(videoId)
        })
        res
        .status(200)
        .json(new ApiResponse(200, addcomment, "comment added successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    try {
        const {commentId} = req.params
        const {content} = req.body
        if(!commentId.trim() || !isValidObjectId(commentId)){
            throw new ApiError(404, "Invalid Objectid")
        }
        if (!content) {
            throw new ApiError(400, "content required!");
        }
        const updatedcomment = await Comment.findByIdAndUpdate(
            commentId,
            {
                content
            },
            {
                new: true  
            }
        )
        if(!updatedcomment){
            throw new ApiError(500, "something went wrong while updating the comment");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, updatedcomment, "comment updated successfully!"))
        
    } catch (error) {
        throw new ApiError(500, `some problems occuring while updating the comment ${error.message}`)
    }

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const {commentId} = req.params
        if(!commentId.trim() || !isValidObjectId(commentId)){
            throw new ApiError(404, "Invalid Objectid")
        }
        await Comment.deleteOne({ _id: commentId });
        res
        .status(200)
        .json(new ApiResponse(200, {}, "comment Deleted successfully"))
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}