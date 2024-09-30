"use client";
import productImage from "@/assets/productimage.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProductShowcase() {
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
            Supercharge your day
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#00313A] mb-6">
            Your personal time management genius
          </h2>
          <p className="text-xl text-[#00313A]/70 max-w-2xl mx-auto">
            See your entire day at a glance and let AI optimize your schedule
            for peak productivity.
          </p>
        </div>
        <div className="relative mt-16">
          <Image
            src={productImage}
            alt="Product Image"
            className="rounded-lg shadow-2xl"
          />
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#00313A] text-white p-6 rounded-lg shadow-xl max-w-md"
            style={{
              translateY,
            }}
          >
            <h3 className="text-2xl font-semibold mb-2">Smart Suggestions</h3>
            <p className="text-white/80">
              Our AI learns your habits and preferences to suggest the best
              times for focused work, breaks, and personal time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
