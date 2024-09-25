"use client";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";

const pricingTiers = [
  {
    title: "Starter",
    monthlyPrice: 0,
    buttonText: "Coming soon",
    buttonLink: "https://airtable.com/appvtWDhbKDDRZ7TE/pagtxfT0t3i2nOu4H/form",
    popular: false,
    features: [
      "Up to 5 team members",
      "Basic task management",
      "30 tasks per week",
      "Basic auto-scheduling",
      "Calendar integration",
      "Community support",
    ],
  },
  {
    title: "Business",
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

export const Pricing = () => {
  return (
    <section className="py-24 bg-[#F0F4F5]">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#00313A] mb-6">
            Flexible plans for every team
          </h2>
          <p className="text-xl text-[#00313A]/70 max-w-2xl mx-auto">
            Choose the perfect plan to optimize your team's productivity and
            scale as you grow.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={twMerge(
                "bg-white rounded-lg shadow-lg p-8",
                tier.popular && "border-2 border-[#00313A] scale-105",
              )}
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
                  <span className="text-2xl font-semibold">Custom pricing</span>
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
      </div>
    </section>
  );
};
