"use client";
import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  useEffect(() => {
    try {
      const ins = document.querySelector(`ins[data-ad-slot="${slot}"]`);
      if (ins && !ins.getAttribute("data-adsbygoogle-status")) {
        // @ts-expect-error adsbygoogle injected by Google
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}
  }, [slot]);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-3160099648573363"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
