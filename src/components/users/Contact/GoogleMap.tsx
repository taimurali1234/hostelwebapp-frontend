const MapSection = () => {
  const openMap = () => {
    window.open(
      "https://maps.app.goo.gl/QhdrNgyQu9EP6qXN8",
      "_blank"
    );
  };

  return (
    <section
      className="h-[400px] relative cursor-pointer"
     
    >
      <img
        src="/assets/map.png"
        alt="Office Location"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
       <span className="flex items-center gap-2 
  text-white text-lg font-semibold 
  bg-black/60 px-5 py-2 rounded-full 
  hover:bg-green-600 transition 
  cursor-pointer relative" onClick={openMap}>

  <span className="absolute -left-2 -top-2 
    w-3 h-3 bg-green-500 rounded-full 
    animate-ping"  ></span>

  📍 View Location
</span>
      </div>
    </section>
  );
};

export default MapSection;
