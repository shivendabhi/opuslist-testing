"use client";
import { useState, useEffect } from "react";
import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/opuslistlogo.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import Link from "next/link";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { Twitter, Linkedin, Instagram, YoutubeIcon } from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      const headerHeight = 80; // Adjust this value based on your header's height
      const targetPosition = featuresSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-20 transition-all ease-in-out ${
        isScrolled 
          ? "bg-white shadow-lg" 
          : "bg-transparent"
      }`}
    >
      {!isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#D0E8ED] to-[#E8F4F7]" />
      )}
      <div className="relative z-10">
        <div
          className={`flex justify-center items-center transition-all bg-[#00313A] text-white text-sm gap-3 py-2`}
        >
          <p className="text-white/80 hidden md:block">
            Optimize your team's productivity with OpusList
          </p>
          <div className="inline-flex gap-1 items-center">
            <p>Schedule a demo</p>
            <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
          </div>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${
            isScrolled ? "py-3" : "py-5"
          }`}
        >
          <div className="container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={Logo} alt="OpusList Logo" height={30} width={30} />
                <span className="text-2xl font-bold text-[#00313A]">
                  OpusList
                </span>
              </div>
              <MenuIcon className="h-5 w-5 md:hidden" />
              <nav className="hidden md:flex gap-6 text-[#00313A]/80 items-center">
                <a href="#features" onClick={scrollToFeatures}>Features</a>
                <a href="/pricing">Pricing</a>
                <div className="relative group">
                  <a href="#" className="flex items-center">
                    Resources
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </a>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">About Us</a>
                      <a href="/changelog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Changelog</a>
                      <a href="mailto:support@opuslist.ai" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Support</a>
                    </div>
                  </div>
                </div>
                <a href="https://calendly.com/opuslist/product-demo" className="text-[#00313A]/80 hover:text-[#00313A]">Book Demo</a>
                <Link href="https://airtable.com/appvtWDhbKDDRZ7TE/pagtxfT0t3i2nOu4H/form" className="bg-[#00313A] text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight hover:bg-[#004A59] transition-colors">
                  Request Access
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
    </header>
  );
};
