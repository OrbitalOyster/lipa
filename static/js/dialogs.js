"use strict"

import { Dialog } from "/bootstrap/js/bootstrap.bundle.min.js"

const confirmMessageTitle = "Confirm action"

var modalEl, modal

/* HTMX modal */
const showHTMXModal = () => {
	/* Remove previous HTMX content */
	const toRemoveQuery = "#modal > div:first-child > :not(.modal-placeholder)",
		toRemoveEls = document.querySelectorAll(toRemoveQuery)
	toRemoveEls.forEach((el) => el.remove())
	modal.show()
}

/* Confirm dialog */
const confirmMsg = async (title, content) => {
	const confirmDialog = new Dialog("#confirm-dialog"),
		dialogEl = document.getElementById("confirm-dialog"),
		titleEl = dialogEl.querySelector("#confirm-dialog-title"),
		contentEl = dialogEl.querySelector("#confirm-dialog-content"),
		okBtn = dialogEl.querySelector("#confirm-dialog-ok-btn")
	titleEl.textContent = title
	contentEl.textContent = content
	/* Focus on okBtn */
	const onShown = () => { okBtn.focus({ focusVisible: true }) }
	dialogEl.addEventListener("shown.bs.dialog", onShown)
	confirmDialog.show()
	return new Promise((resolve) => {
		const confirmed = () => {
				resolve(true)
				cleanUp()
			},
			cleanUp = () => {
				okBtn.removeEventListener("click", confirmed)
				dialogEl.removeEventListener("shown.bs.dialog", onShown)
				dialogEl.removeEventListener("hidden.bs.dialog", cleanUp)
				confirmDialog.hide()
			}
		okBtn.addEventListener("click", confirmed)
		dialogEl.addEventListener("hidden.bs.dialog", cleanUp)
	})
}

/* For elements with "hx-confirm" tag */
const onHTMXConfirm = (event) => {
	/* No confirmation needed */
	if (!event.detail.question)
		return
	/* Skip default action, show confirm modal */
	event.preventDefault()
	confirmMsg(confirmMessageTitle, event.detail.question)
		/* true to skip the built-in window.confirm() */
		.then((res) => res && event.detail.issueRequest(true))
}

/* Set up bootstrap modals */
const initDialogs = () => {
	// modalEl = document.getElementById("modal")
	// modal = new Dialog("#modal")
	// document.body.addEventListener("hideModal", () => modal.hide())
	document.addEventListener("htmx:confirm", onHTMXConfirm)
}

export { initDialogs }
