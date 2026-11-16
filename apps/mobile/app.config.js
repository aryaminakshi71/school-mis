const schoolName =
  process.env.EXPO_PUBLIC_SCHOOL_NAME ||
  process.env.VITE_PUBLIC_SCHOOL_NAME ||
  "School MIS";
const schoolShortName =
  process.env.EXPO_PUBLIC_SCHOOL_SHORT_NAME ||
  process.env.VITE_PUBLIC_SCHOOL_SHORT_NAME ||
  schoolName;
const webUrl =
  process.env.EXPO_PUBLIC_WEB_URL ||
  process.env.VITE_PUBLIC_SITE_URL ||
  "http://localhost:5173";
const slug =
  schoolShortName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "school-mis-mobile";

module.exports = {
  expo: {
    name: schoolName,
    slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#047857",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: `com.school.${slug.replace(/-/g, "")}`,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#047857",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: `com.school.${slug.replace(/-/g, "")}`,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      schoolName,
      schoolShortName,
      webUrl,
    },
  },
};
