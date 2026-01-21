import TermCard from "./TermsCard";
// termsData.ts
export const termsData = [
  {
    id: "booking",
    title: "Booking & Payment",
    icon: "bookmark",
    description:
      "To secure your booking, either full or partial payment is required at the time of reservation. Please note that prices may vary depending on room availability and seasonal demand. We recommend confirming your booking as early as possible to ensure your preferred dates and rates.",
  },
  {
    id: "cancellation",
    title: "Cancellation & Refunds",
    icon: "x",
    description:
      "Cancellations must be made within the timeframe specified in our hostel policies. Refunds, if applicable, will be processed in accordance with our cancellation policy. We encourage guests to review the policy carefully to avoid any inconvenience.",
  },
  {
    id: "responsibility",
    title: "User Responsibilities",
    icon: "user",
    description:
      "All guests are required to adhere to the hostel's rules and regulations to ensure a safe and pleasant stay for everyone. Any damage to the property or its facilities will be charged to the responsible guest.",
  },
  {
    id: "liability",
    title: "Liability Disclaimer",
    icon: "alert",
    description:
      "The hostel cannot be held responsible for the loss, theft, or damage of personal belongings. Guests are advised to take necessary precautions and keep their valuables secure during their stay.",
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: "contact",
    description:
      "For questions regarding terms, please contact our support team.",
  },
];

const TermsContent = () => {
  return (
    <section className="md:max-w-xl lg:max-w-3xl mx-auto px-5 py-16 space-y-14">

      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className=" text-xl md:text-2xl font-bold">
          Welcome to Our Hostel’s Terms & Conditions
        </h2>
        <p className="text-gray-600 mt-3 mx-auto text-sm md:text-base max-w-76 md:max-w-[470px]">
          By accessing our website or booking a room, you agree to comply with the
          rules, policies, and guidelines outlined here. These terms are designed
          to ensure a safe, fair, and smooth experience for all guests using our
          hostel services.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {termsData.map((item) => (
          <div key={item.id}>
            <h2 className=" text-lg md:text-xl font-semibold md:font-bold mb-4">{item.title}</h2>

            <TermCard
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TermsContent;
