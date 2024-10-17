"use client";
import React, { useEffect } from "react";
import acmeLogo from "@/assets/logo-acme.png";
import quantumLogo from "@/assets/logo-quantum.png";
import echoLogo from "@/assets/logo-echo.png";
import celestialLogo from "@/assets/logo-celestial.png";
import pulseLogo from "@/assets/logo-pulse.png";
import apexLogo from "@/assets/logo-apex.png";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";
import useMeasure from "react-use-measure";

export const LogoTicker = () => {
  const logos = [
    { src: acmeLogo, alt: "Acme Logo" },
    { src: celestialLogo, alt: "Celestial Logo" },
    { src: apexLogo, alt: "Apex Logo" },
    { src: acmeLogo, alt: "Acme Logo" },
    { src: celestialLogo, alt: "Celestial Logo" },
    { src: apexLogo, alt: "Apex Logo" }
  ];
  let [ref,{width}] = useMeasure();
  const xTranslation = useMotionValue(0);

  useEffect(() => {
    let controls;
    let finalPosition = -width/2 -28;
    controls = animate(xTranslation, [0,finalPosition], {
      ease: "linear",
      duration: 30,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });
    return () => controls.stop();
  }, [xTranslation, width]); // Add width as a dependency

  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container">
        <div className="text-center mb-4">
          <p className="text-gray-500 text-sm font-semibold">Participated in</p>
        </div>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            ref={ref}
            style={{ x: xTranslation }}
            className="flex gap-14 flex-none"
          >
            {[...logos, ...logos].map((logo, index) => (
              <Image
                key={`${logo.alt}-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="logo-ticker-image"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
