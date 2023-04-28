const express = require("express");
const Joi = require("joi");

const contactService = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const router = express.Router();

const contactAddSchema = Joi.object({
	name: Joi.string().required().messages({
		"any.required": `missing required "name" field`,
	}),
	email: Joi.string().required().messages({
		"any.required": `missing required "email" field`,
	}),
	phone: Joi.string().required().messages({
		"any.required": `missing required "phone" field`,
	}),
});

router.get("/", async (req, res, next) => {
	try {
		const result = await contactService.listContacts();

		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactService.getById(id);

		if (!result) {
			throw HttpError(404, `Contact with id = '${id}' not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { error } = contactAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const result = await contactService.addContact(req.body);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactService.removeContact(id);

		if (!result) {
			throw HttpError(404, `Contact with id = '${id}' not found`);
		}

		res.json({
			message: "contact deleted",
		});
	} catch (error) {
		next(error);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		const { error } = contactAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}

		const { id } = req.params;
		const result = await contactService.updateContact(id, req.body);

		if (!result) {
			throw HttpError(404, `Contact with id = '${id}' not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
