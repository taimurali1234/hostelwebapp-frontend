import {  Pencil, Trash2 } from "lucide-react";

export interface ReviewRowType {
  id: string;

  user: {
    id: string;
    name: string;
  };

  room: {
    id: string;
    title: string;
  };

  rating: number; // 1–5
  comment?: string;
  createdAt: string;
  status: "APPROVED" | "PENDING";
 

}
interface ReviewsRowProps {
  review: ReviewRowType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}


export function ReviewsRow({ review,onEdit,onDelete }: ReviewsRowProps) {
  return (
    <tr className="border-b last:border-none">
      {/* User */}
      <td className="px-6 py-4">
        {review.user?.name ?? "-"}
      </td>

      {/* Room */}
      <td className="px-6 py-4 text-gray-600">
        {review.room?.title ?? "-"}
      </td>

      {/* Rating */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>
              {index < review.rating ? "★" : "☆"}
            </span>
          ))}
          <span className="text-gray-600 ml-2">
            ({review.rating})
          </span>
        </div>
      </td>

      {/* Comment */}
      <td className="px-6 py-4 text-gray-600 max-w-sm truncate">
        {review.comment || "-"}
      </td>

      

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium ${
            review.status === "APPROVED"
              ? "text-green-500"
              : "text-yellow-500"
          }`}
        >
          {review.status}
        </span>
      </td>
      {/* Date */}
      <td className="px-6 py-4 text-gray-600">
        {new Date(review.createdAt).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex gap-4 text-gray-600">
          <Pencil onClick={() => onEdit(review.id)} className="cursor-pointer hover:text-black" size={18} />
          <Trash2 onClick={() => onDelete(review.id)} className="cursor-pointer text-red-500" size={18} />
        </div>
      </td>
    </tr>
  );
}
