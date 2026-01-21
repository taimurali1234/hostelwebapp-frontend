const PolicyCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-full border mb-4 text-green-600">
        {icon}
      </div>

      <h3 className="font-semibold text-lg md:text-xl mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
};
export default PolicyCard;