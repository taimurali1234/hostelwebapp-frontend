type roomCard = {
  title: string;
  price?: number;
  shortTermPrice?: number;
  longTermPrice?: number;
  used: string;
  totalSeats?: number;
  occupiedSeats?: number;
  availableSeats?: number;
};

export default function RoomCard({
  title,
  price,
  shortTermPrice,
  longTermPrice,
  used,
  totalSeats,
  occupiedSeats,
  availableSeats,
}: roomCard) {
  const displayPrice = shortTermPrice || price || 0;
  const occupancy = totalSeats ? ((occupiedSeats || 0) / totalSeats) * 100 : 0;

  return (
    <div className="border border-[#D0D3D9] rounded-xl p-4 bg-white">
      <p className="font-medium">{title}</p>
      <p className="text-sm my-1 text-gray-600">{used}</p>
      
      {/* Seats Information */}
      {totalSeats && (
        <div className="my-3 text-sm">
          <div className="flex justify-between mb-2 text-xs font-semibold">
            <span>Occupancy</span>
            <span>{Math.round(occupancy)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{
                width: `${occupancy}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <div>
              <span className="font-semibold">{occupiedSeats || 0}</span> Occupied
            </div>
            <div>
              <span className="font-semibold">{availableSeats || 0}</span> Available
            </div>
            <div>
              <span className="font-semibold">{totalSeats}</span> Total
            </div>
          </div>
        </div>
      )}

      {displayPrice > 0 && (
        <div className="text-lg font-semibold mt-3">
          <div>PKR {displayPrice} / day</div>
          {longTermPrice && <div className="text-sm text-gray-600">PKR {longTermPrice} / month</div>}
        </div>
      )}
    </div>
  );
}
