'use client';

import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/b2cSections/Header";
import {Footer} from "@/b2bSections/Footer";

const AboutPage = () => {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-[#E8F4F7] to-white pt-[5rem]">
        <div className="container mx-auto px-4 py-16">
          <motion.h1 
            className="text-5xl font-bold text-[#00313A] mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About OpusList
          </motion.h1>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-16 items-center mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <p className="text-xl mb-6 text-[#00313A]/80 leading-relaxed">
                OpusList is a cutting-edge productivity platform that harnesses the power of AI to revolutionize task management and scheduling for individuals and teams.
              </p>
              <p className="text-xl mb-6 text-[#00313A]/80 leading-relaxed">
                Founded in 2024, our mission is to empower people to make the most of their time, allowing them to focus on what truly matters in both their personal and professional lives.
              </p>
              <p className="text-xl text-[#00313A]/80 leading-relaxed">
                With our innovative AI-driven approach, we're not just another task management tool – we're your personal productivity assistant, working tirelessly to optimize your day and boost your efficiency.
              </p>
            </div>
            <div className="relative aspect-square w-full max-w-md mx-auto shadow-2xl rounded-[6rem] overflow-hidden">
              <Image
                src="/about-image.png"
                alt="OpusList Team"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-[#00313A] mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Our Values
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-12 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              { title: "Innovation", description: "We constantly push the boundaries of what's possible in productivity technology." },
              { title: "User-Centric", description: "Our users are at the heart of everything we do, driving our product development and features." },
              { title: "Integrity", description: "We uphold the highest standards of data privacy and ethical AI use." }
            ].map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-[#00313A]">{value.title}</h3>
                <p className="text-[#00313A]/70">{value.description}</p>
              </div>
            ))}
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-[#00313A] mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Meet Our Founder
          </motion.h2>
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-lg mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Image
                src="/founder-image.jpg"
                alt="Shiven Dabhi"
                width={200}
                height={200}
                className="rounded-full"
              />
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#00313A]">Shiven Dabhi</h3>
                <p className="text-lg mb-4 text-[#00313A]/80">
                  OpusList was born out of personal struggle and a deep desire for change. For over a year, I found myself drowning in a sea of tasks, deadlines, and commitments. Despite trying countless productivity apps and time management techniques, nothing seemed to truly simplify my life or make managing my time intuitive and effortless.
                </p>
                <p className="text-lg mb-4 text-[#00313A]/80">
                  I yearned for a tool that could understand my workflow, adapt to my changing needs, and guide me towards better time management without adding complexity to my day. When I couldn't find such a solution, I realized I had to create it myself.
                </p>
                <p className="text-lg mb-6 text-[#00313A]/80">
                  OpusList is the result of that journey – a labor of love designed to be the simple yet powerful productivity assistant I wish I had during my struggles. It's built on the belief that effective time management shouldn't be a chore but a seamless part of our daily lives.
                </p>
                <p className="text-lg italic text-[#00313A]">
                  "My hope is that OpusList will help others reclaim their time and focus on what truly matters, just as it has done for me. Because when we master our time, we open up endless possibilities for personal growth, creativity, and fulfillment."
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h2 className="text-4xl font-bold text-[#00313A] mb-6">Join Us</h2>
            <p className="text-xl mb-8 text-[#00313A]/80 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. If you're passionate about productivity and AI, check out our open positions or reach out to us.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="mailto:careers@opuslist.ai" className="bg-[#00313A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#004A59] transition-colors">
                Email us
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
