'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Highlighter, BookOpen, Wand2 } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

const features = [
  {
    icon: Highlighter,
    title: "Highlight and prioritize tasks",
    description: "Seamlessly integrate task prioritization into your workflow",
    gif: "/highlight-tasks.gif"
  },
  {
    icon: BookOpen,
    title: "Organize your projects",
    description: "Effortlessly manage and track multiple projects in one place",
    gif: "/organize-projects.gif"
  },
  {
    icon: Wand2,
    title: "AI-powered productivity",
    description: "Let our AI optimize your schedule and boost your efficiency",
    gif: "/ai-productivity.gif"
  }
]

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState(0)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const titleOpacity = useTransform(smoothProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0])
  const titleY = useTransform(smoothProgress, [0.1, 0.2, 0.8, 0.9], [50, 0, 0, -50])

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F7] via-white to-white" />
      <div className="absolute inset-0 top-0 h-32 bg-gradient-to-b from-white via-whiteto-[#E8F4F7]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-white via-white to-[#F0F4F5]" />
      
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#00313A] mb-6">
            Empower your team with powerful features
          </h2>
          <p className="text-xl text-[#00313A]/70 max-w-2xl mx-auto">
            Discover how OpusList can transform your team's productivity
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 space-y-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                style={{
                  opacity: useTransform(smoothProgress, 
                    [0.2 + index * 0.1, 0.3 + index * 0.1, 0.7 + index * 0.1, 0.8 + index * 0.1], 
                    [0, 1, 1, 0]
                  ),
                  x: useTransform(smoothProgress, 
                    [0.2 + index * 0.1, 0.3 + index * 0.1, 0.7 + index * 0.1, 0.8 + index * 0.1], 
                    [-100, 0, 0, -100]
                  )
                }}
                className={`flex items-start cursor-pointer transition-all duration-300 p-6 rounded-xl ${
                  activeTab === index 
                    ? 'bg-[#00313A] text-white shadow-lg' 
                    : 'hover:bg-[#00313A]/10'
                }`}
                onClick={() => setActiveTab(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(index)
                  }
                }}
              >
                <div className="flex-shrink-0">
                  <feature.icon className={`h-8 w-8 ${
                    activeTab === index ? 'text-white' : 'text-[#00313A]'
                  }`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className={`text-lg ${
                    activeTab === index ? 'text-white/80' : 'text-[#00313A]/70'
                  }`}>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="lg:w-1/2"
            style={{
              opacity: useTransform(smoothProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]),
              scale: useTransform(smoothProgress, [0.3, 0.4, 0.6, 0.7], [0.8, 1, 1, 0.8]),
            }}
          >
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="relative aspect-video">
                  {/* Uncomment and update the Image component when ready */}
                  {/* <Image
                    src={features[activeTab].gif}
                    alt={features[activeTab].title}
                    fill
                    className="object-cover rounded-lg"
                  /> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
