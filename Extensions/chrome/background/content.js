async function shouldScrape() {
  const { blockedSitesFromAPI = [] } =
    await chrome.storage.local.get("blockedSitesFromAPI");

  const currentUrl = location.hostname;

  //check if domain is blocked
  const isBlocked = blockedSitesFromAPI.some(site =>
    currentUrl.includes(site.domain)
  );

  return !isBlocked; // Scrap if isn't blocked
}

async function run() {
  const canScrape = await shouldScrape();

  if (!canScrape) {
    console.log(" Site blocked, don't scrape");
    return;
  }

  const text = document.body.innerText;

  chrome.runtime.sendMessage({
    type: "SCRAPE_PAGE",
    url: location.href,
    payload: text
  });

  console.log("Page scrapped succesful",text);
}
/*
Develoment note:
we'll need a whitelistdomains for don't scrape, only scrap unknown domains and classify them
*/

run();