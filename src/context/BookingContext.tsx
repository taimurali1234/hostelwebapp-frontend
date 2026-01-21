import { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext<any>(null);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookings, setBookings] = useState<any[]>(() => {
    const storedBookings = localStorage.getItem("bookings");
    return storedBookings ? JSON.parse(storedBookings) : [];
  });

  // 🔹 SAVE TO localStorage WHENEVER BOOKINGS CHANGE
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: any) => {
    setBookings((prev) => [...prev, booking]);
  };

  const removeBooking = (index: number) => {
    setBookings(prev => prev.filter((_, i) => i !== index));
  };

  const clearBookings = () => {
    setBookings([]);
    localStorage.removeItem("bookings");
  };

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, removeBooking, clearBookings }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
