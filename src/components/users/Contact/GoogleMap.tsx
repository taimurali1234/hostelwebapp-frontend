const MapSection = () => {
  return (
    <section className="w-full">
      <div className="relative w-full aspect-[4/3] max-h-[450px]">
        <iframe
          title="Boys Hostel Johar Town Lahore Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.0466080323317!2d74.2644465!3d31.4403838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919016a704121ff%3A0xc18d7c04eccefa22!2sBoys%20Hostel%20Johar%20Town%20Lahore!5e0!3m2!1sen!2s!4v1770374643946!5m2!1sen!2s"
          className="absolute inset-0 h-full w-full rounded-lg"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
};

export default MapSection;
