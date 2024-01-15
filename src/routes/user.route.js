import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser, 
    updateAccountDetails,
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory
} from "../controllers/user.controller.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser) //done
router.route("/refresh-token").post(refreshAccessToken) 
router.route("/change-password").post(verifyJWT, changeCurrentPassword); //done
router.route("/current-user").post(verifyJWT, getCurrentUser); //done
router.route("/update-account").patch(verifyJWT, updateAccountDetails); //done
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar); //done
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage); //done
router.route("/c/:username").get(verifyJWT, getUserChannelProfile); //done
router.route("/history").get(verifyJWT, getWatchHistory) //done

export default router
