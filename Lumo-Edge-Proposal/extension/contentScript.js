// Minimal DOM analyzer: extracts visible forms and inputs
(function () {
  function labelText(el) {
    if (!el) return null;
    if (el.labels && el.labels.length) return el.labels[0].innerText.trim();
    const aria = el.getAttribute && el.getAttribute("aria-label");
    if (aria) return aria.trim();
    return el.placeholder || null;
  }

  const forms = Array.from(document.forms).map((f, i) => {
    const selector = f.id ? `form#${f.id}` : `form:nth-of-type(${i+1})`;
    const inputs = Array.from(f.querySelectorAll("input,textarea,select")).map(el => ({
      tag: el.tagName.toLowerCase(),
      type: el.type || null,
      id: el.id || null,
      name: el.name || null,
      label: labelText(el),
      hidden: (el.offsetParent === null) || el.hidden || el.getAttribute("aria-hidden") === "true"
    }));
    return { selector, inputs };
  }).filter(f => f.inputs && f.inputs.length);

  const payload = {
    ts: new Date().toISOString(),
    url: location.href,
    title: document.title || null,
    forms
  };

  // Print for debug and send to extension background/popup
  console.log("[Lumo-Edge] schema", payload);
  try {
    chrome.runtime.sendMessage({cmd:"lumo-schema", payload});
  } catch (e) { /* silent */ }
})();
