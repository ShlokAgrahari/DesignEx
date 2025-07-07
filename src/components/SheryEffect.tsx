"use client";

import { useEffect } from "react";
import Shery from "sheryjs";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SheryGooeyEffect() {
  useEffect(() => {
    // Register GSAP plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize the gooey effect
    Shery.imageEffect(".images", {
      style: 6,
      gooey: true,
      debug: true,
      config: {
        a: { value: 2, range: [0, 30] },
        b: { value: 0.76, range: [-1, 1] },
        zindex: { value: -9996999, range: [-9999999, 9999999] },
        aspect: { value: 0.7241 },
        ignoreShapeAspect: { value: true },
        shapePosition: { value: { x: 0, y: 0 } },
        shapeScale: { value: { x: 0.5, y: 0.5 } },
        shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
        shapeRadius: { value: 0, range: [0, 2] },
        currentScroll: { value: 0 },
        scrollLerp: { value: 0.07 },
        gooey: { value: true },
        infiniteGooey: { value: false },
        growSize: { value: 4, range: [1, 15] },
        durationOut: { value: 1, range: [0.1, 5] },
        durationIn: { value: 1.5, range: [0.1, 5] },
        displaceAmount: { value: 0.5 },
        masker: { value: true },
        maskVal: { value: 1.23, range: [1, 5] },
        scrollType: { value: 0 },
        geoVertex: { range: [1, 64], value: 1 },
        noEffectGooey: { value: true },
        onMouse: { value: 1 },
        noise_speed: { value: 0.76, range: [0, 10] },
        metaball: { value: 0.33, range: [0, 2] },
        discard_threshold: { value: 0.5, range: [0, 1] },
        antialias_threshold: { value: 0.01, range: [0, 0.1] },
        noise_height: { value: 0.5, range: [0, 2] },
        noise_scale: { value: 10, range: [0, 100] },
      },
    });
  }, []);

  return null;
}
