import UserLayout from '@/components/layouts/UserLayout'
import TermsHero from '@/components/users/Terms/TermHero'
import TermsContent from '@/components/users/Terms/TermsContent'

const Terms = () => {
  return (
    <UserLayout>
      <TermsHero />
      <TermsContent />
    </UserLayout>
  )
}

export default Terms