async function fetchAndSave() {
  const resblockedomains = await fetch(
    "http://localhost:3000/api/blockeddomains",
  );
  const datablockeddomains = await resblockedomains.json();
  const reswhitelistdomains = await fetch(
    "http://localhost:3000/api/whitelistdomains",
  )
  const datawhitelistdomains = await reswhitelistdomains.json();
  const domainAPIversion = await fetch("http://localhost:3000/api/version");
  const version = await domainAPIversion.json();

  await chrome.storage.local.set({
    Whitelistdomains: datawhitelistdomains,
    blockeddomains: datablockeddomains,
    APIdomainVersion: version,
  });
  await applyRedirectRules();
}
// chrome.storage.local.get(null).then(console.log);
try {
  fetchAndSave();
  console.log("storage saved of the current date: \n", new Date());
} catch (error) {
  console.log(
    "Failed to connect to the domain database. \n Please check your internet connection",
  );
}
async function applyRedirectRules() {
  const { blockedSitesFromAPI = [] } = await chrome.storage.local.get(
    "blockedSitesFromAPI",
  );

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
    removeRuleIds: oldRules.map((r) => r.id),
    addRules: rules,
  });
}

chrome.runtime.onInstalled.addListener(applyRedirectRules);
chrome.runtime.onStartup.addListener(applyRedirectRules);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCRAPE_PAGE") {
    fetch("http://localhost:3000/api/aiscanner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: new URL(message.url).hostname,
        textContent: message.payload,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(" API OK:", data);
        sendResponse({ ok: true });
      })
      .catch((err) => {
        console.error(" API error:", err);
        sendResponse({ ok: false });
      });

    return true; // 🔥 CRÍTICO (async)
  }
});

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
);
