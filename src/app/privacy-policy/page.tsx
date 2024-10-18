import React from 'react';
import Header from "@/b2cSections/Header";
import Footer from "@/b2cSections/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: 10/17/2024</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>Welcome to OpusList ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect personal information that you provide to us, such as:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Task and schedule data</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide and maintain our services</li>
            <li>Improve and personalize user experience</li>
            <li>Process payments and prevent fraud</li>
            <li>Communicate with you about our services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Use of Data for AI Models</h2>
          <p>At OpusList, we utilize artificial intelligence (AI) to enhance our services and provide personalized experiences. Here's how we use your data in our AI models:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Task Optimization: We analyze your task completion patterns and preferences to suggest more efficient scheduling and prioritization.</li>
            <li>Productivity Insights: Our AI models process your usage data to provide personalized productivity insights and recommendations.</li>
            <li>Natural Language Processing: We may use text from your tasks and notes to improve our AI's understanding of task descriptions and context.</li>
            <li>Predictive Analytics: Your historical data helps our AI predict future workloads and suggest proactive measures to manage your time effectively.</li>
          </ul>
          <p className="mt-4">Important notes about our AI data usage:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Data Anonymization: When used for training our AI models, your data is anonymized to protect your privacy.</li>
            <li>Opt-Out Option: You can choose to opt-out of having your data used for AI model training in your account settings.</li>
            <li>Data Security: We employ strict security measures to protect your data during AI processing, including encryption and access controls.</li>
            <li>Continuous Improvement: Our AI models are regularly updated to enhance accuracy and effectiveness while maintaining user privacy.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Service providers and business partners</li>
            <li>Legal and regulatory authorities</li>
            <li>Potential buyers or investors (in the event of a sale, merger, or acquisition)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
          <p>You have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Accessing and updating your information</li>
            <li>Requesting deletion of your data</li>
            <li>Opting out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:contact@opuslist.ai" className="text-blue-500 hover:text-blue-600">contact@opuslist.ai</a></p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
