/**
 * FAQs Component
 *
 * Displays AI-generated FAQs based on the transcript.
 * Accordion-style expandable items.
 */

import { useState } from "react";

function FAQs({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">FAQs</h3>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">
                {faq.question}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 animate-fade-in">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQs;
