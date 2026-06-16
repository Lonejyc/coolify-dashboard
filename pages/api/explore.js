// pages/api/explore.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const directoryPath = path.join(process.cwd(), "public"); // Modifier selon le dossier cible

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to scan directory" });
    }
    res.status(200).json({ files });
  });
}
