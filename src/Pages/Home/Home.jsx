import React from 'react';
import Banner from './Banner/Banner';
import Services from './Services/Services';
import ClientLogosMarquee from './ClientLogosMarquee/ClientLogosMarquee';
import Facilities from './FacilitiesSection/Facilities';
import BeMarchent from './BeMarchent/BeMarchent';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientLogosMarquee></ClientLogosMarquee>
            <Facilities></Facilities>
            <BeMarchent></BeMarchent>
        </div>
    );
};

export default Home;