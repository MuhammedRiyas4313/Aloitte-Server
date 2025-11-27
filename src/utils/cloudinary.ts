import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { Config } from '../config';

cloudinary.config({
    cloud_name: Config.CLOUDINARY_CLOUD_NAME!,
    api_key: Config.CLOUDINARY_API_KEY!,
    api_secret: Config.CLOUDINARY_API_SECRET!,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        // Delete local file
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error('Cloudinary upload error:', error);

        // Delete local file even if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};
