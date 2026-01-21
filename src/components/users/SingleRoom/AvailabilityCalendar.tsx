import { useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";

interface Props {
  roomId: string;
}

const AvailabilityCalendar: React.FC<Props> = ({ roomId }) => {
  const [date, setDate] = useState("");
  const [availability, setAvailability] = useState<"available" | "unavailable" | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    
    // Simple logic - in real app, check with backend
    setAvailability(selectedDate ? "available" : null);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center gap-2 md:gap-3">
          <Calendar className="text-green-600" size={20} />
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Check Availability</h2>
        </div>
        <p className="text-xs md:text-sm text-gray-500">Select your check-in date</p>
      </div>

      {/* Date Input */}
      <div className="space-y-2 md:space-y-3">
        <label className="block text-xs md:text-sm font-semibold text-gray-900">Check-in Date</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          min={minDate}
          className="w-full border-2 border-gray-300 rounded-lg p-2 md:p-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-xs md:text-lg"
        />
      </div>

      {/* Availability Status */}
      {date && availability === "available" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5 md:mt-1" size={20} />
          <div>
            <p className="font-semibold text-xs md:text-sm text-green-700">Available</p>
            <p className="text-xs text-green-600 mt-0.5 md:mt-1">
              This room is available on {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* Booking Info */}
      {date && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-blue-700">
          <p className="font-medium">💡 Tip:</p>
          <p className="mt-1">Book at least 3 days in advance to secure the best rates</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
