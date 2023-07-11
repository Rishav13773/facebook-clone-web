const fs = require("fs");
module.exports = function (req, res, next) {
  try {
    if (!req.files || Object.values(req.files).flat() == 0) {
      res.status(400).json("No files found");
    }
    let files = Object.values(req.files).flat();
    files.forEach((file) => {
      //allowing only image type files from req body
      if (file.mimetype !== "image/jpeg") {
        removeTmp(file.tempFilePath);
        res.status(400).json("Unsupported file type");
      }
      if (file.size > 1024 * 1024 * 5) {
        //allowing only files less than 5mb
        removeTmp(file.tempFilePath);
        res.status(400).json("File too large");
      }
    });
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeTmp = (path) => {
  //remove temporary files which are created when files uploaded
  fs.unlink(path, (error) => {
    if (error) {
      throw new Error(error.message);
    }
  });
};
