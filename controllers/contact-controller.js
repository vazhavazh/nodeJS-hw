

const contactService = require("../models/contacts-service");

const { HttpError } = require("../helpers");

const { controllerWrapper } = require("../utils");



const getAllContacts = async (req, res) => {
	const result = await contactService.listContacts();

	res.json(result);
};

const getContactById = async (req, res) => {
	const { id } = req.params;
	const result = await contactService.getById(id);

	if (!result) {
		throw HttpError(404, `Contact with id = '${id}' not found`);
	}
	res.json(result);
};

const createNewContact = async (req, res, next) => {
	
	const result = await contactService.addContact(req.body);
	res.status(201).json(result);
};

const deleteContactById = async (req, res, next) => {
	const { id } = req.params;
	const result = await contactService.removeContact(id);

	if (!result) {
		throw HttpError(404, `Contact with id = '${id}' not found`);
	}

	res.json({
		message: "contact deleted",
	});
};

const updateContactById = async (req, res, next) => {
	
	const { id } = req.params;
	const result = await contactService.updateContact(id, req.body);

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
};
