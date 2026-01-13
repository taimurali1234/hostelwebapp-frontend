import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Button from "../common/Button";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-12 
        grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

        {/* About */}
        <div className="space-y-5">
          <h3 className="text-white text-xl font-semibold tracking-wide">
            About Us
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            We provide comfortable, affordable hostel accommodations
            for students and visitors. Your home away from home,
            designed with care and convenience.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook size={18} />} />
            <SocialIcon icon={<Twitter size={18} />} />
            <SocialIcon icon={<Linkedin size={18} />} />
            <SocialIcon icon={<Instagram size={18} />} />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-5">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {["Home", "Rooms", "Facilities", "About", "Contact"].map(
              (item) => (
                <li
                  key={item}
                  className="hover:text-green-400 cursor-pointer transition"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-5">
            Legal
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              "Telecommunications",
              "Hotels & Tourism",
              "Construction",
              "Education",
              "Financial Services",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-green-400 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <h3 className="text-white text-xl font-semibold">
            Contact Us
          </h3>

          <div className="space-y-3 text-sm">
            <ContactItem
              icon={<MapPin size={16} />}
              text="123 University Ave, Campus City, ST 12345"
            />
            <ContactItem
              icon={<Phone size={16} />}
              text="+1 (555) 123-4567"
            />
            <ContactItem
              icon={<Mail size={16} />}
              text="info@studenthostel.com"
            />
          </div>

          <Button
            label="Contact via WhatsApp"
            className="w-full mt-3"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Student Hostel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ------------------------
   Small Helper Components
------------------------- */

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="p-2 rounded-full bg-gray-800 hover:bg-green-500 text-white cursor-pointer transition">
      {icon}
    </div>
  );
}

function ContactItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-green-400 mt-1">{icon}</span>
      <span className="text-gray-400">{text}</span>
    </div>
  );
}
