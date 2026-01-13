interface LightboxProps {
  image: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <img
        src={image}
        alt="Preview"
        className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
      />
    </div>
  );
};

export default ImageLightbox;
