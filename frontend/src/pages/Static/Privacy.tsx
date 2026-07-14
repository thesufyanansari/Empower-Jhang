import React from 'react';
import { Card } from '../../components/ui/Card';

export const Privacy: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="font-poppins text-3xl font-extrabold text-heading dark:text-white text-center">
          Privacy Policy
        </h1>
        
        <Card className="p-8 space-y-6 text-sm text-text-body dark:text-slate-300 leading-relaxed">
          <p>Last updated: July 12, 2026</p>
          
          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">1. Information We Collect</h2>
          <p>
            When you register on Empower Jhang, we collect details including your Full Name, Father's Name, WhatsApp Number, Location/Tehsil, Date of Birth, Education, Occupation, and social links to generate your public member profile and Digital Member Card.
          </p>

          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">2. Public Member Directory</h2>
          <p>
            Empower Jhang is a networking platform. Your digital member card, name, occupation, district, join date, and digital skills are visible publicly at your profile URL (e.g. <code>/member/EMP-XXXXXX</code>) to foster collaboration. Private details like your address, email, and WhatsApp number are only visible to yourself and platform administrators.
          </p>

          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">3. Security</h2>
          <p>
            We use secure database servers (Supabase) to store member profiles. Row Level Security policies prevent unauthorized access or changes to your personal details.
          </p>

          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">4. Contact Us</h2>
          <p>
            If you have questions about our privacy terms or want to deactivate/delete your member profile, contact us at <code>info@empowerjhang.org</code>.
          </p>
        </Card>
      </div>
    </div>
  );
};
