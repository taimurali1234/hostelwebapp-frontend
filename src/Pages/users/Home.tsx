import UserLayout from '../../components/layouts/UserLayout'
import FeaturedRooms from '../../components/users/Home/FeaturedRooms'
import GallerySection from '../../components/users/Home/GallerySection'
import HeroSection from '../../components/users/Home/Hero'
import HowItWorks from '../../components/users/Home/HowItWorks'

const Home = () => {
  return (
    <div>
      <UserLayout>
        <HeroSection />
        <FeaturedRooms />
        <HowItWorks />
        <GallerySection/>
      </UserLayout>
    </div>
  )
}

export default Home
