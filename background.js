'use strict';

function getContentFromClipboard() {
    var result = '';
    var sandbox = document.getElementById('sandbox');
    sandbox.innerHTML = '';
    sandbox.focus();
    if (document.execCommand('paste')) {
        var descendants = sandbox.querySelectorAll('*');
        var i;
        for (i = 0; i < descendants.length; i++) {
            var d = (descendants[i]);
            insertItalicsAndBold(d);
            stripStyles(d);
        }
        result = sandbox.innerHTML;
    }
    sandbox.innerHTML = '';
 return result;
}

function insertItalicsAndBold(d) {
    if (d.style.fontStyle == "italic") {
        var wrapper = document.createElement('i');
        d.parentNode.insertBefore(wrapper, d);
        wrapper.appendChild(d);
    }
    if (d.style.fontStyle == "bold" || d.style.fontWeight == "700") {
        var wrapper = document.createElement('b');
        d.parentNode.insertBefore(wrapper, d);
        wrapper.appendChild(d);
    }
}

function stripStyles(d) {
    while(d.attributes.length > 0) {
        d.removeAttribute(d.attributes[0].name);
    }
    var tag = d.tagName.toLowerCase();
    if (tag != "i" && tag != "b" && tag != "p") {
        unwrap(d);
    }
}

function unwrap(wrapper) {
    // place childNodes in document fragment
    var docFrag = document.createDocumentFragment();
    while (wrapper.firstChild) {
        var child = wrapper.removeChild(wrapper.firstChild);
        docFrag.appendChild(child);
    }

    // replace wrapper with document fragment
    if (wrapper.parentNode != null) {
        wrapper.parentNode.replaceChild(docFrag, wrapper);        
    }
}

/**
 * Send the value that should be pasted to the content script.
 */
 function sendPasteToContentScript(toBePasted) {
    // We first need to find the active tab and window and then send the data
    // along. This is based on:
    // https://developer.chrome.com/extensions/messaging
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: toBePasted});
    });
}

/**
 * The function that will handle our context menu clicks.
 */
 function onClickHandler(info, tab) {
    var clipboardContent = getContentFromClipboard();
    console.log('clipboardContent: ' + clipboardContent);
    if (info.menuItemId === 'tapasPaste') {
        sendPasteToContentScript(clipboardContent);
    }
}

// Register the click handler for our context menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up the single one item "paste"
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create(
    {
        'title': 'Paste Into Editor',
        'id': 'tapasPaste',
        'contexts': ['all']
    });
});