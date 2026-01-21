import { useEffect, useState } from "react";

const teamMembers = [
  { name: "Ayesha Khan", role: "Hostel Coordinator", img: "https://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Asif Khan", role: "Admin Officer", img: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Afifa Malik", role: "Assistant Coordinator", img: "https://randomuser.me/api/portraits/women/3.jpg" },
  { name: "Imran Siddiqui", role: "Accounts Manager", img: "https://randomuser.me/api/portraits/men/4.jpg" },
  { name: "Sara Ali", role: "Receptionist", img: "https://randomuser.me/api/portraits/women/5.jpg" },
  { name: "Hassan Raza", role: "Security Head", img: "https://randomuser.me/api/portraits/men/6.jpg" },
];


const TeamSlider = () => {
  const [index, setIndex] = useState(0);

  const getCardsPerView = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + cardsPerView >= teamMembers.length ? 0 : prev + cardsPerView
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [cardsPerView]);

  const visibleMembers = teamMembers.slice(index, index + cardsPerView);

  return (
    <section className="bg-gray-100 py-20 px-6 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-2">Our Team</h2>
      <p className="text-gray-600 mb-10">
        Let the hostel coordinator and admin team crew.
      </p>

      <div className="max-w-6xl mx-auto overflow-hidden">
        <div className="flex gap-6 justify-center transition-all duration-700">
          {visibleMembers.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow w-[250px]"
            >
              <img
                src={m.img}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <h3 className="font-semibold mt-4">{m.name}</h3>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSlider;
