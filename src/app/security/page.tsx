import React from 'react';
import Header from "@/b2cSections/Header";
import Footer from "@/b2cSections/Footer";

const SecurityPage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">OpusList Security</h1>
        <p className="mb-8 text-lg">At OpusList, we take the security of your data seriously. Our commitment to security is fundamental to our service, and we employ industry-standard practices to protect your information.</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Encryption</h2>
          <p>We use strong encryption protocols to protect your data both in transit and at rest:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>All data transmitted between your devices and our servers is encrypted using TLS (Transport Layer Security).</li>
            <li>Your data is encrypted at rest in our databases using AES-256 encryption.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Access Control</h2>
          <p>We implement strict access controls to ensure that only authorized personnel can access our systems:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Multi-factor authentication is required for all staff accessing our systems.</li>
            <li>Access to user data is strictly limited and audited.</li>
            <li>We follow the principle of least privilege, ensuring employees only have access to the data they need to perform their job functions.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Network Security</h2>
          <p>Our network is protected by multiple layers of security:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Firewalls and intrusion detection systems monitor and protect our network.</li>
            <li>Regular vulnerability scans and penetration tests are conducted to identify and address potential security issues.</li>
            <li>We use content delivery networks (CDNs) and DDoS protection to ensure service availability.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Backup and Recovery</h2>
          <p>We maintain regular backups of all user data:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Automated backups are performed daily.</li>
            <li>Backups are encrypted and stored in geographically diverse locations.</li>
            <li>We have a comprehensive disaster recovery plan to ensure data can be restored quickly in case of any incidents.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Employee Training</h2>
          <p>Our team is trained to handle your data with care:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>All employees undergo regular security awareness training.</li>
            <li>We have strict policies and procedures in place for handling sensitive information.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Compliance</h2>
          <p>We adhere to industry standards and regulations:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Our systems and practices are regularly audited for compliance with relevant standards.</li>
            <li>We are committed to complying with data protection regulations such as GDPR and CCPA.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Incident Response</h2>
          <p>In the unlikely event of a security incident:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>We have a dedicated incident response team ready to act immediately.</li>
            <li>Our incident response plan includes steps for containment, eradication, and recovery.</li>
            <li>We are committed to transparent communication with our users in case of any security events that may affect them.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Role in Security</h2>
          <p>While we take extensive measures to protect your data, you also play a crucial role in maintaining security:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Use strong, unique passwords for your OpusList account.</li>
            <li>Enable two-factor authentication for an extra layer of security</li>
            <li>Be cautious of phishing attempts and never share your login credentials.</li>
            <li>Keep your devices and software up to date.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>If you have any questions about our security practices or want to report a security concern, please contact our security team at: <a href="mailto:security@opuslist.ai" className="text-blue-500 hover:text-blue-600">security@opuslist.ai</a></p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SecurityPage;

