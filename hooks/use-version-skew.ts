"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook to detect version skew by polling /api/version
 * and listening for tab visibility changes.
 *
 * @param pollIntervalMs - interval between version checks (default 5 minutes)
 * @returns boolean indicating if a new deployment version is available
 */
export function useVersionSkew(
	pollIntervalMs = DEFAULT_POLL_INTERVAL_MS
): boolean {
	const [hasSkew, setHasSkew] = useState(false);

	// Store the currently known deployment ID
	const currentDeploymentId = useRef<string | null>(null);

	// Mutable ref to keep latest `hasSkew` value in async callbacks
	const hasSkewRef = useRef<boolean>(false);

	// Keep the ref updated with the latest `hasSkew` state
	useEffect(() => {
		hasSkewRef.current = hasSkew;
	}, [hasSkew]);

	useEffect(() => {
		// Skip in non-production environments (e.g. development)
		if (process.env.NODE_ENV !== "production") return;

		// Async function to fetch and compare deployment IDs
		async function checkVersionSkew() {
			try {
				const response = await fetch("/api/version", { cache: "no-store" });
				if (!response.ok) {
					console.warn("Failed to fetch version info:", response.statusText);
					return;
				}

				const data: { deploymentId?: string } = await response.json();

				if (!data.deploymentId) {
					console.warn("No deploymentId found in version response");
					return;
				}

				if (!currentDeploymentId.current) {
					currentDeploymentId.current = data.deploymentId;
				} else if (currentDeploymentId.current !== data.deploymentId) {
					setHasSkew(true);
					currentDeploymentId.current = data.deploymentId;
				}
			} catch (error) {
				console.error("Error checking version skew:", error);
			}
		}

		// Initial check on mount
		checkVersionSkew();

		// Set up interval for periodic polling
		const intervalId = setInterval(() => {
			// Only check if skew not detected yet
			if (!hasSkewRef.current) {
				checkVersionSkew();
			}
		}, pollIntervalMs);

		// Handler to check version on tab visibility change
		function onVisibilityChange() {
			if (document.visibilityState === "visible" && !hasSkewRef.current) {
				checkVersionSkew();
			}
		}

		// Listen for visibility changes
		document.addEventListener("visibilitychange", onVisibilityChange);

		// Cleanup on unmount
		return () => {
			clearInterval(intervalId);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [pollIntervalMs]);

	return hasSkew;
}
