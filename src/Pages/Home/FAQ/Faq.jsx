import React from 'react';

const Faq = () => {
  const faqs = [
    {
      question: 'How does this posture corrector work?',
      answer:
        "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
    },
    {
      question: 'Is it suitable for all ages and body types?',
      answer:
        'Yes, our posture corrector is designed to be adjustable and comfortable for a wide range of ages and body types. Please refer to the sizing guide for optimal fit.',
    },
    {
      question: 'Does it really help with back pain and posture improvement?',
      answer:
        'Regular and consistent use of a posture corrector can significantly help in reducing back pain and improving overall posture by retraining your muscles and supporting proper spinal alignment.',
    },
    {
      question: 'Does it have smart features like vibration alerts?',
      answer:
        'Our Posture Pro model includes smart features such as gentle vibration alerts to remind you when you slouch, helping you maintain correct posture throughout the day.',
    },
    {
      question: 'How will I be notified when the product is back in stock?',
      answer:
        'You can sign up for email notifications on our product page. We will send you an email as soon as the Posture Pro is back in stock.',
    },
  ];

  return (
    <section className="bg-blue-100 rounded-2xl py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-4xl mx-auto">
        {/* Title and Description */}
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Enhance posture, mobility, and well-being effortlessly with Posture
            Pro. Achieve proper alignment, reduce pain, and strengthen your body
            with ease!
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-white shadow-md rounded-lg border border-teal-200/50 has-[:checked]:bg-teal-100 has-[:checked]:text-gray-900 transition-colors duration-300"
            >
              <input
                type="checkbox"
                name="my-accordion-2"
                defaultChecked={index === 0}
              />
              <div className="collapse-title text-lg sm:text-xl font-semibold text-gray-800 p-4  ">
                {faq.question}
              </div>
              <div className="collapse-content px-4 pb-4 border-t border-dashed">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* See More FAQ's Button */}
        <div className="mt-12 flex justify-center">
          <button className="btn bg-lime-300 hover:bg-lime-400 text-gray-800 font-semibold px-6 py-3 rounded-full shadow-lg flex items-center group">
            See More FAQ's
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Faq;
