const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const userRegisterSchema = Joi.object({
	email: Joi.string().pattern(emailRegExp).required(),
	password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
	email: Joi.string().pattern(emailRegExp).required(),
	password: Joi.string().min(6).required(),
});

const userUpdateSubscriptionSchema = Joi.object({
	subscription: Joi.string().valid(...subscriptionList).required(),
});

const schemas = {
	userRegisterSchema,
	userLoginSchema,
	userUpdateSubscriptionSchema,
};

const User = model("user", userSchema);

module.exports = {
	User,
	schemas,
};
