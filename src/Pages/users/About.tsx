import AboutHero from '@/components/users/About/AboutHero';
import UserLayout from '../../components/layouts/UserLayout'
import MissionVision from '@/components/users/About/MissionVision';
import TeamSlider from '@/components/users/About/TeamSlider';
import WhyChooseUs from '@/components/users/About/WhyChooseUs';
export default function About() {
  return (
    <UserLayout>
      <AboutHero/>
      <MissionVision/>
      <TeamSlider/>
      <WhyChooseUs/>
    </UserLayout>
  );
}
