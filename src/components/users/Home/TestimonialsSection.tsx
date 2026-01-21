import ReviewCard from "./ReviewCard";

export interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  message: string;
}


const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "University Student",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    message:
      "Great place for students! Clean rooms, friendly staff, and excellent location near campus. The study areas are perfect for group projects.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Visiting Researcher",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    message:
      "I stayed here for 3 months during my research fellowship. The rooms are comfortable, WiFi is fast, and the community vibe is amazing.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Exchange Student",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    message:
      "Affordable and convenient. The shared kitchen is well-equipped and I made many friends here. Highly recommend for international students!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Exchange Student",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    message:
      "Affordable and convenient. The shared kitchen is well-equipped and I made many friends here. Highly recommend for international students!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Exchange Student",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    message:
      "Affordable and convenient. The shared kitchen is well-equipped and I made many friends here. Highly recommend for international students!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Exchange Student",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    message:
      "Affordable and convenient. The shared kitchen is well-equipped and I made many friends here. Highly recommend for international students!",
  },
];

const TestimonialsSection: React.FC = () => {
 

  return (
    <section
      className="relative bg-cover bg-center py-20 overflow-hidden px-6 "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative text-center text-white mb-20">
        <h2 className="text-4xl font-bold">What Our Guests Say</h2>
        <p className="text-gray-200 mt-2">
          Real reviews from students and visitors who stayed with us
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden">
        {/* Left Shadow */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-24 
  bg-gradient-to-r from-black/70 to-transparent z-10" />

  {/* Right Shadow */}
  <div className="pointer-events-none absolute right-0 top-0 h-full w-24 
  bg-gradient-to-l from-black/70 to-transparent z-10" />
        <div className="flex animate-marquee ">

          {[...reviews, ...reviews].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}

        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
