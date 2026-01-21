import { type Review } from "./TestimonialsSection";

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
   <div className="bg-white rounded-xl shadow-md p-5 min-w-[300px] mx-3">
      <div className="flex text-yellow-400 mb-2">
        {Array.from({ length: review.rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>

      <p className="text-gray-700  text-sm mb-3">
        {review.message}
      </p>

      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="text-sm font-semibold">{review.name}</h4>
          <p className="text-xs text-gray-500">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
