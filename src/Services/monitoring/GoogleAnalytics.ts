import ReactGa from "react-ga";
declare global {
  interface Window {
    GA_INITIALIZED: Boolean;
  }
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
const MONITORING_ENABLED: Boolean =
  process.env.NEXT_PUBLIC_MONITORING_ENABLED === "true" ? true : false;

export const initGA = (userId: string) => {
  if (!window.GA_INITIALIZED) {
    ReactGa.initialize(<string>process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      debug: false,
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    window.GA_INITIALIZED = true;
  }

  ReactGa.set({ userId: userId });
};

export const setGAField = (
  userId: string,
  fieldName: string,
  fieldValue: string
) => {
  if (!MONITORING_ENABLED) return;
  initGA(userId);
  ReactGa.set({ [fieldName]: fieldValue });
};

export const logPageview = (userId: string, url: string) => {
  if (!MONITORING_ENABLED) return;
  initGA(userId);
  ReactGa.pageview(url);
};

export const logEventWithLabel = (
  userId: string,
  category: string,
  action: string,
  label: string
) => {
  if (!MONITORING_ENABLED) return;

  initGA(userId);
  ReactGa.event({
    category: category,
    action: action,
    label: label,
  });
};

export const logEvent = (userId: string, category: string, action: string) => {
  if (!MONITORING_ENABLED) return;

  initGA(userId);
  ReactGa.event({
    category: category,
    action: action,
  });
};
