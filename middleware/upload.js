const multer = require("multer");
const path = require("path");
const {HttpError} = require("../helpers")

const tempDir = path.resolve("temp");

const multerConfig = multer.diskStorage({
	destination: tempDir,
	filename: (req, file, cb) => {
		const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${uniquePrefix}_${file.originalname}`);
	},
});

const imageFileFilter = (req, file, cb) => {
	if (
		file.mimetype.startsWith("image/jpeg") ||
		file.mimetype.startsWith("image/png")
	) {
		cb(null, true);
	} else {
		cb(HttpError(400, "Only JPEG and PNG images are allowed"));
	}
};

const upload = multer({
	storage: multerConfig,
	limits: {
		fileSize: 3 * (1024 * 1024),
	},
	fileFilter: imageFileFilter,
});

module.exports = upload;
