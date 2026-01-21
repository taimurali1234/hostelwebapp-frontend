import { User, Mail, Phone, MessageSquare } from "lucide-react";

const ContactFormSection = () => {
  return (
    <section className="py-20 px-6 text-center bg-white">
      <h2 className="text-2xl md:text-4xl font-bold mb-2">
        Send Us a Message
      </h2>
      <p className="text-gray-600 mb-10 max-w-xl mx-auto">
        We’d love to hear from you! Fill out the form below and we’ll get
        back to you as soon as possible.
      </p>

      <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 border">
        <h3 className="font-semibold text-lg mb-4">Contact Form</h3>

        <form className="space-y-4">
          <Input icon={<User />} placeholder="Full Name" />
          <Input icon={<Mail />} placeholder="Email Address" />
          <Input icon={<Phone />} placeholder="Phone Number" />
          <Input icon={<MessageSquare />} placeholder="Subject" />

          <textarea
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600"
            placeholder="Your Message"
            rows={4}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

const Input = ({ icon, placeholder }: any) => (
  <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-green-600">
    <span className="text-gray-400">{icon}</span>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full outline-none text-sm"
    />
  </div>
);

export default ContactFormSection;
