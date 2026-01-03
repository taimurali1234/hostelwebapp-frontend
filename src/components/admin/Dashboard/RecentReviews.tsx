import StarRating from "../../common/StarRating";

// const reviews = [
//   {
//     name: "Sara Ahmed",
//     comment: "Room was okay but breakfast could be better",
//     rating: 3,
//   },
//   {
//     name: "Ali Khan",
//     comment: "Excellent service and clean rooms",
//     rating: 4.5,
//   },
// ];
interface Review {
  rating: number;
  comment: string;
  user: {
    name: string;
  };
}

export default function RecentReviews({
  reviews,
}: {
  reviews: Review[];
}) {
  return (
    <div className="border col-span-5 border-[#989FAD] rounded-xl p-4 bg-white">
      <h3 className="font-semibold mb-3">Recent Reviews</h3>

      {reviews.map((review, index) => (
        <div
          key={index}
          className={`pb-3 ${
            index !== reviews.length - 1
              ? "border-b border-[#989FAD] mb-3"
              : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-medium">{review.user?.name}</p>
            <StarRating rating={review.rating} />
          </div>

          <p className="text-sm text-gray-700 mt-1">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
