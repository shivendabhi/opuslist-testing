import Image from "next/image";
import logo from "@/assets/opuslistlogo.png";
import { Twitter, Linkedin, Slack, Instagram , YoutubeIcon} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#000E14] text-white py-16">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0 md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <Image src={logo} height={40} alt="OpusList logo" />
              <span className="text-xl font-bold">OpusList</span>
            </div>
            <p className="text-white/60 mb-4">
              Plan and schedule your tasks with ease.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/opuslistai" className="text-white/60 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/opuslist" className="text-white/60 hover:text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://x.com/opuslistai" className="text-white/60 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="https://www.youtube.com/@opuslist" className="text-white/60 hover:text-white">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:gap-16 md:ml-auto">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <nav className="flex flex-col gap-2">
                <a href="/about" className="text-white/60 hover:text-white">About Us</a>
                <a href="/pricing" className="text-white/60 hover:text-white">Pricing</a>
                <a href="/changelog" className="text-white/60 hover:text-white">Changelog</a>
                <a href="mailto:careers@opuslist.ai" className="text-white/60 hover:text-white">Careers</a>
                <a href="mailto:support@opuslist.ai" className="text-white/60 hover:text-white">Support</a>
                <a href="https://calendly.com/opuslist/product-demo" className="text-white/60 hover:text-white">Book Demo</a>
              </nav>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <nav className="flex flex-col gap-2">
                <a href="/privacy-policy" className="text-white/60 hover:text-white">Privacy Policy</a>
                <a href="/terms-of-service" className="text-white/60 hover:text-white">Terms of Service</a>
                <a href="/security" className="text-white/60 hover:text-white">Security</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-white/60 text-sm">
            &copy; 2024 OpusList LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
