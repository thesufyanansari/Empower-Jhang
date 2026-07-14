import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center bg-bg-section dark:bg-slate-950 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md space-y-6"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-red-150 dark:bg-red-950/20 flex items-center justify-center text-danger">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-poppins text-7xl font-black text-primary-blue dark:text-blue-500">404</h1>
          <h2 className="font-poppins text-xl font-bold text-heading dark:text-white">Page Not Found</h2>
          <p className="text-sm text-text-body dark:text-slate-400 leading-relaxed">
            The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>
        </div>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </motion.div>
    </div>
  );
};
