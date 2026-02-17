import UserLayout from '../../components/layouts/UserLayout'
import ContactInfo from '@/components/users/Contact/ContactInfo';
import MapSection from '@/components/users/Contact/GoogleMap';
import VisitOfficeSection from '@/components/users/Contact/VisitUs';
import { ContactFormSection } from '@/components/users/Contact/ContactForm';
import ContactHero from '@/components/users/Contact/ContactHero';
export default function Contact() {
  return (
    <UserLayout>
      <ContactHero/>
      <ContactFormSection/>
      <ContactInfo/>
      <MapSection/>
      <VisitOfficeSection/>
    </UserLayout>
  );
}
