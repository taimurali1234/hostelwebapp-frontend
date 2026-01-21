import { Shield, Sofa, DollarSign, MapPin } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section
      className="relative py-20 px-6 text-center text-white"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">
          Why Choose Us
        </h2>
        <p className="text-gray-200 mb-12">
          Ready to join our community? Explore our cozy rooms and book your stay today!
        </p>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Security", desc: "24/7 security for peace of mind" },
            { icon: Sofa, title: "Comfort", desc: "Fully furnished cozy rooms" },
            { icon: DollarSign, title: "Affordable Pricing", desc: "Budget-friendly plans" },
            { icon: MapPin, title: "Prime Location", desc: "Near universities & transport" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white text-black rounded-2xl p-6 shadow"
            >
              <item.icon className="mx-auto text-[#2f9a8a]" size={40} />
              <h3 className="font-semibold mt-4">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
