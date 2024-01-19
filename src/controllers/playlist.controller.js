import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const {name, description} = req.body
    
        if(!name || !description) {
            throw new ApiError(404, "all fields are required!")
        }
        const userId = req.user?._id
    
        //TODO: create playlist
        const createdplaylist = await Playlist.create({
            name,
            description,
            owner: mongoose.Types.ObjectId(userId)
            //because we are creating new playlist so how we have videos
        }) 
        return res
        .status(200)
        .json(new ApiResponse(200, createdplaylist, "new playlist created successfully!"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating playlist")
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(404, "please insert a valid userid")
    }
    try {
        const userPlaylists = await Playlist.find({
            owner: mongoose.Types.ObjectId(userId)
        })
        if(!userPlaylists){
            throw new ApiError(500, "User playlist not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200, userPlaylists, "user playlist fetched successfully"))
    } catch (error) {
        throw new ApiError(500, "something went wrong, while fetching the user playlists!")
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "please insert a valid playlistId")
    }
    try {
        const playlist = await Playlist.findOne({
            _id: mongoose.Types.ObjectId(playlistId)
        })
        if(!playlist){
            throw new ApiError(404, "playlist not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist fetched successfully!"))
    } catch (error) {
        throw new ApiError(500, `something went wrong, while fetching playlist! ${error.message}`)
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "please insert a valid playlistId")
    }
    if(isValidObjectId(videoId)){
        throw new ApiError(400, "please insert a valid videoId")
    }
    try {
        const playlist = await Playlist.findOneAndUpdate(
            { _id: playlistId }, // Filter
            { $push: { videos: mongoose.Types.ObjectId(videoId) } }, // Update
            { new: true } // Optional: Return the modified document
        );
        if(!playlist){
            throw new ApiError(404, `playlist not found ${error.message}`)
        }
        return res
        .status(200)
        .json(new ApiResponse(200, playlist, "video added successfully!"))
    } catch (error) {
        throw new ApiError(500, `something went wrong, while adding the video to existing playlist ${error.message}`)
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(isValidObjectId(playlistId)){
        throw new ApiError(400, "please insert a valid playlistId")
    }
    if(isValidObjectId(videoId)){
        throw new ApiError(400, "please insert a valid videoId")
    }
    try {
        const playlist = await Playlist.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(playlistId) }, // Filter
            { $pull: { videos: mongoose.Types.ObjectId(videoId) } }, // Update
            { new: true } // Optional: Return the modified document
        );
        if(!playlist){
            throw new ApiError(404, `playlist not found ${error.message}`)
        }
        return res
        .status(200)
        .json(new ApiResponse(200, playlist, "video removed successfully!"))
    } catch (error) {
        throw new ApiError(500, `something went wrong, while removing the video from existing playlist ${error.message}`)
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "please insert a valid playlistId")
    }
    try {
        const playlist = await Playlist.deleteOne(
            { _id: mongoose.Types.ObjectId(playlistId) }, // Filter
        );
        if(!playlist){
            throw new ApiError(404, `playlist not found ${error.message}`)
        }
        return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist deleted successfully!"))
    } catch (error) {
        throw new ApiError(500, `something went wrong, while deleting the playlist ${error.message}`)
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!name || !description){
        throw new ApiError(400, "all fields are required!")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "please insert a valid playlistId")
    }
    try {
        const playlist = await Playlist.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(playlistId) }, // Filter
            {
                name,
                description,        // update
            },
            {
                new: true // Optional: Return the modified document
            }
        );
        if(!playlist){
            throw new ApiError(404, `playlist not found ${error.message}`)
        }
        return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist updated successfully!"))
    } catch (error) {
        throw new ApiError(500, `something went wrong, while updating the playlist ${error.message}`)
    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}