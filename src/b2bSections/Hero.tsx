"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="relative w-full max-w-4xl h-64 bg-gradient-to-r from-[#00313A]/20 via-[#004A59]/20 to-[#00313A]/20 rounded-xl overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 20,
                ease: "linear",
              }}
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[#00313A] font-semibold">
              Interactive Demo Placeholder
            </div>
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
