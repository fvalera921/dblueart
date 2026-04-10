import { v2 as cloudinary } from "cloudinary";

const isConfiguredValue = (value: string | undefined) =>
  Boolean(value && !value.startsWith("tu-") && !value.includes("xxxxx"));

export const hasCloudinaryConfig =
  isConfiguredValue(process.env.CLOUDINARY_CLOUD_NAME) &&
  isConfiguredValue(process.env.CLOUDINARY_API_KEY) &&
  isConfiguredValue(process.env.CLOUDINARY_API_SECRET);

export const cloudinaryUploadPreset = isConfiguredValue(process.env.CLOUDINARY_UPLOAD_PRESET)
  ? process.env.CLOUDINARY_UPLOAD_PRESET
  : undefined;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export { cloudinary };
