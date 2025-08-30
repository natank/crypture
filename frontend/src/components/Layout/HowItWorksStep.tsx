import React from 'react';
import { motion } from 'framer-motion';

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export function HowItWorksStep({ number, title, description, icon, delay = 0 }: HowItWorksStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay * 0.2 }}
      className="relative flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
    >
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 text-white font-bold text-lg shadow-lg">
        {number}
      </div>
      <div className="mt-6 mb-4 p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-200">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-500 text-center">{description}</p>
    </motion.div>
  );
}

export default HowItWorksStep;
