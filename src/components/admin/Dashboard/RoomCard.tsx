type roomCard={
    title:string,
    price:number,
    used:string
}

export default function RoomCard({ title, price, used }: roomCard) {
  return (
    <div className="border border-[#D0D3D9] rounded-xl p-4 bg-white">
      <p className="font-medium">{title}</p>
      <p className="text-sm my-1">{used}</p>
      <h3 className="text-lg font-semibold">RS {price} / day</h3>
    </div>
  );
}
