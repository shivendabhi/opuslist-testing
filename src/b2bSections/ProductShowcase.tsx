"use client";
import productImage from "@/assets/productimage.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className="bg-white py-24 overflow-x-clip">
      <div className="container">
        <div className="text-center">
          <div className="inline-block px-3 py-1 bg-[#00313A]/10 rounded-full text-sm text-[#00313A] mb-4">
            Boost team productivity
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#00313A] mb-6">
            A smarter way to manage your team's time
          </h2>
          <p className="text-xl text-[#00313A]/70 max-w-2xl mx-auto">
            Gain comprehensive visibility of your entire organization's timeline
            and optimize resource allocation effortlessly.
          </p>
        </div>
        <div className="relative mt-16">
          <Image
            src={productImage}
            alt="Product Image"
            className="rounded-lg shadow-2xl"
          />
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#00313A] text-white p-6 rounded-lg shadow-xl"
            style={{
              translateY,
            }}
          >
            <h3 className="text-2xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-white/80">
              Our advanced algorithms analyze your team's work patterns to
              provide actionable productivity recommendations.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
