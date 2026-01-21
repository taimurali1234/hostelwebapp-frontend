import { MapPin, Phone, Mail } from "lucide-react";

const ContactInfo = () => {
  return (
    <section className="bg-[#eef6f5] py-16 px-6 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-8">Contact Us</h2>

      <div className="flex flex-col gap-6 items-center text-gray-700">
        <div className="flex items-center gap-3">
          <MapPin className="text-green-600" />
          <span>123 University Ave, Campus City, ST 12345</span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-green-600" />
          <span>+1 (555) 123-4567</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-green-600" />
          <span>info@studenthostel.com</span>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
