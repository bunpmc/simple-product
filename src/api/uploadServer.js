import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send(`File uploaded successfully! Filename: ${req.file.filename}`);
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
