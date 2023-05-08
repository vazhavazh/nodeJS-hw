const { Contact } = require("../models/contacts");

const { HttpError } = require("../helpers");

const { controllerWrapper } = require("../utils");

const getAllContacts = async (req, res) => {
	const result = await Contact.find({}, "-createdAt -updatedAt");

	res.json(result);
};

const getContactById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findById(id);

	if (!result) {
		throw HttpError(404, `Contact with id = '${id}' not found`);
	}
	res.json(result);
};

const createNewContact = async (req, res, next) => {
	const { name, email, phone, favorite = false } = req.body;

	const existingContact = await Contact.findOne({ name, email, phone });
	if (existingContact) {
		throw HttpError(409, ` "Contact with these fields already exists" `);
	}

	const result = await Contact.create({ name, email, phone, favorite });
	res.status(201).json(result);
};

const deleteContactById = async (req, res, next) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndDelete(id);

	if (!result) {
		throw HttpError(404, `Contact with id = '${id}' not found`);
	}

	res.json({
		message: `Contact with id = '${id}' successfully deleted`,
		// result
	});
};

const updateContactById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

	if (!result) {
		throw HttpError(404, `Contact with id = '${id}' not found`);
	}

	res.json(result);
};

const updateStatusContactById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

	if (!result) {
		throw HttpError(404, `Contact with id = '${id}' not found`);
	}

	res.json(result);
};

module.exports = {
	getAllContacts: controllerWrapper(getAllContacts),
	getContactById: controllerWrapper(getContactById),
	createNewContact: controllerWrapper(createNewContact),
	deleteContactById: controllerWrapper(deleteContactById),
	updateContactById: controllerWrapper(updateContactById),
	updateStatusContactById: controllerWrapper(updateStatusContactById),
};
