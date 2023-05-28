
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { trusted } = require("mongoose");
const { User } = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");
const { controllerWrapper } = require("../utils");
require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, "Email already exist");
	}
	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const verificationCode = nanoid();

	const result = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
		verificationCode
	});

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}"> Click verify email</a>`,
	};

	// await sendEmail(verifyEmail)
	const mailjet = require('node-mailjet')
		.connect('****************************1234', '****************************abcd')
	const request = mailjet
		.post("send", { 'version': 'v3.1' })
		.request({
			"Messages": [
				{
					"From": {
						"Email": "vazhachkimikocha@gmail.com",
						"Name": "Va"
					},
					"To": [
						{
							"Email": "vazhachkimikocha@gmail.com",
							"Name": "Va"
						}
					],
					"Subject": "Greetings from Mailjet.",
					"TextPart": "My first Mailjet email",
					"HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
					"CustomID": "AppGettingStartedTest"
				}
			]
		})
	request
		.then((result) => {
			console.log(result.body)
		})
		.catch((err) => {
			console.log(err.statusCode)
		})


	res.status(201).json({
		email: result.email,
		subscription: result.subscription,
	});
};

const verify = async (req, res) => {
	const { verificationCode } = req.params;
	const user = await User.findOne({ verificationCode });
	if (!user) {
		throw HttpError(404);
	}
	await User.findByIdAndUpdate(user._id, {
		verify: true,
		verificationCode: "",
	});
	res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(404);
	}
	if (user.verify) {
		throw HttpError(400, "Verification has already been passed");
	}
	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}"> Click verify email</a>`,
	};
	await sendEmail(verifyEmail);
	res.json({ message: "Verify email resend" });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user || !user.verify) {
		throw HttpError(401, "Email or password is wrong");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}

	const { _id: id } = user;

	const payload = {
		id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

	await User.findByIdAndUpdate(id, { token });

	res.json({
		token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const getCurrent = async (req, res) => {
	const { name, email } = req.user;

	res.json({
		user: {
			name,
			email,
		},
	});
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });

	res.status(204).json({
		message: "No content",
	});
};

const subscriptionUpdate = async (req, res) => {
	const { _id } = req.user;
	const result = await User.findByIdAndUpdate(_id, req.body, { new: trusted });

	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const avatarsDir = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
	const { path: tempUpload, filename } = req.file;
	const resultUpload = path.join(avatarsDir, filename);
	await fs.rename(tempUpload, resultUpload);
	const avatarURL = path.join("avatars", filename);
	await User.findByIdAndUpdate(req.user._id, { avatarURL });

	res.json({
		avatarURL
	})
};

module.exports = {
	register: controllerWrapper(register),
	verify: controllerWrapper(verify),
	resendVerifyEmail: controllerWrapper(resendVerifyEmail),
	login: controllerWrapper(login),
	getCurrent: controllerWrapper(getCurrent),
	logout: controllerWrapper(logout),
	subscriptionUpdate: controllerWrapper(subscriptionUpdate),
	updateAvatar: controllerWrapper(updateAvatar),
};
