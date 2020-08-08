'use strict';

function insertTextAtCursor(text) {
	var editor = document.getElementsByClassName('content-editable')[0];
	editor.focus();
	var sanitizedText = text.replace(/(\r\n|\n|\r)/gm," ");
	editor.innerHTML = sanitizedText.concat(editor.innerHTML);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.data) {
		insertTextAtCursor(request.data);
	}
});


