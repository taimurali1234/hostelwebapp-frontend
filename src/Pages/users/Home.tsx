import UserLayout from '../../components/layouts/UserLayout'
import CTASection from '../../components/users/Home/CTASection'
import FAQSection from '../../components/users/Home/FAQSection'
import FeaturedRooms from '../../components/users/Home/FeaturedRooms'
import GallerySection from '../../components/users/Home/GallerySection'
import HeroSection from '../../components/users/Home/Hero'
import HowItWorks from '../../components/users/Home/HowItWorks'
import TestimonialsSection from '../../components/users/Home/TestimonialsSection'
import VideoGallery from '../../components/users/Home/VideoGallery'

const Home = () => {
  return (
    <div>
      <UserLayout>
        <HeroSection />
        <FeaturedRooms />
        <HowItWorks />
        <GallerySection/>
        <VideoGallery/>
        <TestimonialsSection/>
        <FAQSection/>
        <CTASection/>
      </UserLayout>
    </div>
  )
}

export default Home
