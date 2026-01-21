type roomCard = {
  title: string;
  price?: number;
  shortTermPrice?: number;
  longTermPrice?: number;
  used: string;
};

export default function RoomCard({
  title,
  price,
  shortTermPrice,
  longTermPrice,
  used,
}: roomCard) {
  const displayPrice = shortTermPrice || price || 0;

  return (
    <div className="border border-[#D0D3D9] rounded-xl p-4 bg-white">
      <p className="font-medium">{title}</p>
      <p className="text-sm my-1">{used}</p>
      <div className="text-lg font-semibold">
        <div>PKR {displayPrice} / day</div>
        {longTermPrice && <div>PKR {longTermPrice} / month</div>}
      </div>
    </div>
  );
}
