export const fbEvent = (event: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params || {});
  }
};
