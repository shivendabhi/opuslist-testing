"use client";

import { useRef } from "react";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const pricingTiers = [
  {
    title: "Teams",
    monthlyPrice: 19.99,
    buttonText: "Contact sales",
    buttonLink: "mailto:sales@opuslist.ai",
    popular: true,
    features: [
      "Unlimited team members",
      "Advanced task management",
      "Unlimited tasks and projects",
      "AI-powered scheduling",
      "Advanced analytics",
      "Priority support",
      "Integration with business tools",
      "Custom branding",
    ],
  },
  {
    title: "Enterprise",
    monthlyPrice: null,
    buttonText: "Contact sales",
    buttonLink: "mailto:sales@opuslist.ai",
    popular: false,
    features: [
      "Everything in Business, plus:",
      "Dedicated account manager",
      "Custom AI model training",
      "Advanced security features",
      "API access",
      "On-premise deployment option",
      "24/7 phone support",
      "Compliance assistance",
    ],
  },
];

export default function Pricing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const titleOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);
  const titleY = useTransform(smoothProgress, [0.1, 0.3], [50, 0]);

  const motionValues = pricingTiers.map((_, index) => ({
    opacity: useTransform(
      smoothProgress,
      [0.3 + index * 0.1, 0.5 + index * 0.1],
      [0, 1]
    ),
    y: useTransform(
      smoothProgress,
      [0.3 + index * 0.1, 0.5 + index * 0.1],
      [50, 0]
    ),
  }));

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#F0F4F5] overflow-hidden"
    >
      <div className="container mx-auto px-4 mb-32">
        <motion.div
          className="text-center mb-16"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#00313A] mb-6">
            Flexible plans for every team
          </h2>
          <p className="text-xl text-[#00313A]/70 max-w-2xl mx-auto">
            Choose the perfect plan to optimize your team's productivity and
            scale as you grow.
          </p>
        </motion.div>
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                className={twMerge(
                  "bg-white rounded-lg shadow-lg p-8",
                  tier.popular && "border-2 border-[#00313A] md:scale-105"
                )}
                style={motionValues[index]}
              >
                <h3 className="text-2xl font-bold text-[#00313A] mb-4">
                  {tier.title}
                </h3>
                <div className="mb-6">
                  {tier.monthlyPrice !== null ? (
                    <span className="text-4xl font-bold">
                      ${tier.monthlyPrice}
                    </span>
                  ) : (
                    <span className="text-2xl font-semibold">
                      Custom pricing
                    </span>
                  )}
                  {tier.monthlyPrice !== null && (
                    <span className="text-[#00313A]/60 ml-2">/month</span>
                  )}
                </div>
                <a href={tier.buttonLink || "#"}>
                  <button
                    className={twMerge(
                      "w-full py-3 rounded-lg font-medium transition-colors",
                      tier.popular
                        ? "bg-[#00313A] text-white hover:bg-[#004A59]"
                        : "bg-[#00313A]/10 text-[#00313A] hover:bg-[#00313A]/20"
                    )}
                  >
                    {tier.buttonText}
                  </button>
                </a>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * featureIndex }}
                    >
                      <CheckIcon className="h-6 w-6 text-[#00313A] flex-shrink-0" />
                      <span className="text-[#00313A]/80">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
