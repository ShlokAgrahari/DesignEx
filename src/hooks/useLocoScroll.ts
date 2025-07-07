import { useEffect, useRef } from "react";

export const useLocoScroll = (start: boolean) => {
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (!start || typeof window === "undefined" || typeof document === "undefined") return;

    const scrollEl = document.querySelector("[data-scroll-container]");
    if (!scrollEl) return;

    import("locomotive-scroll").then((LocomotiveModule) => {
      const LocomotiveScroll = LocomotiveModule.default;

      scrollRef.current = new LocomotiveScroll({
        el: scrollEl,
        smooth: true,
        lerp: 0.07,
        getDirection: true,
      });

      window.locoScroll = scrollRef.current;

      const handleLoad = () => {
        setTimeout(() => {
          scrollRef.current?.update();
        }, 300); // Small delay to ensure everything (like marquees/fonts) is rendered
      };

      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
        scrollRef.current?.destroy();
      };
    });
  }, [start]);

  return scrollRef;
};
