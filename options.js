const STORAGE_KEY = "savedFields";

const fieldForm = document.getElementById("fieldForm");
const fieldNameInput = document.getElementById("fieldName");
const fieldValueInput = document.getElementById("fieldValue");
const fieldList = document.getElementById("fieldList");
const saveStatus = document.getElementById("saveStatus");

function normalizeKey(value) {
	return value.trim().replace(/\s+/g, "_").toLowerCase();
}

async function getSavedFields() {
	const stored = await chrome.storage.local.get(STORAGE_KEY);
	return stored[STORAGE_KEY] || {};
}

async function setSavedFields(fields) {
	await chrome.storage.local.set({ [STORAGE_KEY]: fields });
}

function setStatus(message, isError = false) {
	saveStatus.textContent = message;
	saveStatus.style.color = isError ? "#9e2a2b" : "#2d5f2e";
}

function createFieldItem(key, value) {
	const item = document.createElement("li");
	item.className = "field-item";

	const title = document.createElement("div");
	title.className = "field-header";
	title.textContent = key;

	const content = document.createElement("div");
	content.className = "field-value";
	content.textContent = value;

	const deleteBtn = document.createElement("button");
	deleteBtn.type = "button";
	deleteBtn.className = "delete-btn";
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", async () => {
		const fields = await getSavedFields();
		delete fields[key];
		await setSavedFields(fields);
		await renderFieldList();
		setStatus(`Deleted field: ${key}`);
	});

	item.append(title, content, deleteBtn);
	return item;
}

async function renderFieldList() {
	const fields = await getSavedFields();
	const entries = Object.entries(fields);

	fieldList.innerHTML = "";

	if (entries.length === 0) {
		const empty = document.createElement("li");
		empty.className = "empty";
		empty.textContent = "No fields saved yet.";
		fieldList.appendChild(empty);
		return;
	}

	entries
		.sort((a, b) => a[0].localeCompare(b[0]))
		.forEach(([key, value]) =>
			fieldList.appendChild(createFieldItem(key, value)),
		);
}

fieldForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const rawName = fieldNameInput.value;
	const value = fieldValueInput.value.trim();

	const key = normalizeKey(rawName);

	if (!key || !value) {
		setStatus("Please enter both a field name and value.", true);
		return;
	}

	const fields = await getSavedFields();
	fields[key] = value;

	await setSavedFields(fields);
	await renderFieldList();

	fieldForm.reset();
	fieldNameInput.focus();
	setStatus(`Saved field: ${key}`);
});

renderFieldList();
