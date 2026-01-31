import { useState } from "react";
import SectionHeader from "../../common/SectionHeader";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What is the check-in and check-out time?",
    answer: "Check-in is from 2:00 PM and check-out is by 11:00 AM.",
  },
  {
    id: 2,
    question: "What amenities are included?",
    answer: "Free WiFi, laundry, shared kitchen, study areas, and 24/7 security.",
  },
  {
    id: 3,
    question: "Is there a cancellation policy?",
    answer: "Yes, cancellations are allowed up to 48 hours before check-in.",
  },
  {
    id: 4,
    question: "Are meals included in the room price?",
    answer: "Meals are optional and can be added separately.",
  },
  {
    id: 5,
    question: "Is there parking available?",
    answer: "Yes, we offer free parking for residents.",
  },
  {
    id: 6,
    question: "What payment methods do you accept?",
    answer: "We accept cash, debit/credit cards, and online transfers.",
  },
];


const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our hostel"
        />

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border-b  border-gray-300 pb-4"
            >
              {/* Question */}
              <button
                onClick={() =>
                  setOpenId(openId === faq.id ? null : faq.id)
                }
                className="w-full flex justify-between items-center 
                text-left text-lg font-medium text-gray-900 cursor-pointer"
              >
                {faq.question}
                <span
                  className={`transform cursor-pointer transition ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                >
                  <FaChevronDown className="text-gray-600" />
                </span>
              </button>

              {/* Answer */}
              {openId === faq.id && (
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
