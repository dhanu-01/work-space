import React from 'react'
import LandingPageNav from './LandingPageSections/LandingPageNav';
import LandingPageJobSection from './LandingPageSections/LandingPageJobSection';
import LandingPagePlatform from './LandingPageSections/LandingPagePlatform';
import LandingPageFeatureJob from './LandingPageSections/LandingPageFeatureJob';
import LandingPageCvUpload from './LandingPageSections/LandingPageCvUpload';
import LandingFooter from './LandingPageSections/LandingFooter';

const LandingPage = () => {
  return (
    <div>
         <LandingPageNav/>
         <LandingPageJobSection/>
         <LandingPagePlatform/>
         <LandingPageFeatureJob/>
         <LandingPageCvUpload/>
         <LandingFooter/> 
    </div>
  )
}

export default LandingPage