import { envs } from '@shopu/config/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
});

export default cloudinary;
