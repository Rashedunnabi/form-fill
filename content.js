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

const BKKB_FIELD_ORDER = [
	"name",
	"name_bn",
	"father",
	"father_bn",
	"mother",
	"mother_bn",
	"dob",
	"nationality",
	"religion",
	"gender",
	"nid",
	"nid_no",
	"breg",
	"breg_no",
	"passport",
	"passport_no",
	"marital_status",
	"mobile",
	"confirm_mobile",
	"email",
	"quota",
	"dep_status",
	"present_careof",
	"present_village",
	"present_district",
	"present_upazila",
	"present_post",
	"present_postcode",
	"permanent_careof",
	"permanent_village",
	"permanent_district",
	"permanent_upazila",
	"permanent_post",
	"permanent_postcode",
	"ssc_exam",
	"ssc_roll",
	"ssc_group",
	"ssc_board",
	"ssc_result_type",
	"ssc_result",
	"ssc_year",
	"hsc_exam",
	"hsc_roll",
	"hsc_group",
	"hsc_board",
	"hsc_result_type",
	"hsc_result",
	"hsc_year",
	"gra_exam",
	"gra_institute",
	"gra_year",
	"gra_subject",
	"gra_result_type",
	"gra_result",
	"gra_duration",
	"if_applicable_mas",
	"captcha",
];

const BKKB_SELECTORS = {
	name: ["#name", "input[name='name']"],
	name_bn: ["#name_bn", "input[name='name_bn']"],
	father: ["#father", "input[name='father']"],
	father_bn: ["#father_bn", "input[name='father_bn']"],
	mother: ["#mother", "input[name='mother']"],
	mother_bn: ["#mother_bn", "input[name='mother_bn']"],
	dob: ["#dob", "input[name='dob']"],
	nationality: ["#nationality", "select[name='nationality']"],
	religion: ["#religion", "select[name='religion']"],
	gender: ["#gender", "select[name='gender']"],
	nid: ["#nid", "select[name='nid']"],
	nid_no: ["#nid_no", "input[name='nid_no']"],
	breg: ["#breg", "select[name='breg']"],
	breg_no: ["#breg_no", "input[name='breg_no']"],
	passport: ["#passport", "select[name='passport']"],
	passport_no: ["#passport_no", "input[name='passport_no']"],
	marital_status: ["#marital_status", "select[name='marital_status']"],
	mobile: ["#mobile", "input[name='mobile']"],
	confirm_mobile: ["#confirm_mobile", "input[name='confirm_mobile']"],
	email: ["#email", "input[name='email']"],
	quota: ["#quota", "select[name='quota']"],
	dep_status: ["#dep_status", "select[name='dep_status']"],
	present_careof: ["#present_careof", "input[name='present_careof']"],
	present_village: ["#present_village", "textarea[name='present_village']"],
	present_district: ["#present_district", "select[name='present_district']"],
	present_upazila: ["#present_upazila", "select[name='present_upazila']"],
	present_post: ["#present_post", "input[name='present_post']"],
	present_postcode: ["#present_postcode", "input[name='present_postcode']"],
	permanent_careof: ["#permanent_careof", "input[name='permanent_careof']"],
	permanent_village: [
		"#permanent_village",
		"textarea[name='permanent_village']",
	],
	permanent_district: [
		"#permanent_district",
		"select[name='permanent_district']",
	],
	permanent_upazila: [
		"#permanent_upazila",
		"select[name='permanent_upazila']",
	],
	permanent_post: ["#permanent_post", "input[name='permanent_post']"],
	permanent_postcode: [
		"#permanent_postcode",
		"input[name='permanent_postcode']",
	],
	ssc_exam: ["#ssc_exam", "select[name='ssc_exam']"],
	ssc_roll: ["#ssc_roll", "input[name='ssc_roll']"],
	ssc_group: ["#ssc_group", "select[name='ssc_group']"],
	ssc_board: ["#ssc_board", "select[name='ssc_board']"],
	ssc_result_type: ["#ssc_result_type", "select[name='ssc_result_type']"],
	ssc_result: ["#ssc_result", "input[name='ssc_result']"],
	ssc_year: ["#ssc_year", "select[name='ssc_year']"],
	hsc_exam: ["#hsc_exam", "select[name='hsc_exam']"],
	hsc_roll: ["#hsc_roll", "input[name='hsc_roll']"],
	hsc_group: ["#hsc_group", "select[name='hsc_group']"],
	hsc_board: ["#hsc_board", "select[name='hsc_board']"],
	hsc_result_type: ["#hsc_result_type", "select[name='hsc_result_type']"],
	hsc_result: ["#hsc_result", "input[name='hsc_result']"],
	hsc_year: ["#hsc_year", "select[name='hsc_year']"],
	gra_exam: ["#gra_exam", "select[name='gra_exam']"],
	gra_institute: ["#gra_institute", "select[name='gra_institute']"],
	gra_year: ["#gra_year", "select[name='gra_year']"],
	gra_subject: ["#gra_subject", "select[name='gra_subject']"],
	gra_result_type: ["#gra_result_type", "select[name='gra_result_type']"],
	gra_result: ["#gra_result", "input[name='gra_result']"],
	gra_duration: ["#gra_duration", "select[name='gra_duration']"],
	if_applicable_mas: [
		"#if_applicable_mas",
		"input[name='if_applicable_mas']",
	],
	captcha: ["#captcha", "input[name='captcha']"],
};

const SITE_PROFILES = [
	{
		id: "bkkb",
		matches() {
			return (
				document.querySelector("#applicationForm") !== null ||
				/BKKB|Bangladesh Employees Welfare Board/i.test(
					document.title,
				) ||
				/BKKB|Bangladesh Employees Welfare Board/i.test(
					document.body?.textContent || "",
				)
			);
		},
		fieldOrder: BKKB_FIELD_ORDER,
		fieldSelectors: BKKB_SELECTORS,
	},
];

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

function getNormalizedKeywords(value) {
	return getNormalizedText(value).split(/\s+/).filter(Boolean);
}

function getCandidateKeywords(savedKey) {
	const normalized = getNormalizedText(savedKey);
	const aliases = KEYWORD_ALIASES[normalized] || [];
	return [normalized, ...aliases, ...getNormalizedKeywords(savedKey)].filter(
		Boolean,
	);
}

function findSelectableOption(element, value) {
	const lowered = String(value).toLowerCase().trim();
	const normalized = getNormalizedText(value);

	return Array.from(element.options).find((option) => {
		const optionValue = String(option.value).toLowerCase().trim();
		const optionText = getNormalizedText(option.textContent || "");
		return (
			optionValue === lowered ||
			optionText === normalized ||
			optionText.includes(normalized) ||
			normalized.includes(optionText)
		);
	});
}

function setNativeValue(element, value) {
	const valueSetter = Object.getOwnPropertyDescriptor(
		window.HTMLInputElement.prototype,
		"value",
	)?.set;
	const textareaSetter = Object.getOwnPropertyDescriptor(
		window.HTMLTextAreaElement.prototype,
		"value",
	)?.set;

	if (element.tagName.toLowerCase() === "textarea" && textareaSetter) {
		textareaSetter.call(element, value);
		return;
	}

	if (valueSetter) {
		valueSetter.call(element, value);
		return;
	}

	element.value = value;
}

function setValue(element, value) {
	if (element.disabled || element.readOnly) {
		return false;
	}

	const tag = element.tagName.toLowerCase();
	const type = (element.type || "").toLowerCase();

	if (type === "checkbox") {
		const shouldCheck = ["1", "true", "yes", "on", "checked"].includes(
			String(value).toLowerCase().trim(),
		);
		element.checked = shouldCheck;
		element.dispatchEvent(new Event("input", { bubbles: true }));
		element.dispatchEvent(new Event("change", { bubbles: true }));
		return shouldCheck;
	}

	if (type === "radio") {
		const isMatch =
			String(element.value).toLowerCase().trim() ===
			String(value).toLowerCase().trim();
		if (isMatch) {
			element.checked = true;
			element.dispatchEvent(new Event("input", { bubbles: true }));
			element.dispatchEvent(new Event("change", { bubbles: true }));
		}
		return isMatch;
	}

	if (tag === "input" || tag === "textarea") {
		element.focus();
		setNativeValue(element, value);
		element.dispatchEvent(new Event("input", { bubbles: true }));
		element.dispatchEvent(new Event("change", { bubbles: true }));
		return true;
	}

	if (tag === "select") {
		const option = findSelectableOption(element, value);

		if (!option) {
			return false;
		}

		element.value = option.value;
		element.dispatchEvent(new Event("change", { bubbles: true }));
		return true;
	}

	return false;
}

function isSiteProfile(profileId) {
	return SITE_PROFILES.find((profile) => profile.id === profileId);
}

function getActiveProfile() {
	return SITE_PROFILES.find((profile) => profile.matches()) || null;
}

function collectControls() {
	return Array.from(document.querySelectorAll("input, textarea, select"));
}

function setControlBySelector(selector, value) {
	const element = document.querySelector(selector);
	if (!element) {
		return false;
	}

	return setValue(element, value);
}

function fillByProfile(savedFields, profile, filledElements) {
	let filledCount = 0;
	let changed = false;

	for (const key of profile.fieldOrder) {
		if (!(key in savedFields)) {
			continue;
		}

		const value = savedFields[key];
		if (value === undefined || value === null || value === "") {
			continue;
		}

		const selectors = profile.fieldSelectors[key] || [];
		let didSet = false;

		for (const selector of selectors) {
			const element = document.querySelector(selector);
			if (!element) {
				continue;
			}

			if (filledElements.has(element)) {
				didSet = true;
				break;
			}

			didSet = setValue(element, value);
			if (didSet) {
				filledElements.add(element);
				filledCount += 1;
				changed = true;
				break;
			}
		}
	}

	return { filledCount, changed };
}

function fillByHeuristics(savedFields, filledElements) {
	const controls = collectControls();
	let filledCount = 0;
	let changed = false;

	for (const control of controls) {
		if (filledElements.has(control)) {
			continue;
		}

		const hint = getElementHint(control);

		if (!hint) {
			continue;
		}

		for (const [savedKey, savedValue] of Object.entries(savedFields)) {
			const keywords = getCandidateKeywords(savedKey);
			const isMatch = keywords.some(
				(keyword) => keyword && hint.includes(keyword),
			);

			if (!isMatch) {
				continue;
			}

			const didSet = setValue(control, savedValue);
			if (didSet) {
				filledElements.add(control);
				filledCount += 1;
				changed = true;
			}
			break;
		}
	}

	return { filledCount, changed };
}

async function getSavedFields() {
	const stored = await chrome.storage.local.get(STORAGE_KEY);
	return stored[STORAGE_KEY] || {};
}

async function fillSavedFields() {
	const savedFields = await getSavedFields();

	if (Object.keys(savedFields).length === 0) {
		return {
			ok: false,
			message:
				"No saved information found. Add fields in Manage Information.",
		};
	}

	const profile = getActiveProfile();
	let filledCount = 0;
	let changed = false;
	const filledElements = new WeakSet();

	for (let pass = 0; pass < 3; pass += 1) {
		if (profile) {
			const profileResult = fillByProfile(
				savedFields,
				profile,
				filledElements,
			);
			filledCount += profileResult.filledCount;
			changed = changed || profileResult.changed;
		}

		const heuristicResult = fillByHeuristics(savedFields, filledElements);
		filledCount += heuristicResult.filledCount;
		changed = changed || heuristicResult.changed;

		if (!changed) {
			break;
		}

		await new Promise((resolve) => window.setTimeout(resolve, 50));
		changed = false;
	}

	if (profile?.id === "bkkb") {
		const captchaField = document.querySelector("#captcha");
		if (captchaField && !String(captchaField.value || "").trim()) {
			captchaField.focus();
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
	return text.includes("export") || text.includes("fill now");
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
