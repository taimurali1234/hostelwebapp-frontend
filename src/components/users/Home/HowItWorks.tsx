import { FaSearch, FaBookmark, FaCheckCircle, FaDollarSign } from "react-icons/fa";
import SectionHeader from "../../common/SectionHeader";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Search",
    description: "Browse available rooms and find your perfect match",
    icon: <FaSearch size={22} />,
  },
  {
    id: 2,
    title: "Book",
    description: "Select your dates and reserve your room instantly",
    icon: <FaBookmark size={22} />,
  },
  {
    id: 3,
    title: "Confirm",
    description: "Receive confirmation and booking details via email",
    icon: <FaCheckCircle size={22} />,
  },
  {
    id: 4,
    title: "Payment",
    description: "Complete secure payment and enjoy your stay",
    icon: <FaDollarSign size={22} />,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-[#eef6f5] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">

        {/* Header */}
        <SectionHeader
          title="How It Works"
          subtitle="Book your room in just four simple steps"
        />
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group cursor-pointer bg-white border border-gray-300 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-full 
                  bg-black text-white transition-all duration-300 
                  group-hover:bg-green-600"
                >
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mt-6 text-gray-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
