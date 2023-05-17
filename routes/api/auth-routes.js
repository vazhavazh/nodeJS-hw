const express = require("express");

const authControllers = require("../../controllers/auth-controllers");

const { schemas } = require("../../models/user");

const { validateBody } = require("../../utils");

const { authenticate } = require("../../middleware");

const router = express.Router();

// ! signup
router.post(
	"/register",
	validateBody(schemas.userRegisterSchema),
	authControllers.register
);

// ! sign in
router.post(
	"/login",
	validateBody(schemas.userLoginSchema),
	authControllers.login
);

router.get("/current", authenticate, authControllers.getCurrent);

router.post("/logout", authenticate, authControllers.logout);

router.patch("/users", authenticate,
	validateBody(schemas.userUpdateSubscriptionSchema),
	authControllers.subscriptionUpdate);

module.exports = router;
