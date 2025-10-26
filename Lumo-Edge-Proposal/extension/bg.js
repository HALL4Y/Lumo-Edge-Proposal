// Background service worker minimal
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"]
    });
  } catch (e) {
    console.error("Lumo-Edge bg error", e);
  }
});

// Message listener (popup ↔ bg)
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.cmd === "analyze-current") {
    chrome.tabs.query({active:true,currentWindow:true}, (tabs) => {
      if (!tabs[0]) return reply({error:"no-tab"});
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["contentScript.js"]
      }, () => reply({ok:true}));
    });
    return true;
  }
});
