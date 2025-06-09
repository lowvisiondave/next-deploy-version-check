# 🔄 Next.js Version Skew Detection on Vercel

This is a minimal example of how to detect when a new deployment is available in a Next.js + Vercel app, and prompt the user to refresh.

---

## 🧠 How it works

- An API route (`/api/version`) returns the current `VERCEL_DEPLOYMENT_ID`.
- A client-side React hook polls that route every 5 minutes.
- If the deployment ID changes, it means a new version is live.
- You can show a banner or button to prompt the user to reload.
