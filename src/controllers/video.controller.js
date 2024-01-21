import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"

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
    try {
        if(!isValidObjectId(videoId)){
            throw new ApiError(400, "please insert valid videoId")
        }
        const video = await Video.findOne({
            _id: new mongoose.Types.ObjectId(videoId)
        })
        if(!video){
            throw new ApiError(404, `videoId not found`)
        }
        return res
        .status(200)
        .json(new ApiResponse(200, video, "video fetched successfully"))
    } catch (error) {
        throw new ApiError(500, `something went wrong ${error.message}`)
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    try {
        const {title, description} = req.body
        if([title, description].some((field) => field?.trim() === "")){
            throw new ApiError(400, "all fields are required")
        }
                
        const video = await Video.findByIdAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(videoId)
            }, 
            {
                $set: { 
                    title,
                    description,
                }
                
            },
            {
                new: true
            }
        )
        const oldThumbnailURL = video.thumbnail

        //update new thumbnail and upload on cloudinary
        const thumbnailLocalPath = req.file?.path
        if(!thumbnailLocalPath){
            throw new ApiError(404, "Error: please choose a file")
        }
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(500, "Error: thumbnail file not uploaded on Cloudinary")
        }

        //deleted old thumbnail from cloudinary
        const deletedThumbnail = await deleteFromCloudinary(oldThumbnailURL)
        // if(!deletedThumbnail){
        //     throw new ApiError(500, "Error: old thumbnail not deleted from cloudinary")
        // }

        const updatedVideo = await Video.findByIdAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(videoId)
            }, 
            {
                $set: { 
                    thumbnail: thumbnail.url,
                }            
            },
            {
                new: true
            }
        )

        return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "video updated successfully!"))
    } catch (error) {
        throw new ApiError(500, `something went wrong ${error.message}`)
    }
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