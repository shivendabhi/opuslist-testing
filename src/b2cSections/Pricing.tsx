"use client";

import Link from "next/link";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { ArrowRight } from "lucide-react";

const pricingTiers = [
  {
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Get Started",
    buttonLink: "/api/auth/register?",
    popular: true,
    features: [
      "Basic task management",
      "30 tasks per month",
      "Simple calendar view",
      "Mobile app access",
      "Email support",
      "Free forever",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 9.99,
    buttonText: "Coming soon",
    popular: false,
    features: [
      "Everything in Free, plus:",
      "Unlimited tasks",
      "AI-powered scheduling",
      "Advanced analytics",
      "Integrations with popular apps",
      "Priority support",
      "Dark mode",
    ],
  },
  {
    title: "Teams",
    monthlyPrice: 19.99,
    buttonText: "Coming soon",
    popular: false,
    features: [
      "Everything in Pro, plus:",
      "Up to 5 team members",
      "Shared calendars and tasks",
      "Team goal setting",
      "Admin controls",
      "24/7 premium support",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-[#F0F4F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00313A] mb-6">
            Choose your productivity plan
          </h2>
          <p className="text-xl text-[#00313A]/70 max-w-2xl mx-auto">
            Start for free and upgrade as you grow. No credit card required.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={twMerge(
                "bg-white rounded-lg shadow-lg p-8",
                tier.popular && "border-2 border-[#00313A] md:scale-105",
              )}
            >
              <h3 className="text-2xl font-bold text-[#00313A] mb-4">
                {tier.title}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${tier.monthlyPrice}</span>
                <span className="text-[#00313A]/60 ml-2">/month</span>
              </div>
              <a href={tier.buttonLink || "#"}>
                <button
                  className={twMerge(
                    "w-full py-3 rounded-lg font-medium transition-colors",
                    tier.popular
                      ? "bg-[#00313A] text-white hover:bg-[#004A59]"
                      : "bg-[#00313A]/10 text-[#00313A] hover:bg-[#00313A]/20",
                  )}
                >
                  {tier.buttonText}
                </button>
              </a>
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="h-6 w-6 text-[#00313A] flex-shrink-0" />
                    <span className="text-[#00313A]/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            href="/business"
            className="inline-flex items-center px-8 py-2 bg-[#00313A] text-white rounded-full text-sm font-medium hover:bg-[#004A59] transition-colors "
          >
            Looking for business solutions?
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
