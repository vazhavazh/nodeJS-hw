const express = require("express");

const contactController = require("../../controllers/contact-controller");

const { schemas } = require("../../models/contacts");

const { validateBody } = require("../../utils");

const { authenticate, isValidId } = require("../../middleware");

const router = express.Router();
router.use(authenticate);

router.get("/", contactController.getAllContacts);

router.get("/:id", isValidId, contactController.getContactById);

router.post(
	"/",
	validateBody(schemas.contactAddSchema),
	contactController.createNewContact
);

router.delete("/:id", isValidId, contactController.deleteContactById);

router.put(
	"/:id",
	isValidId,
	validateBody(schemas.contactAddSchema),
	contactController.updateContactById
);

router.patch(
	"/:id/favorite",
	isValidId,
	validateBody(schemas.contactUpdateFavoriteSchema),
	contactController.updateStatusContactById
);

module.exports = router;
