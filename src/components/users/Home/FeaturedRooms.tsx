import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import RoomCard from "./RoomCards";
import SectionHeader from "../../common/SectionHeader";

export interface Room {
  id: number;
  title: string;
  image: string;
  type: "Single" | "Double" | "Triple" | "Quad" | "Quant" | "VIP";
  beds: number;
  price?: number;
  shortTermPrice?: number;
  longTermPrice?: number;
  status: "Available" | "Full";
}

const roomsData: Room[] = [
  {
    id: 1,
    title: "Deluxe Single Room",
    image: "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/cppqzckli7g92t5vk05e",
    type: "Single",
    beds: 1,
    price: 25,
    status: "Available",
  },
  {
    id: 2,
    title: "Premium Double Room",
    image: "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/cppqzckli7g92t5vk05e",
    type: "Double",
    beds: 2,
    price: 40,
    status: "Available",
  },
  {
    id: 3,
    title: "Triple Comfort Room",
    image: "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/cppqzckli7g92t5vk05e",
    type: "Triple",
    beds: 3,
    price: 55,
    status: "Full",
  },
  {
    id: 4,
    title: "Quad Family Room",
    image: "https://res.cloudinary.com/taimurali/image/upload/c_scale,w_1920/f_webp/estateapp/cppqzckli7g92t5vk05e",
    type: "Quad",
    beds: 4,
    price: 70,
    status: "Available",
  },
];

const VISIBLE_CARDS = 3;
const maxIndex = roomsData.length - VISIBLE_CARDS;

const FeaturedRooms: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  const next = (): void => {
  if (index < maxIndex) {
    setIndex(index + 1);
  }
};

const prev = (): void => {
  if (index > 0) {
    setIndex(index - 1);
  }
};



  return (
    <section className="bg-white px-6 py-16 ">
      <div className="">

        {/* Header */}
          <SectionHeader
  title="Our Featured Rooms"
  subtitle="Explore our most popular accommodations, perfect for students and travelers"
/>


          
        {/* Arrows */}
          <div className="flex items-center  justify-end gap-3 mt-4 md:mt-0 mb-6">
            <button
  onClick={prev}
  disabled={index === 0}
  className={`p-3 rounded-full transition
    ${
      index === 0
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gray-800 text-white cursor-pointer hover:bg-green-600"
    }`}
>
  <FaArrowLeft />
</button>

            <button
  onClick={next}
  disabled={index >= maxIndex}
  className={`p-3 rounded-full transition
    ${
      index >= maxIndex
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gray-800 text-white cursor-pointer hover:bg-green-600"
    }`}
>
  <FaArrowRight />
</button>

          </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
  transform: `translateX(-${index * (100 / 3)}%)`,
}}
          >
            {roomsData.map((room) => (
              <div
                key={room.id}
                className="min-w-full sm:min-w-[50%] lg:min-w-[33%] px-3 "
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
