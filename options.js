const STORAGE_KEY = "savedFields";

const BKKB_TEMPLATE_FIELDS = {
	name: "",
	name_bn: "",
	father: "",
	father_bn: "",
	mother: "",
	mother_bn: "",
	dob: "",
	nationality: "Bangladeshi",
	religion: "1",
	gender: "Male",
	nid: "1",
	nid_no: "",
	breg: "1",
	breg_no: "",
	passport: "0",
	passport_no: "",
	marital_status: "Single",
	mobile: "",
	confirm_mobile: "",
	email: "",
	quota: "8",
	dep_status: "5",
	present_careof: "",
	present_village: "",
	present_district: "",
	present_upazila: "",
	present_post: "",
	present_postcode: "",
	permanent_careof: "",
	permanent_village: "",
	permanent_district: "",
	permanent_upazila: "",
	permanent_post: "",
	permanent_postcode: "",
	ssc_exam: "",
	ssc_roll: "",
	ssc_group: "",
	ssc_board: "",
	ssc_result_type: "",
	ssc_result: "",
	ssc_year: "",
	hsc_exam: "",
	hsc_roll: "",
	hsc_group: "",
	hsc_board: "",
	hsc_result_type: "",
	hsc_result: "",
	hsc_year: "",
	gra_exam: "",
	gra_institute: "",
	gra_year: "",
	gra_subject: "",
	gra_result_type: "",
	gra_result: "",
	gra_duration: "",
	if_applicable_mas: "",
	captcha: "",
};

const fieldForm = document.getElementById("fieldForm");
const fieldNameInput = document.getElementById("fieldName");
const fieldValueInput = document.getElementById("fieldValue");
const fieldList = document.getElementById("fieldList");
const saveStatus = document.getElementById("saveStatus");
const submitFieldButton = document.getElementById("submitField");
const cancelEditButton = document.getElementById("cancelEdit");
const loadBkkbTemplateButton = document.getElementById("loadBkkbTemplate");
const exportJsonButton = document.getElementById("exportJson");
const importJsonButton = document.getElementById("importJson");
const importFileInput = document.getElementById("importFile");

let editingKey = null;

function normalizeKey(value) {
	return value.trim().replace(/\s+/g, "_").toLowerCase();
}

function normalizeFields(fields) {
	return Object.entries(fields || {}).reduce((accumulator, [key, value]) => {
		const normalizedKey = normalizeKey(key);
		if (normalizedKey) {
			accumulator[normalizedKey] = String(value);
		}
		return accumulator;
	}, {});
}

async function getSavedFields() {
	const stored = await chrome.storage.local.get(STORAGE_KEY);
	return stored[STORAGE_KEY] || {};
}

async function setSavedFields(fields) {
	await chrome.storage.local.set({ [STORAGE_KEY]: normalizeFields(fields) });
}

function resetFormState() {
	editingKey = null;
	submitFieldButton.textContent = "Save Field";
	cancelEditButton.classList.add("hidden");
	fieldNameInput.disabled = false;
	fieldNameInput.focus();
	fieldForm.reset();
}

function startEditingField(key, value) {
	editingKey = key;
	submitFieldButton.textContent = "Update Field";
	cancelEditButton.classList.remove("hidden");
	fieldNameInput.value = key;
	fieldValueInput.value = value;
	fieldNameInput.disabled = true;
	fieldValueInput.focus();
	setStatus(`Editing field: ${key}`);
}

function downloadJson(filename, content) {
	const blob = new Blob([content], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
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

	const actions = document.createElement("div");
	actions.className = "field-item-actions";

	const editBtn = document.createElement("button");
	editBtn.type = "button";
	editBtn.className = "edit-btn";
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () => startEditingField(key, value));

	const deleteBtn = document.createElement("button");
	deleteBtn.type = "button";
	deleteBtn.className = "delete-btn";
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", async () => {
		const fields = await getSavedFields();
		delete fields[key];
		await setSavedFields(fields);
		await renderFieldList();
		if (editingKey === key) {
			resetFormState();
		}
		setStatus(`Deleted field: ${key}`);
	});

	actions.append(editBtn, deleteBtn);
	item.append(title, content, actions);
	return item;
}

async function exportBackup() {
	const fields = await getSavedFields();
	const payload = JSON.stringify(
		{
			version: 1,
			exportedAt: new Date().toISOString(),
			fields,
		},
		null,
		2,
	);
	downloadJson(`smart-form-fill-backup-${Date.now()}.json`, payload);
	setStatus("Backup exported.");
}

async function importBackup(file) {
	if (!file) {
		return;
	}

	const text = await file.text();
	let parsed;

	try {
		parsed = JSON.parse(text);
	} catch {
		setStatus("Invalid JSON file.", true);
		return;
	}

	const importedFields =
		parsed?.fields && typeof parsed.fields === "object"
			? parsed.fields
			: parsed;
	const normalized = normalizeFields(importedFields);

	if (!Object.keys(normalized).length) {
		setStatus("No fields found in import file.", true);
		return;
	}

	await setSavedFields(normalized);
	await renderFieldList();
	resetFormState();
	setStatus(`Imported ${Object.keys(normalized).length} field(s).`);
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
	const wasEditing = Boolean(editingKey);

	if (editingKey && editingKey !== key) {
		setStatus("Field key cannot be changed while editing.", true);
		return;
	}

	fields[key] = value;

	await setSavedFields(fields);
	await renderFieldList();

	resetFormState();
	setStatus(`${wasEditing ? "Updated" : "Saved"} field: ${key}`);
});

cancelEditButton.addEventListener("click", () => {
	resetFormState();
	setStatus("Edit cancelled.");
});

loadBkkbTemplateButton.addEventListener("click", async () => {
	const fields = await getSavedFields();
	const merged = { ...BKKB_TEMPLATE_FIELDS, ...fields };
	await setSavedFields(merged);
	await renderFieldList();
	setStatus(
		"BKKB template added. Edit each field in place, then export a backup.",
	);
});

exportJsonButton.addEventListener("click", () => {
	exportBackup().catch(() => setStatus("Could not export backup.", true));
});

importJsonButton.addEventListener("click", () => {
	importFileInput.click();
});

importFileInput.addEventListener("change", async () => {
	const file = importFileInput.files?.[0];
	importFileInput.value = "";

	if (!file) {
		return;
	}

	await importBackup(file);
});

renderFieldList();
