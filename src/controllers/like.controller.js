import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const userId = req.user?._id;
  try {
    const videoLike = await Like.findOne({
      video: mongoose.Types.ObjectId(videoId),
    });
    if (!videoLike) {
      const createLike = await Like.create({
        LikedBy: mongoose.Types.ObjectId(userId),
        video: mongoose.Types.ObjectId(videoId),
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { createLike }, "video Liked Successfully"));
    } else {
      const removeLike = await Like.deleteMany({
        LikedBy: mongoose.Types.ObjectId(userId),
        video: mongoose.Types.ObjectId(videoId),
      });
      return res
        .status(200)
        .json(
          new ApiResponse(200, { removeLike }, "video DisLiked Successfully")
        );
    }
  } catch (e) {
    throw new ApiError(500, e.message || "Something went wrong");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if(!isValidObjectId(commentId)){
      throw new ApiError(400, "Invalid commentId")
  }
  const userId = req.user?._id;
  try {
    const commentLike = await Like.findOne({
      comment: mongoose.Types.ObjectId(commentId)
    });
    if (!commentLike) {
      const createLike = await Like.create({
          LikedBy: mongoose.Types.ObjectId(userId),
          comment: mongoose.Types.ObjectId(commentId)
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { createLike }, "comment Liked Successfully"));
    } else {
      const removeLike = await Like.deleteMany({
          LikedBy: mongoose.Types.ObjectId(userId),
          comment: mongoose.Types.ObjectId(commentId)
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { removeLike }, "comment DisLiked Successfully"));
    }
  } catch (e) {
    throw new ApiError(500, e.message || "Something went wrong");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId")
    }
    const userId = req.user?._id;
    try {
        const tweetLike = await Like.findOne({
        tweet: mongoose.Types.ObjectId(tweetId)
    });
    if (!tweetLike) {
        const createLike = await Like.create({
            LikedBy: mongoose.Types.ObjectId(userId),
            tweet: mongoose.Types.ObjectId(tweetId)
        });
        return res
        .status(200)
        .json(new ApiResponse(200, { createLike }, "tweet Liked Successfully"));
    } else {
        const removeLike = await Like.deleteMany({
            LikedBy: mongoose.Types.ObjectId(userId),
            tweet: mongoose.Types.ObjectId(tweetId)
        });
        return res
        .status(200)
        .json(new ApiResponse(200, { removeLike }, "tweet DisLiked Successfully"));
    }
    } catch (e) {
    throw new ApiError(500, e.message || "Something went wrong");
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user?._id;
  try {
    const allLiked = await Like.find({
      LikedBy: mongoose.Types.ObjectId(userId),
      video: { $exists: true },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { allLiked }, "all liked videos fetched Successfully"));
  } catch (e) {
    throw new ApiError(400, e.message);
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
