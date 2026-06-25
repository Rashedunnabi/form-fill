const statusEl = document.getElementById("status");

function setStatus(message, isError = false) {
	statusEl.textContent = message;
	statusEl.style.color = isError ? "#8b1e1e" : "#3f3f3f";
}

document.getElementById("openOptions").addEventListener("click", () => {
	chrome.runtime.openOptionsPage();
});

document.getElementById("fillNow").addEventListener("click", async () => {
	try {
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});

		if (!tab || !tab.id) {
			setStatus("No active tab found.", true);
			return;
		}

		const response = await chrome.tabs.sendMessage(tab.id, {
			action: "fillNow",
		});

		if (!response) {
			setStatus("Open a website page, then try again.", true);
			return;
		}

		if (response.ok) {
			setStatus(`Filled ${response.filledCount} field(s).`);
		} else {
			setStatus(response.message || "Could not fill this page.", true);
		}
	} catch (error) {
		setStatus("Could not connect to this tab.", true);
	}
});
