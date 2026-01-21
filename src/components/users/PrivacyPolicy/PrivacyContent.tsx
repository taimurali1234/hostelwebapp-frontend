import { Shield, Info, Book, MessageSquare, Lightbulb, DollarSign, Lock, UserCheck } from "lucide-react";
import InfoBox from "./InfoBox";
import PolicyCard from "./PolicyCard";

const PrivacyContent = () => {
  return (
    <section className=" md:max-w-xl lg:max-w-3xl mx-auto px-5 py-16 space-y-20">

      {/* Information We Collect */}
      <div>
        <h2 className="text-xl md:text-2xl md:font-bold  font-semibold flex justify-center items-center gap-2">
          <Info className="text-green-600" /> Information We Collect
        </h2>
        <p className="mt-3 text-gray-600 max-w-[350px] text-center mx-auto text-sm md:text-lg">
          We collect personal information such as your name, email address, phone
          number, and booking details when you use our services.
        </p>
      </div>

      {/* How We Use Your Information */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-center mb-10">
          How We Use Your Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PolicyCard
            icon={<Book />}
            title="Booking Management"
            desc="We use your information to manage room reservations, check availability, and confirm bookings smoothly."
          />

          <PolicyCard
            icon={<MessageSquare />}
            title="Communication"
            desc="Your contact details help us send booking confirmations, reminders, and important hostel updates."
          />

          <PolicyCard
            icon={<Lightbulb />}
            title="Service"
            desc="We analyze user data to improve hostel facilities, website experience, and overall service quality."
          />

          <PolicyCard
            icon={<DollarSign />}
            title="Secure Payments"
            desc="Your information is used to process payments safely through trusted and secure payment gateways."
          />
        </div>
      </div>

      {/* Third Party */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Third-Party Services
        </h2>

        <InfoBox
          icon={<Lightbulb />}
          text="We may use third-party services like Stripe or PayPal for payment processing. These services have their own privacy policies."
        />
      </div>

      {/* Security */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Security Measures
        </h2>

        <InfoBox
          icon={<Shield />}
          text="We implement strong security measures to protect your personal data from unauthorized access."
        />
      </div>

      {/* Rights */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Your Rights
        </h2>

        <InfoBox
          icon={<UserCheck />}
          text="You have the right to access, update, or request deletion of your personal data at any time."
        />
      </div>

    </section>
  );
};

export default PrivacyContent;
