const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helpers");

const isValidId = (req, res, next) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		throw HttpError(404, `id = '${id}' is not valid`);
	}
	next();
};

module.exports = isValidId;
