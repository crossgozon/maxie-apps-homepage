import { useEffect, useState } from "react";
import { fetchLatestRelease, ReleaseFetchError, type ProductReleaseConfig } from "../services/releaseFetcher";
import type { ReleaseState } from "../services/releaseTypes";

export function useLatestRelease(config: ProductReleaseConfig): ReleaseState {
  const [state, setState] = useState<ReleaseState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetchLatestRelease(config)
      .then((data) => {
        if (!cancelled) {
          setState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        if (error instanceof ReleaseFetchError && error.code === "empty") {
          setState({ status: "empty" });
          return;
        }

        setState({
          status: "error",
          error: error instanceof Error ? error.message : "Could not read the latest release right now.",
        });
      });

    return () => {
      cancelled = true;
    };
    // config's identity should stay stable (defined once in products.ts), so
    // re-fetching keys off the repo it actually points at.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.repo]);

  return state;
}
