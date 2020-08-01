'use strict';

function insertTextAtCursor(text) {
	var editor = document.getElementsByClassName('content-editable')[0];
	editor.focus();
	editor.innerHTML = text.concat(editor.innerHTML);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request.data);
	if (request.data) {
		insertTextAtCursor(request.data);
	}
});


