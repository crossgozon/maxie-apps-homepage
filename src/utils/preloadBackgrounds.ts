// Every full-bleed page background in the site, gathered in one place so
// they can all start downloading the moment the app mounts - before the
// user has navigated anywhere. Without this, a page's background only
// starts fetching once its route actually renders, so it visibly pops in
// after the page-transition animation has already finished.
const PAGE_BACKGROUND_URLS = [
  "/assets/about_background.jpg",
  "/assets/maxclicker/background.jpg",
  "/assets/maxmacro/background.jpg",
  "/assets/maxperformance/background.jpg",
];

export function preloadPageBackgrounds() {
  for (const url of PAGE_BACKGROUND_URLS) {
    const image = new Image();
    image.src = url;
  }
}
