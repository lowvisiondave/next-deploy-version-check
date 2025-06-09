"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useVersionSkew(pollIntervalMs = DEFAULT_POLL_INTERVAL) {
	const [hasSkew, setHasSkew] = useState(false);
	const currentDeploymentId = useRef<string | null>(null);

	useEffect(() => {
		if (process.env.NODE_ENV !== "production") return;

		const checkSkew = async () => {
			try {
				const res = await fetch("/api/version", { cache: "no-store" });
				const { deploymentId } = await res.json();

				if (!deploymentId) return;

				if (!currentDeploymentId.current) {
					currentDeploymentId.current = deploymentId;
				} else if (currentDeploymentId.current !== deploymentId) {
					setHasSkew(true);
					currentDeploymentId.current = deploymentId;
				}
			} catch (err) {
				console.error("Version check failed:", err);
			}
		};

		checkSkew();

		const interval = setInterval(() => {
			if (!hasSkew) checkSkew();
		}, pollIntervalMs);

		return () => clearInterval(interval);
	}, [pollIntervalMs, hasSkew]);

	return hasSkew;
}
