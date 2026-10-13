"use strict";

function updatePressDownloads() {
	document.querySelectorAll("[data-press-text]").forEach((link) => {
		link.href = `assets/press/texts/press-kit-${currentLanguage}.txt`;
	});
	document.querySelectorAll("[data-press-trailer]").forEach((link) => {
		link.href = locales[currentLanguage].video;
	});
	document.querySelectorAll("[data-press-image]").forEach((element) => {
		const language = currentLanguage === "en" ? "en" : "pt";
		const file = `assets/press/${element.dataset.pressImage}-${language}.png`;
		if (element.tagName === "IMG") element.src = file;
		else element.href = file;
	});
	document.querySelectorAll("[data-copy]").forEach((button) => { button.textContent = translate("press.copy"); });
	document.querySelector(".press-status").textContent = "";
}

document.addEventListener("ronrons:language", updatePressDownloads);
document.querySelectorAll("[data-copy]").forEach((button) => {
	button.hidden = !navigator.clipboard?.writeText;
	button.addEventListener("click", async () => {
		const text = document.getElementById(button.dataset.copy).textContent.trim();
		try {
			await navigator.clipboard.writeText(text);
			document.querySelector(".press-status").textContent = translate("press.copied");
		} catch {
			document.querySelector(".press-status").textContent = translate("press.copyFailed");
		}
	});
});
updatePressDownloads();
