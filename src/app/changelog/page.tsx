import React from 'react';
import Header from '@/b2cSections/Header';
import { Footer } from '@/b2bSections/Footer';

const ChangelogPage = () => {
  return (
    <>
      <Header />
      <section className='bg-gradient-to-b from-[#E8F4F7] to-white' >
      <main className="container mx-auto px-4 py-8 bg-gradient-to-b from-[#E8F4F7] to-white pt-[6rem]' />">
        
        <h1 className="text-3xl font-bold mb-6">Changelog</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Beta Release v0.1.0</h2>
          <p className="text-gray-600 mb-4">Coming soon: </p>
          
          <h3 className="text-xl font-semibold mb-2">New Features:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>AI-powered task scheduling</li>
            <li>Drag-and-drop calendar interface</li>
            <li>Basic task management functionality</li>
            <li>User authentication and account creation</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Improvements:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Responsive design for mobile and desktop</li>
            <li>Performance optimizations for faster load times</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Bug Fixes:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Fixed issue with task creation in certain timezones</li>
            <li>Resolved calendar rendering problems on Safari browsers</li>
          </ul>

          <p className="text-gray-600 italic">
            Note: This is a beta release. Some features may be unstable or incomplete. 
            We appreciate your feedback as we work towards our official release.
          </p>
        </section>
      </main>
      </section>
      <Footer />
    </>
  );
};

export default ChangelogPage;

