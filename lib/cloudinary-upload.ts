import { Readable } from "stream";
import cloudinary from "./cloudinary.config";
import { slugify } from "./utils";

type UploadResult = {
  public_id: "cr4mxeqx5zb8rlakpfkg";
  version: 1571218330;
  signature: "63bfbca643baa9c86b7d2921d776628ac83a1b6e";
  width: 864;
  height: 576;
  format: "jpg";
  resource_type: "image";
  created_at: "2017-06-26T19:46:03Z";
  bytes: 120253;
  type: "upload";
  url: "http://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg";
  secure_url: "https://res.cloudinary.com/demo/image/upload/v1571218330/cr4mxeqx5zb8rlakpfkg.jpg";
};

export async function uploadImage(
  file: File,
  fileName?: string,
  pharmacyname?: string,
) {
  try {
    // Convert the file buffer to a Readable stream
    const stream = Readable.from(Buffer.from(await file.arrayBuffer()));

    // Upload the image using a promise-based approach
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "medications",
          use_filename: true,
          unique_filename: false,
          filename_override: slugify(fileName, pharmacyname),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      // Pipe the readable stream to the upload stream
      stream.pipe(uploadStream);
    });

    return uploadResult as UploadResult;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
