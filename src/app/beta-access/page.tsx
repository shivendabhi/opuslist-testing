'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/b2cSections/Header";
import { Footer } from "@/b2bSections/Footer";
import { motion } from 'framer-motion';

const BetaAccessPage = () => {
  const [betaCode, setBetaCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (betaCode === 'controlyourtime') {
      router.push('/api/auth/register');
    } else {
      setError('Invalid beta code. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#E8F4F7] to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-6 text-[#00313A] text-center">Enter Beta Access Code</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={betaCode}
                onChange={(e) => setBetaCode(e.target.value)}
                placeholder="Enter your beta code"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00313A] transition"
                required
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-[#00313A] text-white px-4 py-2 rounded-lg hover:bg-[#004A59] transition-colors"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default BetaAccessPage;
