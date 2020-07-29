'use strict';

function insertTextAtCursor(text) {
	var editor = document.getElementsByClassName('content-editable')[0];
	console.log(editor);
	console.log(text);
	var sanitized = text.replace(/<(?!\/?(p|b|i)\s*\/?)[^>]+>/g, '');
	console.log(sanitized);
	editor.innerHTML = sanitized.concat(editor.innerHTML);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request.data);
	if (request.data) {
		insertTextAtCursor(request.data);
	}
});


