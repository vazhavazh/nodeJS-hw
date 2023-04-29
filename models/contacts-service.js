const { writeFile, readFile } = require("fs/promises");
const { join } = require("path");
const { nanoid } = require("nanoid");

const contactsPath = join(__dirname, "contacts.json");

const updateContacts = async (contacts) =>
	await writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
	const data = await readFile(contactsPath);
	return JSON.parse(data);
};

const getById = async (id) => {
	const contacts = await listContacts();
	const result = contacts.find((item) => item.id === id);
	return result || null;
};

const removeContact = async (id) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((item) => item.id === id);
	if (index === -1) {
		return null;
	}
	const [result] = contacts.splice(index, 1);
	await updateContacts(contacts);
	return result;
};

const addContact = async ({ name, email, phone }) => {
	const contacts = await listContacts();
	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	};

	contacts.push(newContact);
	await updateContacts(contacts);
	return newContact;
};

const updateContact = async (id, body) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((item) => item.id === id);
	if (index === -1) {
		return null;
	}
	contacts[id] = { id, ...body };
	await updateContacts(contacts);
	return contacts[id];
};

module.exports = {
	listContacts,
	getById,
	removeContact,
	addContact,
	updateContact,
};
