import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: "dvuzzneet",
    api_key: "146585654119492",
    api_secret: "zda4mZC00XSOr9aUqnDIL8QPj6k"
})

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'cap'
    }
})