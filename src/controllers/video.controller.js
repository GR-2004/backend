import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    try {
        if([title, description].some((field) => field?.trim() === "")){
            throw new ApiError(404, "All fields are required")
        }
        const userId = req.user?._id
    
        const videoFileLocalPath = req.files?.videoFile[0]?.path;
        if(!videoFileLocalPath){
            throw new ApiError(400, "videoFile is required")
        }
        
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
        if(!thumbnailLocalPath){
            throw new ApiError(400, "thumbnail is required")
        }
    
        const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    
        if(!videoFile){
            throw new ApiError(500, "Error: videoFile file not uploaded on Cloudinary")
        }
        if(!thumbnail){
            throw new ApiError(500, "Error: thumbnail file not uploaded on Cloudinary")
        }
    
        const video = await Video.create({
            owner: new mongoose.Types.ObjectId(userId),
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnail?.url,
            duration: videoFile.duration.toPrecision(3)
        })
    
        if(!video){
            throw new ApiError(500, "Something went wrong while publishing a video");
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, video, "video published successfully")
        )
    } catch (error) {
        throw new ApiError(500, `something went wrong ${error.message}`);
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}