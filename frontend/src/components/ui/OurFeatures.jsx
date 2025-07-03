import React, { useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TbTruckDelivery } from "react-icons/tb";
import { MdSecurity } from "react-icons/md";
import { SiAdguard, SiFsecure } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        title: "Fast Delivery",
        icon: <TbTruckDelivery className="text-white text-4xl" />,
        description: "Get your products delivered in no time.",
        col: "col-start-1 row-span-2 mt-16",
    },
    {
        title: "Non-Contact Shipping",
        icon: <MdSecurity className="text-white text-4xl" />,
        description: "Receive your items with safety protocols.",
        col: "col-start-2",
    },
    {
        title: "Money Back Guarantee",
        icon: <SiAdguard className="text-white text-4xl" />,
        description: "Not satisfied? Get your money back easily.",
        col: "col-start-2",
    },
    {
        title: "Secure Payment System",
        icon: <SiFsecure className="text-white text-4xl" />,
        description: "Your payments are secure with our system.",
        col: "col-start-3 row-span-2 mt-16",
    },
];

const useGsap = (ref, index) => {
    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, y: 100, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }
    }, [ref, index]);
};

const FeatureCard = ({ title, icon, description, index }) => {
    const cardRef = useRef(null);
    useGsap(cardRef, index);

    return (
        <Tilt className="w-full">
            <div
                ref={cardRef}
                className="border-1 p-[1px] rounded-[20px] shadow-card"
            >
                <div className="bg-transparent rounded-[20px] py-6 px-6 min-h-[200px] flex flex-col justify-center items-center text-center gap-4">
                    {icon}
                    <h3 className="text-white text-lg font-semibold">{title}</h3>
                    <p className="text-secondary text-sm">{description}</p>
                </div>
            </div>
        </Tilt>
    );
};

const OurFeatures = () => {
    return (
        <section className="px-4 sm:px-6 my-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10">
                Why Shop With Us?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                {/* Left tall card */}
                <div className="w-full md:w-[90%] md:mt-28 md:ms-20">
                    <FeatureCard
                        index={0}
                        title={features[0].title}
                        icon={features[0].icon}
                        description={features[0].description}
                    />
                </div>

                {/* Two stacked cards in center */}
                <div className="w-full md:w-[90%] flex flex-col gap-6">
                    <FeatureCard
                        index={1}
                        title={features[1].title}
                        icon={features[1].icon}
                        description={features[1].description}
                    />
                    <FeatureCard
                        index={2}
                        title={features[2].title}
                        icon={features[2].icon}
                        description={features[2].description}
                    />
                </div>

                {/* Right tall card */}
                <div className="w-full md:w-[90%] md:mt-28 md:me-20">
                    <FeatureCard
                        index={3}
                        title={features[3].title}
                        icon={features[3].icon}
                        description={features[3].description}
                    />
                </div>
            </div>
        </section>

    );
};

export default OurFeatures;
