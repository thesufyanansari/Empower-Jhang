import React from 'react';
import { Card } from '../../components/ui/Card';

export const Terms: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-bg-section dark:bg-slate-950 py-16 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="font-poppins text-3xl font-extrabold text-heading dark:text-white text-center">
          Terms of Service
        </h1>
        
        <Card className="p-8 space-y-6 text-sm text-text-body dark:text-slate-300 leading-relaxed">
          <p>Last updated: July 12, 2026</p>

          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">1. Membership Acceptance</h2>
          <p>
            By registering for a digital member identity card, you agree to represent yourself honestly. Any profiles found with fake names, false locations, or misleading information will be suspended or permanently deleted.
          </p>

          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">2. Community Guidelines</h2>
          <p>
            Empower Jhang is a positive, supportive tech circle. In our WhatsApp community channels, members must maintain professionalism. Any form of harassment, spam, unsolicited marketing, political discussions, or hate speech will result in immediate removal from all official groups and deactivation of the member card.
          </p>

          <h2 className="font-poppins text-lg font-bold text-heading dark:text-white mt-4">3. Fees & Commercial Operations</h2>
          <p>
            All core education, skills resources, workshops, and membership cards provided directly by Empower Jhang are 100% free. We will never ask you for money to join groups or download identity cards.
          </p>
        </Card>
      </div>
    </div>
  );
};
