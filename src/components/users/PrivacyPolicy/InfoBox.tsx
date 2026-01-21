const InfoBox = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <div className="border rounded-xl p-4 flex items-center gap-3 bg-white">
      <div className="text-green-600">{icon}</div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};
export default InfoBox;