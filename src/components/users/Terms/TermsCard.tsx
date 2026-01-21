import { Bookmark, X, User, AlertTriangle, Phone } from "lucide-react";

const iconMap: any = {
  bookmark: <Bookmark />,
  x: <X />,
  user: <User />,
  alert: <AlertTriangle />,
  contact: <Phone />,
};

interface Props {
  title: string;
  description: string;
  icon: string;
}

const TermCard: React.FC<Props> = ({ title, description, icon }) => {
  return (
    <div className="border rounded-xl p-5 bg-white flex gap-4 items-start hover:shadow-md transition">
      <div className="text-green-600 text-sm">{iconMap[icon]}</div>

      <div>
        <h3 className="font-semibold text-base md:text-lg">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default TermCard;
