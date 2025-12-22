import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
interface RelatedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}
export function RelatedQuestions({
  questions,
  onSelect
}: RelatedQuestionsProps) {
  return <div className="mt-6 space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Related
      </h4>
      {questions.map((question, index) => <motion.button key={index} initial={{
      opacity: 0,
      x: -10
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      delay: index * 0.1
    }} onClick={() => onSelect(question)} className="flex items-center w-full text-left gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
          <Plus className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            {question}
          </span>
        </motion.button>)}
    </div>;
}