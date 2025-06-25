import React, { useRef, useEffect, useState } from "react";
import Tilt from 'react-parallax-tilt';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { styles } from "../../styles";

gsap.registerPlugin(ScrollTrigger);

const useGsap = (elementRef, animation, delay = 0) => {
    useEffect(() => {
        if (elementRef.current) {
            gsap.fromTo(
                elementRef.current,
                animation.from,
                {
                    ...animation.to,
                    delay,
                    scrollTrigger: {
                        trigger: elementRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }
    }, [elementRef, animation, delay]);
};

const CategoryCard = ({ index, name, icon }) => {
    const cardRef = useRef(null);
    useGsap(cardRef, {
        from: { opacity: 0, y: 100, scale: 0.8 },
        to: { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
    }, index * 0.2);

    return (
        <Tilt className="xs:w-[250px] w-full">
            <div ref={cardRef} className="w-full  p-[1px] rounded-[20px] shadow-card " style={{
                background: 'radial-gradient(circle, rgba(0,0,0,0.6), rgba(255,255,255,0.1))',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}>
                <div className="bg-tertiary rounded-2xl py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
                    <img src={icon} alt={name} className="object-contain rounded-2xl mx-auto w-52 h-40 hover:scale-105 transition duration-300 hover:shadow-2xl hover:opacity-90" />
                    <h3 className="text-white text-[20px] font-bold text-center">{name}</h3>
                </div>
            </div>
        </Tilt>
    );
};

const CategorySection = () => {
    const [categories, setCategories] = useState([
        {
            "_id": "1",
            "name": "Fashion",
            "icon": "https://res.cloudinary.com/dfm6raue1/image/upload/v1724138677/workplace-business-modern-male-accessories-laptop-white_155003-1722_e9prgu.jpg"
        },
        {
            "_id": "2",
            "name": "Electronics",
            "icon": "https://res.cloudinary.com/dfm6raue1/image/upload/v1724138677/workplace-business-modern-male-accessories-laptop-white_155003-1722_e9prgu.jpg"
        },
        {
            "_id": "3",
            "name": "Home & Kitchen",
            "icon": "https://res.cloudinary.com/dfm6raue1/image/upload/v1724138677/workplace-business-modern-male-accessories-laptop-white_155003-1722_e9prgu.jpg"
        },
        {
            "_id": "4",
            "name": "Books",
            "icon": "https://res.cloudinary.com/dfm6raue1/image/upload/v1724138677/workplace-business-modern-male-accessories-laptop-white_155003-1722_e9prgu.jpg"
        }
    ]
    );
    const headingRef = useRef(null);
    const paragraphRef = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:3000/api/categories") // change if needed
            .then(res => setCategories(res.data))
            .catch(err => console.error("Failed to load categories", err));
    }, []);

    useGsap(headingRef, {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
    });

    useGsap(paragraphRef, {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
    }, 0.3);

    return (
        <section className="px-6 py-12 m-10">
            <div ref={headingRef} className="text-center">
                <p className="text-sm text-secondary uppercase tracking-wider ">Check now</p>
                <h2 className="text-3xl font-bold text-white">Explore Our Categories</h2>
            </div>

            <p ref={paragraphRef} className={`${styles.heroSubText} mt-2 text-white-100 mx-36 text-center`}   >
                Dive into our top categories curated for you — from fashion to tech, find everything you love.
            </p>

            <div className="mt-20 mx-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-10">
                {categories.slice(0, 4).map((cat, index) => (
                    <CategoryCard key={cat._id || index} index={index} {...cat} />
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
