import {v2 as cloudinary} from 'cloudinary';
import  fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null;
    
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    //file has been uploaded successfully
    // console.log("file is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temproary file as the upload operation got failed
      return null;
  }
}

const deleteFromCloudinary = async (publicid) => {
    if (!publicid) return "Public id not found";
    // Note: The public ID value for images and videos should not include a file extension. Include the file extension for raw files only.
    const urlArray = publicid.split('/');
    console.log(urlArray)
    const image = urlArray[urlArray.length-1]
    console.log(image)
    const imageName = image.split('.')[0];
    console.log(imageName)

    const deleteResponse = await cloudinary.uploader.destroy(imageName, (error, result) => {
      console.log(error, result)
    })
};

export {uploadOnCloudinary, deleteFromCloudinary};