"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative pt-16 pb-32 md:pt-32 md:pb-40 overflow-hidden">
      {/* Linear gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F7] to-white" />
      
      {/* Gradient for transition to the next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block px-4 py-2 bg-[#00313A]/15 rounded-full text-sm text-[#00313A] font-semibold shadow-sm mb-8"
          >
            Enterprise-ready solution
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mt-4 text-[#00313A] leading-tight max-w-4xl"
          >
            Empower your team's productivity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-[#00313A]/80 tracking-tight mt-8 leading-relaxed max-w-2xl"
          >
            Revolutionize how your organization manages time with AI-powered
            scheduling and task management
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center mt-10"
          >
            <Button size="lg" asChild className="bg-[#00313A] text-white hover:bg-[#004A59]">
              <a href="https://calendly.com/opuslist/product-demo">Schedule a Demo</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <div className="relative w-full max-w-5xl aspect-[20/12] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/software-screenshot.png" // Make sure this path is correct
              alt="OpusList Software Interface"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-center mt-16"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 2,
              ease: "easeInOut",
            }}
            className="cursor-pointer hover:text-[#004A59] transition-colors"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <ChevronDown size={36} className="text-[#00313A]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
