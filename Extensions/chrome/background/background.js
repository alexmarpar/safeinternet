async function fetchAndSave() {
  const res = await fetch("http://localhost:3000/api/getdomains");
  const data = await res.json();

  await chrome.storage.local.set({
    blockedSitesFromAPI: data
    
  });
  await applyRedirectRules()
}
// chrome.storage.local.get(null).then(console.log);
fetchAndSave()
console.log("storage saved")

async function applyRedirectRules() {
  const { blockedSitesFromAPI = [] } = await chrome.storage.local.get("blockedSitesFromAPI");

  const rules = blockedSitesFromAPI.map((site, i) => ({
    id: i + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        url: chrome.runtime.getURL("block/blocked.html"),
      },
    },
    condition: {
      urlFilter: `||${site.domain}`,
      resourceTypes: ["main_frame"],
    },
  }));

  // remove old tables
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRules.map(r => r.id),
    addRules: rules,
  });
}

chrome.runtime.onInstalled.addListener(applyRedirectRules);
chrome.runtime.onStartup.addListener(applyRedirectRules);

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const logData = {
      url: details.url,
      metodo: details.method,
      tipo: details.type, // image, script, main_frame, xmlhttprequest, etc.
      timestamp: new Date(details.timeStamp).toISOString(),
      tabId: details.tabId,
    };

    //console.log(logData.url)
    //console.log("New request detected:", logData.url);
  },
  { urls: ["<all_urls>"] }, // Filter: record all
)
