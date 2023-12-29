import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser =  asyncHandler( async (req,res) => {
    
        //Get user details from frontend
        //Validation - not empty
        //check if user already exists: username, email
        //check for images,check for avatar
        //upload them to cloudinary, avatar
        //create user object - create entry in db
        //remove password and refresh token field from reponse
        //check for user creation
        //return res

            const {fullName, userName, email, password} = req.body
            // console.log('email :', email) ;

            if([fullName,userName,email,password].some((field)=>field?.trim() === "")) {
                throw new ApiError(400, "All fields are Required!")
            }

            const existedUser = User.findOne(
                {
                    $or: [{ userName }, { email }]
                }
            )

            if(existedUser){
                throw new ApiError(409, "Email oralready exists")
            }

            const avatarLocalPath = req.files?.avatar[0].path;
            const coverImageLocalPath = req.files?.coverImage[0].path;

            if(!avatarLocalPath){
                throw new ApiError(400, "Avatar file is required!")
            }

            const avatar = await uploadOnCloudinary(avatarLocalPath)
            const coverImage = await uploadOnCloudinary(coverImageLocalPath)

            if(!avatar){
                throw new ApiError(400, "Avatar file is required!")
            }

           const user = await User.create({
                fullName,
                avatar : avatar.url,
                coverImage : coverImage?.url || "",
                email,
                password,
                userName : userName.toLowerCase()

            })

            const createdUser = await User.findById(user._id).select(
                "-password -refreshToken"
            )

            if(!createdUser){
                throw new ApiError(500, "Something went Wrong While registering a User")
            }

            return res.status(201).json(
                new ApiResponse(200,createdUser, "User Registered Successfully")
            )
})

export {registerUser}