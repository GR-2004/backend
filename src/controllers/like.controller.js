import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//done
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const userId = req.user?._id;
  try {
    if (!videoId?.trim() || !isValidObjectId(videoId)) {
      throw new ApiError(400, "videoId is required or invalid");
    }
    //ensuring if there is the video available to like
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    let isLiking;
    const isLikedAlready = await Like.findOne({
      video: videoId,
      likedBy: req.user?._id,
    });
    if (isLikedAlready) {
      await Like.deleteOne({
        video: isLikedAlready.video,
        likedBy: isLikedAlready.likedBy,
      });
      isLiking = false;
    } else {
      await Like.create({ video: videoId, likedBy: req.user?._id });
      isLiking = true;
    }

    const message = isLiking
      ? "Add like to video success"
      : "Remove like from video success";
    res.status(200).json(new ApiResponse(200, {}, message));
  } catch (e) {
    throw new ApiError(500, e.message || "Something went wrong");
  }
});

//done
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId?.trim() || !isValidObjectId(commentId)) {
    throw new ApiError(400, "commentId is required or invalid");
  }
  //ensuring if there is the comment available to like
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  let isLiking;
  const isLikedAlready = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });
  if (isLikedAlready) {
    await Like.deleteOne({
      comment: isLikedAlready.comment,
      likedBy: isLikedAlready.likedBy,
    });
    isLiking = false;
  } else {
    await Like.create({ comment: commentId, likedBy: req.user?._id });
    isLiking = true;
  }

  const message = isLiking
    ? "Add like to comment success"
    : "Remove like from comment success";
  res.status(200).json(new ApiResponse(200, {}, message));
});

//done
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!tweetId?.trim() || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "TweetID is required or invalid");
  }
  //ensuring if there is the comment available to like
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Comment not found");
  }

  let isLiking;
  const isLikedAlready = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });
  if (isLikedAlready) {
    await Like.deleteOne({
      tweet: isLikedAlready.tweet,
      likedBy: isLikedAlready.likedBy,
    });
    isLiking = false;
  } else {
    await Like.create({ tweet: tweetId, likedBy: req.user?._id });
    isLiking = true;
  }

  const message = isLiking
    ? "Add like to tweet success"
    : "Remove like from tweet success";
  res.status(200).json(new ApiResponse(200, {}, message));
});

//Todo
const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user?._id;
  try {
    const allLiked = await Like.find({
      LikedBy: userId,
      video: { $exists: true }
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { allLiked },
          "all liked videos fetched Successfully"
        )
      );
  } catch (e) {
    throw new ApiError(400, e.message);
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
