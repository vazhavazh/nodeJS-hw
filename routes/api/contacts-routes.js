const { Router } = require("express");

const contactController = require("../../controllers/contact-controller");

const schemas = require("../../schemas/contact-schema");

const { validateBody } = require("../../utils")

const router = Router();



router.get("/", contactController.getAllContacts);

router.get("/:id", contactController.getContactById);

router.post("/", validateBody(schemas.contactAddSchema), contactController.createNewContact);

router.delete("/:id",contactController.deleteContactById);

router.put("/:id", validateBody(schemas.contactAddSchema), contactController.updateContactById);

module.exports = router;
