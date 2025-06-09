# 🔄 Next.js Version Skew Detection on Vercel

This is a minimal example of how to detect when a new deployment is available in a Next.js + Vercel app, and prompt the user to refresh.

---

## 🧠 How it works

- An API route (`/api/version`) returns the current `VERCEL_DEPLOYMENT_ID`.
- A client-side React hook polls that route every 5 minutes.
- The hook also listens for the page’s `visibilitychange` event to trigger an immediate version check when the user returns to the tab.
- If the deployment ID changes, it means a new version is live.
- You can show a banner or button to prompt the user to reload.

## 🧪 How to Test Version Skew Detection

1. Deploy the app to [Vercel](https://vercel.com).
1. Open the deployed app in your browser.
1. Trigger a redeploy on Vercel (no code change needed) and wait for it to complete.
1. Switch back to the open browser tab — the version skew banner should appear, prompting you to reload with the new version.
