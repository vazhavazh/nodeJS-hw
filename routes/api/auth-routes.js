const express = require("express");

const authControllers = require("../../controllers/auth-controllers");

const { schemas } = require("../../models/user");

const { validateBody } = require("../../utils");

const router = express.Router();

// ! signup
router.post(
	"/register",
	validateBody(schemas.userRegisterSchema),
	authControllers.register
);

module.exports = router;

// ! signin
router.post(
	"/login",
	validateBody(schemas.userLoginSchema),
	authControllers.login
);
