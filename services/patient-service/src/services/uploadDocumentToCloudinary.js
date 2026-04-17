const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadDocumentToCloudinary = (fileBuffer, folder, resourceType = "raw") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadDocumentToCloudinary;