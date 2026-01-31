export default function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="border border-[#D0D3D9] rounded-xl p-5 bg-white">
      <p className="text-sm">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
