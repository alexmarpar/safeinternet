async function shouldScrape() {
  const { blockeddomains = [], whitelistedDomains = [] } =
    await chrome.storage.local.get([
      "blockeddomains",
      "whitelistDomains",
    ]);

  const currentUrl = location.hostname;

  const isWhitelisted = whitelistedDomains.some(
    (site) =>
      currentUrl === site.domain ||
      currentUrl.endsWith("." + site.domain)
  );

  if (isWhitelisted) return true;


  const isBlocked = blockeddomains.some(
    (site) =>
      currentUrl === site.domain ||
      currentUrl.endsWith("." + site.domain)
  );

  if (isBlocked) return false;

  return true;
}

async function run() {
  if (window.__processing) return;
  window.__processing = true;

  const canScrape = await shouldScrape();

  if (!canScrape) {
    console.log(" Site blocked, don't scrape");
    return;
  }

  const text = document.body.innerText.slice(0, 10000);

  const currentUrl = location.hostname;
 
  chrome.runtime.sendMessage(
  {
    type: "SCRAPE_PAGE",
    url: location.href,
    payload: text,
  },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sendMessage:", chrome.runtime.lastError.message);
    } else {
      console.log("Respuesta del background:", response);
    }
  }
   
);
}
run();
