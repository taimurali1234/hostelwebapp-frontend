import UserLayout from '../../components/layouts/UserLayout'
import TestimonialsSection from '../../components/users/Home/TestimonialsSection';
import AllRoomsPage from '../../components/users/Rooms/AllRooms';
import RoomsHero from '../../components/users/Rooms/RoomsHero';
export default function UserRooms() {
  return (
    <UserLayout>
      <RoomsHero/>
      <AllRoomsPage />
      <TestimonialsSection />
    </UserLayout>
  );
}
