import themes from "daisyui/src/theming/themes"
import { ConfigProps } from "./types/config"

const config = {
  // REQUIRED
  appName: "MemoryMaster",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Improve your memory and cognitive skills with MemoryMaster, a fun and challenging game designed to test your mental abilities.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "memory-game-sepia-chi.vercel.app",
  crisp: {
    // Crisp website ID. Empty means Crisp chat is not loaded.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  // Where people can reach us (shown on the Terms and Privacy pages)
  contactUrl: "https://github.com/Duke242/memory-game/issues",
  stripe: {
    // The site is free: there are no paid plans. Add Stripe price IDs here if that changes.
    plans: [],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    // Email sign-in isn't in use. If you enable it, set these to a domain you control.
    subdomain: "mg",
    fromNoReply: `MemoryMaster <noreply@mg.example.com>`,
    fromAdmin: `MemoryMaster <hello@mg.example.com>`,
    // Optional: a support email (shown by ButtonSupport) and an address to forward replies to.
    supportEmail: "",
    forwardRepliesTo: "",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps

export default config
