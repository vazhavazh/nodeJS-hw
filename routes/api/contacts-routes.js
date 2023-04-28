const express = require("express");

const contactService = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const router = express.Router();

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
		console.log(result);
		if (!result) {
			throw HttpError(404, `Contact with id = '${id}' not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
 try {
   const result = await contactService.addContact(req.body);
   res.status(201).json(result)
 } catch (error) {
   next(error);
 }
})

// router.delete('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

// router.put('/:contactId', async (req, res, next) => {
//   res.json({ message: 'template message' })
// })

module.exports = router;
