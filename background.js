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
            var d = descendants[i];
            d.removeAttribute("style");
            d.removeAttribute("class");
            if (d.innerHTML === "") {
                d.parentNode.removeChild(d);
            }
        }
        result = sandbox.innerHTML;
    }
    sandbox.innerHTML = '';
    return result;
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