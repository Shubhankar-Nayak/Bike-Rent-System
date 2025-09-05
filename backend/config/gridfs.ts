import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

const mongoURI = process.env.ATLAS_URI || "mongodb://localhost:27017/bikerental";

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads",
    };
  },
});

export const upload = multer({ storage: storage as any });
