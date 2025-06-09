import { NextResponse } from "next/server";

// 👇 This makes the route fully static at build time
export const dynamic = "force-static";

export async function GET() {
	return NextResponse.json(
		{
			deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? "local",
		},
		{
			headers: {
				"Cache-Control": "no-store, max-age=0",
			},
		}
	);
}
