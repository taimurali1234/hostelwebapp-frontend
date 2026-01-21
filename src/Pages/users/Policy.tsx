import UserLayout from '@/components/layouts/UserLayout'
import PrivacyContent from '@/components/users/PrivacyPolicy/PrivacyContent'
import PrivacyHero from '@/components/users/PrivacyPolicy/PrivacyHero'
import React from 'react'

const Policy = () => {
  return (
    <>
    
    <UserLayout>
    <PrivacyHero/>
    <PrivacyContent/>
    </UserLayout>
    </>
  )
}

export default Policy