import Image from "next/image";
import logo from "@/assets/opuslistlogo.png";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedIn from "@/assets/social-linkedin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";

export const Footer = () => {
  return (
    <footer className="bg-[#000E14] text-white py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={logo} height={40} alt="OpusList logo" />
              <span className="text-xl font-bold">OpusList</span>
            </div>
            <p className="text-white/80">
              Empowering teams to achieve more through intelligent time
              management.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-white/80 hover:text-white">
                For Enterprises
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                For Small Teams
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                For Freelancers
              </a>
            </nav>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-white/80 hover:text-white">
                About Us
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                Careers
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                Press
              </a>
            </nav>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-white/80 hover:text-white">
                Blog
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                Help Center
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                API Documentation
              </a>
            </nav>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; 2024 OpusList LLC. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="https://www.instagram.com/opuslistai/"
              className="text-white/60 hover:text-white"
            >
              <SocialInsta />
            </a>
            <a
              href="https://www.linkedin.com/company/opuslist/"
              className="text-white/60 hover:text-white"
            >
              <SocialLinkedIn />
            </a>
            <a
              href="https://www.youtube.com/@opuslist"
              className="text-white/60 hover:text-white"
            >
              <SocialYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
