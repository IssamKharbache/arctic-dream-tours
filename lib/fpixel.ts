export const fbEvent = (event: string, params?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq("track", event, params);
  } else {
    console.warn("fbq is not initialized");
  }
};
