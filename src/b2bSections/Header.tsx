"use client";
import { useState, useEffect } from "react";
import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/opuslistlogo.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

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
                <a href="#">Solutions</a>
                <a href="#">Features</a>
                <a href="#">Customers</a>
                <a href="#">Pricing</a>
                <a href="#">Resources</a>
                <LoginLink className="bg-[#00313A] text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight hover:bg-[#004A59] transition-colors">
                    Get Started
                </LoginLink>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
