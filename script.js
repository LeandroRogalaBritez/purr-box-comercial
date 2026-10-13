"use strict";

const { locales, strings } = window.RONRONS_I18N;
const config = window.RONRONS_CONFIG || {};
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const languageSelect = document.querySelector("#language-select");
const lightbox = document.querySelector(".lightbox");
const gallery = Array.from(document.querySelectorAll("[data-gallery]"));
const languageStorageKey = "ronrons.language";
let currentMode = "room";
let currentImage = 0;
let galleryTrigger = null;

function supportedLanguage(value) {
	const code = String(value || "").toLowerCase().split(/[-_]/)[0];
	return Object.hasOwn(locales, code) ? code : null;
}

function initialLanguage() {
	const fromUrl = supportedLanguage(new URLSearchParams(window.location.search).get("lang"));
	if (fromUrl) return fromUrl;
	try {
		const saved = supportedLanguage(window.localStorage.getItem(languageStorageKey));
		if (saved) return saved;
	} catch {
		// O seletor funciona mesmo com armazenamento bloqueado.
	}
	for (const language of navigator.languages || [navigator.language]) {
		const supported = supportedLanguage(language);
		if (supported) return supported;
	}
	return "pt";
}

let currentLanguage = initialLanguage();

function translate(key) {
	const entry = strings[key];
	return entry ? entry[locales[currentLanguage].index] || entry[0] : key;
}

function updateMenuLabel() {
	const open = navigation.classList.contains("open");
	menuToggle.setAttribute("aria-expanded", String(open));
	menuToggle.setAttribute("aria-label", translate(open ? "menu.close" : "menu.open"));
}

function closeMenu() {
	navigation.classList.remove("open");
	updateMenuLabel();
}

menuToggle.addEventListener("click", () => {
	navigation.classList.toggle("open");
	updateMenuLabel();
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && navigation.classList.contains("open")) {
		closeMenu();
		menuToggle.focus();
	}
});

function updateStoreLinks() {
	let storeUrl = null;
	try {
		const url = new URL(config.storeUrl);
		if (url.protocol === "https:") storeUrl = url.href;
	} catch {
		// Sem uma URL oficial válida, os botões levam ao trailer.
	}
	document.querySelectorAll("[data-store-link]").forEach((link) => {
		if (storeUrl) {
			link.href = storeUrl;
			const customLabel = typeof config.storeLabel === "string" ? config.storeLabel : config.storeLabel?.[currentLanguage];
			link.textContent = customLabel || translate("cta.wishlist");
			link.target = "_blank";
			link.rel = "noopener noreferrer";
		} else {
			link.href = "#trailer";
			link.textContent = translate(link.dataset.storeLabel);
			link.removeAttribute("target");
			link.removeAttribute("rel");
		}
	});
}

const modeImages = { room: "assets/screenshot-room.png", desktop: "assets/screenshot-desktop.png" };

function renderMode() {
	if (!document.querySelector("#mode-image")) return;
	document.querySelectorAll("[data-mode]").forEach((button) => {
		const active = button.dataset.mode === currentMode;
		button.classList.toggle("active", active);
		button.setAttribute("aria-pressed", String(active));
	});
	const image = document.querySelector("#mode-image");
	image.src = modeImages[currentMode];
	image.alt = translate(`mode.${currentMode}.alt`);
	document.querySelector("#mode-caption").textContent = translate(`mode.${currentMode}.caption`);
	const description = document.querySelector("#mode-description");
	description.querySelector(".number-label").textContent = translate(`mode.${currentMode}.label`);
	const lines = translate(`mode.${currentMode}.title`).split("\n");
	description.querySelector("h3").replaceChildren(document.createTextNode(lines[0]), document.createElement("br"), document.createTextNode(lines[1]));
	description.querySelector("p").textContent = translate(`mode.${currentMode}.text`);
}

document.querySelectorAll("[data-mode]").forEach((button) => {
	button.addEventListener("click", () => {
		currentMode = button.dataset.mode;
		renderMode();
	});
});

function showImage(index) {
	currentImage = (index + gallery.length) % gallery.length;
	const item = gallery[currentImage];
	const image = document.querySelector("#lightbox-image");
	image.src = item.href;
	image.alt = item.querySelector("img").alt;
	document.querySelector("#lightbox-caption").textContent = `${currentImage + 1} / ${gallery.length} · ${image.alt}`;
}

gallery.forEach((item, index) => {
	item.addEventListener("click", (event) => {
		if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof lightbox.showModal !== "function") return;
		event.preventDefault();
		galleryTrigger = item;
		showImage(index);
		lightbox.showModal();
		document.body.classList.add("modal-open");
	});
});
document.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentImage - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentImage + 1));
lightbox.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
		event.preventDefault();
		showImage(currentImage + (event.key === "ArrowLeft" ? -1 : 1));
	}
});
lightbox.addEventListener("click", (event) => {
	const bounds = lightbox.getBoundingClientRect();
	if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
});
lightbox.addEventListener("close", () => {
	document.body.classList.remove("modal-open");
	if (galleryTrigger) galleryTrigger.focus({ preventScroll: true });
});

function applyLanguage(language) {
	currentLanguage = supportedLanguage(language) || "pt";
	const locale = locales[currentLanguage];
	document.documentElement.lang = locale.tag;
	languageSelect.value = currentLanguage;
	document.querySelectorAll("[data-i18n]").forEach((element) => {
		element.textContent = translate(element.dataset.i18n);
	});
	document.querySelectorAll("[data-i18n-html]").forEach((element) => {
		// HTML fixo dos catálogos locais; sem conteúdo inserido pelo visitante.
		element.innerHTML = translate(element.dataset.i18nHtml);
	});
	for (const attribute of ["alt", "aria-label"]) {
		document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
			element.setAttribute(attribute, translate(element.getAttribute(`data-i18n-${attribute}`)));
		});
	}
	const metaPrefix = document.body.dataset.page === "press" ? "press.meta" : "meta";
	document.title = translate(`${metaPrefix}.title`);
	document.querySelector('meta[name="description"]').content = translate(`${metaPrefix}.description`);
	document.querySelector('meta[property="og:locale"]').content = locale.og;
	document.querySelector('meta[property="og:title"]').content = translate(`${metaPrefix}.title`);
	document.querySelector('meta[property="og:description"]').content = translate(`${metaPrefix}.social`);
	updateMenuLabel();
	updateStoreLinks();
	renderMode();
	if (lightbox.open) showImage(currentImage);
	const video = document.querySelector("video");
	const source = video.querySelector("source");
	video.poster = locale.poster;
	video.querySelector("a").href = locale.video;
	if (source.getAttribute("src") !== locale.video) {
		video.pause();
		source.src = locale.video;
		video.load();
	}
	document.querySelectorAll("[data-language-link]").forEach((link) => {
		const url = new URL(link.href, window.location.href);
		url.searchParams.set("lang", currentLanguage);
		link.href = url.href;
	});
	document.dispatchEvent(new CustomEvent("ronrons:language", { detail: { language: currentLanguage } }));
}

languageSelect.addEventListener("change", () => {
	applyLanguage(languageSelect.value);
	try {
		window.localStorage.setItem(languageStorageKey, currentLanguage);
	} catch {
		// A preferência é opcional; a tradução não depende dela.
	}
	try {
		const url = new URL(window.location.href);
		url.searchParams.set("lang", currentLanguage);
		window.history.replaceState(null, "", url);
	} catch {
		// O histórico pode ser restrito ao abrir um arquivo local.
	}
});

applyLanguage(currentLanguage);
