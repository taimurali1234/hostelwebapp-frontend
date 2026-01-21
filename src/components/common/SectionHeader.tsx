interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  align = "center",
}) => {
  return (
    <div
      className={`flex flex-col mb-20 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-600 mt-2 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
