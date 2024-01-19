import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const {content} = req.body
        if(!content){
            throw new ApiError(400, "please insert content of tweet")
        }
        const userId = req.user?._id
        const tweet = await Tweet.create({
            content,
            owner: mongoose.Types.ObjectId(userId)
        })
        return res
        .status(200)
        .json(new ApiResponse(200, {tweet}, "tweet created successfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong, while creating a tweet")
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    try {
        const userId = req.user?._id
        const tweet = await Tweet.find({
            owner: mongoose.Types.ObjectId(userId)
        })
        return res
        .status(200)
        .json(new ApiResponse(200, {tweet}, "All tweets fetched successfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong, while fetching all tweets")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    try {
        const tweet = await Tweet.findByIdAndUpdate(
            {
                _id : mongoose.Types.ObjectId(tweetId)
            },
            {
                content
            },
            {
                new: true
            }
        )
        return res
        .status(200)
        .json(new ApiResponse(200,{tweet}, "tweet updated successfully"))
    } catch (error) {
        throw new ApiError(500, `Something went wrong, while updating the tweets ${error.message}`)
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    try {
        const tweet = await Tweet.deleteOne(
            {
                _id : mongoose.Types.ObjectId(tweetId)
            },
        )
        return res
        .status(200)
        .json(new ApiResponse(200, {tweet}, "tweet deleted successfully"))
    } catch (error) {
        throw new ApiError(500, `Something went wrong, while deleting the tweet ${error.message}`)
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}