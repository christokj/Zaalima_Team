import React, { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../config/axiosInstance';
import { Hero } from '../../components';
import CategorySection from '../../components/homepage/CategorySection';
import OurFeatures from '../../components/ui/OurFeatures';
const StarsCanvas = lazy(() => import("../../components/canvas/Stars"));

function HomePage() {

    return (
        <div className=" ">
            <div className="relative z-0 ">
                <div className=" w-full h-screen " >
                    <Hero />
                </div>
                {/* <CategorySection /> */}
                <OurFeatures />
                <Suspense fallback={<h1></h1>}>
                    <StarsCanvas />
                </Suspense>

            </div>
        </div >
    );
}

export default HomePage;