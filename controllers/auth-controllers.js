const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { controllerWrapper } = require("../utils");
const { trusted } = require("mongoose");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, "Email already exist");
	}
	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const result = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
	});

	res.status(201).json({
		email: result.email,
		subscription: result.subscription,
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
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
	login: controllerWrapper(login),
	getCurrent: controllerWrapper(getCurrent),
	logout: controllerWrapper(logout),
	subscriptionUpdate: controllerWrapper(subscriptionUpdate),
	updateAvatar: controllerWrapper(updateAvatar),
};
