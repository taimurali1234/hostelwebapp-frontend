import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className=" my-10">
      <div
        className="bg-[#33837a]  
        py-14 sm:py-16 lg:py-20 
        text-center text-white"
      >
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Ready to Find Your Perfect Room?
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-white/90 mt-3">
          Join hundreds of happy students who call StayHub their home
        </p>

        {/* Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/rooms")}
            className="bg-white text-[#2f9a8a] 
            px-6 py-3 rounded-full 
            font-medium flex items-center cursor-pointer gap-2 
            mx-auto hover:bg-gray-100 transition"
          >
            Browse Available Room
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
