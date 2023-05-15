const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const { controllerWrapper } = require("../utils");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, "Email already exist");
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const result = await User.create({ ...req.body, password: hashPassword });

	res.status(201).json({
		name: result.name,
		email: result.email,
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		
		throw HttpError(401, "email or password invalid");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "email or password invalid");
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

	res.json({
		token,
		user: {
			name: user.name,
			email: user.email,
		},
	});
};

module.exports = {
	register: controllerWrapper(register),
	login: controllerWrapper(login),
};

