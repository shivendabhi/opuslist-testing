'use client';

import React, { useState } from 'react';
import Header from '@/b2cSections/Header';
import { Footer } from '@/b2bSections/Footer';
import { Switch } from '@/components/ui/switch';
import { CheckIcon, XIcon } from 'lucide-react';
import { motion, useTransform } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

type PlanFeatures = {
  [key: string]: boolean | string;
};

interface Plan {
  title: string;
  price: number | string;
  features: PlanFeatures;
}

import { useScroll } from 'framer-motion';

const PricingPage = () => {
  const [isTeamView, setIsTeamView] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  type PlanFeatures = {
    [key: string]: boolean | string;
  };

  interface Plan {
    title: string;
    price: number | string;
    features: PlanFeatures;
  }

  const individualPlans: Plan[] = [
    {
      title: "Free",
      price: 0,
      features: {
        "Basic task management": true,
        "30 tasks per month": true,
        "Simple calendar view": true,
        "Mobile app access": true,
        "Email support": true,
        "AI-powered scheduling": false,
        "Advanced analytics": false,
        "Integrations with popular apps": false,
        "Priority support": false,
        "Dark mode": false,
      }
    },
    {
      title: "Pro",
      price: 9.99,
      features: {
        "Basic task management": true,
        "30 tasks per month": "Unlimited",
        "Simple calendar view": true,
        "Mobile app access": true,
        "Email support": true,
        "AI-powered scheduling": true,
        "Advanced analytics": true,
        "Integrations with popular apps": true,
        "Priority support": true,
        "Dark mode": true,
      }
    }
  ];

  const teamPlans: Plan[] = [
    {
      title: "Teams",
      price: 19.99,
      features: {
        "Basic task management": true,
        "Unlimited tasks": true,
        "Simple calendar view": true,
        "Mobile app access": true,
        "Email support": true,
        "AI-powered scheduling": true,
        "Advanced analytics": true,
        "Integrations with popular apps": true,
        "Priority support": true,
        "Dark mode": true,
        "Up to 5 team members": true,
        "Shared calendars and tasks": true,
        "Team goal setting": true,
        "Admin controls": true,
        "24/7 premium support": true,
        "Custom branding": false,
        "Advanced security features": false,
        "API access": false,
        "Dedicated account manager": false,
      }
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: {
        "Basic task management": true,
        "Unlimited tasks": true,
        "Simple calendar view": true,
        "Mobile app access": true,
        "Email support": true,
        "AI-powered scheduling": true,
        "Advanced analytics": true,
        "Integrations with popular apps": true,
        "Priority support": true,
        "Dark mode": true,
        "Unlimited team members": true,
        "Shared calendars and tasks": true,
        "Team goal setting": true,
        "Admin controls": true,
        "24/7 premium support": true,
        "Custom branding": true,
        "Advanced security features": true,
        "API access": true,
        "Dedicated account manager": true,
      }
    }
  ];

  const currentPlans = isTeamView ? teamPlans : individualPlans;

  const motionValues = currentPlans.map((_, index) => ({
    opacity: useTransform(
      scrollYProgress,
      [0.3 + index * 0.1, 0.5 + index * 0.1],
      [0, 1]
    ),
    y: useTransform(
      scrollYProgress,
      [0.3 + index * 0.1, 0.5 + index * 0.1],
      [50, 0]
    ),
  }));

  return (
    <>
      <Header />
      <section className='bg-gradient-to-b from-[#E8F4F7] to-white'>
      <main className="container mx-auto px-4 py-16 bg-gradient-to-b from-[#E8F4F7] to-white pt-[5rem]">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">Choose Your Plan</h1>
        
        <div className="flex items-center justify-center mb-12">
          <span className={`mr-3 ${isTeamView ? 'text-gray-500' : 'font-semibold'}`}>For Individuals</span>
          <Switch
            checked={isTeamView}
            onCheckedChange={setIsTeamView}
            className="bg-[#00313A]"
          />
          <span className={`ml-3 ${isTeamView ? 'font-semibold' : 'text-gray-500'}`}>For Teams</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {currentPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              className={twMerge(
                "bg-white rounded-lg shadow-lg p-8",
                plan.title === "Teams" && "border-2 border-[#00313A] md:scale-105"
              )}
              style={motionValues[index]}
            >
              <div className="p-8 bg-[#00313A] text-white">
                <h2 className="text-3xl font-bold mb-2">{plan.title}</h2>
                <div className="text-4xl font-bold">
                  {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  {typeof plan.price === 'number' && <span className="text-xl font-normal">/month</span>}
                </div>
              </div>
              <ul className="p-8">
                {Object.entries(plan.features).map(([feature, value], featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-4">
                    {value === true && <CheckIcon className="w-5 h-5 text-[#00313A] mr-2" />}
                    {value === false && <XIcon className="w-5 h-5 text-gray-400 mr-2" />}
                    <span className={value === true ? 'text-gray-800' : 'text-gray-500'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="p-8 bg-gray-100">
                <a href="#" className="block w-full bg-[#00313A] text-white text-center py-3 rounded-lg font-medium hover:bg-[#2a606a] transition-colors">
                  Choose Plan
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href="https://airtable.com/appvtWDhbKDDRZ7TE/pagtxfT0t3i2nOu4H/form" className="bg-[#00313A] text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#2a606a] transition-colors">
            Start Free Trial
          </a>
        </div>
      </main>
      </section>
      <Footer />
    </>
  );
};

export default PricingPage;
