import express from "express";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import { upload } from "../config/gridfs";

const router = express.Router();

// Init gfs
let gfs: any;
const conn = mongoose.connection;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Upload a file
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

// Get all files metadata
router.get("/files", (req, res) => {
  gfs.files.find().toArray((err: any, files: any) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files exist" });
    }
    res.json(files);
  });
});

// Download file by filename
router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err: any, file: any) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "No file found" });
    }

    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

export default router;
