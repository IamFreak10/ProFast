import React from 'react';
import Banner from './Banner/Banner';
import Services from './Services/Services';
import ClientLogosMarquee from './ClientLogosMarquee/ClientLogosMarquee';
import Facilities from './FacilitiesSection/Facilities';
import BeMarchent from './BeMarchent/BeMarchent';
import WocsSection from './WOCS/WocsSection';
import Faq from './FAQ/Faq';

const Home = () => {
    return (
        <div className='flex flex-col border-red-700 gap-16'>
            <Banner></Banner>
            <Services></Services>
            <ClientLogosMarquee></ClientLogosMarquee>
            <Facilities></Facilities>
            <BeMarchent></BeMarchent>
            <WocsSection></WocsSection>
            <Faq></Faq>
        </div>
    );
};

export default Home;