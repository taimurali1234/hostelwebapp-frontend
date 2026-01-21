import { Target, Eye } from "lucide-react";

const MissionVision = () => {
  return (
    <section className="bg-[#eef6f5] border-b border-[#9fd2c8] py-20 px-6 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-2">
        Mission & Vision
      </h2>
      <p className="text-gray-700 mb-12">
        Create and promote community for students and vision.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-white rounded-2xl p-8 shadow">
          <Target className="mx-auto text-[#2f9a8a]" size={40} />
          <h3 className="font-semibold text-xl mt-4">Mission</h3>
          <p className="text-gray-600 mt-2">
            To provide a secure, comfortable, and student-friendly living
            environment that feels like a second home.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-2xl p-8 shadow">
          <Eye className="mx-auto text-[#2f9a8a]" size={40} />
          <h3 className="font-semibold text-xl mt-4">Vision</h3>
          <p className="text-gray-600 mt-2">
            Our vision is to create a community where students can thrive,
            feel safe, and achieve their academic goals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
