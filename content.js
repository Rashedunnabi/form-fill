const STORAGE_KEY = "savedFields";

const KEYWORD_ALIASES = {
	full_name: ["full name", "fullname", "name", "your name"],
	first_name: ["first name", "firstname", "given name"],
	last_name: ["last name", "lastname", "surname", "family name"],
	email: ["email", "e-mail", "mail"],
	phone: ["phone", "mobile", "telephone", "contact number"],
	address: ["address", "street", "location"],
	city: ["city", "town"],
	state: ["state", "province", "region"],
	zip: ["zip", "postal", "postcode", "pin"],
	country: ["country", "nation"],
	company: ["company", "organization", "organisation", "business"],
	job_title: ["title", "job title", "position", "role"],
};

function getNormalizedText(input = "") {
	return input.toLowerCase().replace(/[_-]+/g, " ").trim();
}

function getElementHint(element) {
	const fromLabel = element.labels
		? Array.from(element.labels)
				.map((label) => label.textContent || "")
				.join(" ")
		: "";

	return getNormalizedText(
		[
			element.name,
			element.id,
			element.placeholder,
			element.getAttribute("aria-label"),
			element.getAttribute("autocomplete"),
			fromLabel,
		]
			.filter(Boolean)
			.join(" "),
	);
}

function getCandidateKeywords(savedKey) {
	const normalized = getNormalizedText(savedKey);
	const aliases = KEYWORD_ALIASES[normalized] || [];
	return [normalized, ...aliases].filter(Boolean);
}

function setValue(element, value) {
	if (element.disabled || element.readOnly) {
		return false;
	}

	const tag = element.tagName.toLowerCase();

	if (tag === "input" || tag === "textarea") {
		element.focus();
		element.value = value;
		element.dispatchEvent(new Event("input", { bubbles: true }));
		element.dispatchEvent(new Event("change", { bubbles: true }));
		return true;
	}

	if (tag === "select") {
		const lowerValue = value.toLowerCase();
		const option = Array.from(element.options).find((opt) => {
			return (
				opt.value.toLowerCase() === lowerValue ||
				opt.textContent.toLowerCase() === lowerValue
			);
		});

		if (!option) {
			return false;
		}

		element.value = option.value;
		element.dispatchEvent(new Event("change", { bubbles: true }));
		return true;
	}

	return false;
}

async function getSavedFields() {
	const stored = await chrome.storage.local.get(STORAGE_KEY);
	return stored[STORAGE_KEY] || {};
}

async function fillSavedFields() {
	const savedFields = await getSavedFields();
	const entries = Object.entries(savedFields);

	if (entries.length === 0) {
		return {
			ok: false,
			message:
				"No saved information found. Add fields in Manage Information.",
		};
	}

	const controls = Array.from(
		document.querySelectorAll("input, textarea, select"),
	);
	let filledCount = 0;

	for (const control of controls) {
		const hint = getElementHint(control);

		if (!hint) {
			continue;
		}

		for (const [savedKey, savedValue] of entries) {
			const keywords = getCandidateKeywords(savedKey);
			const isMatch = keywords.some(
				(keyword) => keyword && hint.includes(keyword),
			);

			if (!isMatch) {
				continue;
			}

			const didSet = setValue(control, savedValue);
			if (didSet) {
				filledCount += 1;
			}
			break;
		}
	}

	return { ok: true, filledCount };
}

function elementText(element) {
	return getNormalizedText(
		element.textContent ||
			element.value ||
			element.getAttribute("aria-label") ||
			"",
	);
}

function isExportTrigger(element) {
	const clickable = element.closest(
		"button, a, [role='button'], input[type='button'], input[type='submit']",
	);
	if (!clickable) {
		return false;
	}

	const text = elementText(clickable);
	return text.includes("export");
}

let isFilling = false;

async function fillIfReady() {
	if (isFilling) {
		return;
	}

	isFilling = true;
	try {
		await fillSavedFields();
	} finally {
		isFilling = false;
	}
}

document.addEventListener(
	"click",
	(event) => {
		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		if (isExportTrigger(target)) {
			fillIfReady();
		}
	},
	true,
);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message?.action !== "fillNow") {
		return;
	}

	fillSavedFields()
		.then((result) => sendResponse(result))
		.catch(() =>
			sendResponse({
				ok: false,
				message: "An unexpected error occurred while filling.",
			}),
		);

	return true;
});
