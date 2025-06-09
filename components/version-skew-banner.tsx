"use client";

import { useVersionSkew } from "@/hooks/use-version-skew";

export function VersionSkewBanner() {
	const hasSkew = useVersionSkew();

	if (!hasSkew) {
		return null;
	}

	return (
		<div className="bg-red-500 text-white text-sm p-3 text-center fixed bottom-0 w-full z-50">
			A new version of the app is available.
			<button
				className="ml-2 underline font-semibold cursor-pointer"
				onClick={() => window.location.reload()}
				type="button"
			>
				Reload
			</button>
		</div>
	);
}
