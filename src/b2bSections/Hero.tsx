"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import calendarImage from "@/assets/calendarimage.png";
import tasklistImage from "@/assets/tasklistimage.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 bg-gradient-to-br from-[#D0E8ED] to-[#E6F0F2] text-[#00313A] overflow-x-clip"
    >
      <div className="container z-50">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="inline-block px-3 py-1 bg-[#00313A]/15 rounded-full text-sm text-[#00313A] font-medium">
              Enterprise-ready solution
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-6 text-[#00313A]">
              Empower your team's productivity
            </h1>
            <p className="text-xl text-[#00313A]/80 tracking-tight mt-6">
              Revolutionize how your organization manages time with AI-powered
              scheduling and task management
            </p>
            <div className="flex gap-4 items-center mt-[30px]">
              <a href="https://calendly.com/opuslist/product-demo">
                <button className="bg-[#00313A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#004A59] transition-colors">
                  Schedule a Demo
                </button>
              </a>
              <button className="flex items-center gap-2 text-[#00313A]/70 hover:text-[#00313A] transition-colors">
                <span>Learn more</span>
                <ArrowIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img
              src={calendarImage.src}
              alt="Calendar view"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0 "
              animate={{
                translateY: [0, 0, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 5,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={tasklistImage.src}
              width={400}
              alt="Task list"
              className="lg:block absolute top-[215px] left-[500px] rotate-[30deg]"
              style={{
                translateY: translateY,
              }}
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
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
            className="cursor-pointer"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <ChevronDown size={32} className="text-[#00313A]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
