export default function RoomUtilization() {
  return (
    <div className="border border-[#989FAD] rounded-xl p-4 bg-white">
      <h3 className="font-semibold mb-3">
        Room Utilization by Type
      </h3>

      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <span>Single Sharing</span>
          <span>78%</span>
        </li>
        <li className="flex justify-between">
          <span>Double Sharing</span>
          <span>85%</span>
        </li>
        <li className="flex justify-between">
          <span>Triple Sharing</span>
          <span>69%</span>
        </li>
      </ul>
    </div>
  );
}
