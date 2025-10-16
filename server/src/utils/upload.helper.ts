import cloudinary from "../config/cloudinary";
import { UploadedFilesArray, UploadedSingleFile } from "../types/multer";

// Upload Single
export const uploadToCloudinary = async (file: UploadedSingleFile, folder_name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder_name,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    ).end(file.buffer);
  });
};

// Upload Multiple
export const uploadMultipleToCloudinary = async (files: UploadedFilesArray, folder_name: string): Promise<string[]> => {
  return Promise.all(files.map(file => uploadToCloudinary(file, folder_name)));
};

// Extract Cloudinary Public ID from URL
const extractPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const fileName = parts.pop()!;               // abc123.jpg
    const folder = parts.pop()!;                 // products
    return `${folder}/${fileName.split(".")[0]}`; // products/abc123
  } catch {
    return null;
  }
};

// Delete Single Image by URL
export const deleteCloudinaryImage = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

// Delete Multiple Images
export const deleteMultipleCloudinaryImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => deleteCloudinaryImage(url)));
};
