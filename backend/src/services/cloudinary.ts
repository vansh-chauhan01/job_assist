import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, 
    api_key: process.env.CLOUDINARY_API_KEY!, 
    api_secret: process.env.CLOUDINARY_API_SECRET!
}); 


export const cloudinaryUpload = async (filePath: string) => {
    try{
        if(!filePath){
            console.log("File path is required for Cloudinary upload.");
            throw new Error("File path is required for Cloudinary upload.");
        }
        const result = await cloudinary.uploader.upload(filePath , {
            resource_type: "raw",
        });
        console.log("Cloudinary upload result:", result.url);
        return result;
    }catch(e){
        fs.unlinkSync(filePath); // Delete the file if upload fails
        console.error("Cloudinary upload error:", e);
        throw e;
    }
}





// cloudinary.uploader
//   .upload("my_image.jpg")
//   .then(result=>console.log(result));




