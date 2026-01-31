import { Plane, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VisitOfficeSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative bg-[#eef6f5] py-20 px-6 text-center"
      
    >
      <div className="absolute " />

      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Visit Us */}
        <div className="bg-white rounded-2xl p-8 shadow">
          <Plane className="mx-auto text-green-600" size={40} />
          <h3 className="font-semibold text-xl mt-4">Visit Us</h3>
          <p className="text-gray-600 mt-2">
            View our rooms and book a tour anytime during our office
            hours!
          </p>
          <button onClick={() => navigate("/bookings")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
            Book a Room
          </button>
        </div>

        {/* Office Hours */}
        <div className="bg-white rounded-2xl p-8 shadow">
          <Clock className="mx-auto text-green-600" size={40} />
          <h3 className="font-semibold text-xl mt-4">Office Hours</h3>
          <p className="text-gray-600 mt-2">
            Monday – Friday: 9:00 AM – 6:00 PM <br />
            Saturday & Sunday: 10:00 AM – 4:00 PM
          </p>
          <button onClick={() => navigate("/bookings")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
            Book a Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default VisitOfficeSection;
