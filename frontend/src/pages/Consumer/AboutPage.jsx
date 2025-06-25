import React from 'react';

function AboutPage() {
    return (

        <>
            <div className="px-4 sm:px-12 md:px-24 lg:px-48 xl:px-64 py-16 mt-10 ">
                <div className="text-center mb-12">
                    <h1 className="md:font-extrabold font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500 lg:text-6xl text-dark-grey-900 animate-typing overflow-hidden whitespace-nowrap text-5xl text-black mx-auto">About Us</h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-600">
                        Welcome to Our Store! We are dedicated to bringing you the best products with the highest quality.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center mb-12">
                    <img src="https://i.pinimg.com/originals/50/78/a0/5078a05eb1b6847d93383eaa4c0ed500.gif" alt="Company Image" className="w-full md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-6" />
                    <div className="md:ml-6 text-center md:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">Our Mission</h2>
                        <p className="text-lg sm:text-xl text-gray-600">
                            Our mission is to provide the best products with a commitment to quality and customer satisfaction. We aim to make your shopping experience as smooth and enjoyable as possible.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center mb-12">
                    <div className="md:mr-6 text-center md:text-right">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">Our Vision</h2>
                        <p className="text-lg sm:text-xl text-gray-600">
                            We envision a world where shopping is effortless, enjoyable, and accessible to everyone. We strive to lead the way in innovation and customer service.
                        </p>
                    </div>
                    <img src="https://fluit.co/img/fluit/startup-rocket.gif" alt="Vision Image" className="w-full md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0 md:ml-6" />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">Meet the Team</h2>
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                            <img src="https://static.vecteezy.com/system/resources/previews/012/177/622/original/man-avatar-isolated-png.png" alt="Team Member" className="w-full rounded-full shadow-lg mb-4" />
                            <h3 className="text-xl font-bold text-gray-600">John Doe</h3>
                            <p className="text-lg text-gray-600">CEO</p>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                            <img src="https://png.pngtree.com/png-vector/20220814/ourmid/pngtree-passport-photo-of-young-handsome-man-in-blue-checkered-shirt-close-png-image_5861432.png" alt="Team Member" className="w-full rounded-full shadow-lg mb-4" />
                            <h3 className="text-xl font-bold text-gray-600">Jane Smith</h3>
                            <p className="text-lg text-gray-600">CTO</p>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR7av_tdhO4CdLxhteZIv2Gjf_CWOj7ZGrXw&s" alt="Team Member" className="w-full rounded-full shadow-lg mb-4" />
                            <h3 className="text-xl font-bold text-gray-600">Sara Johnson</h3>
                            <p className="text-lg text-gray-600">CFO</p>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 p-4">
                            <img src="https://cdn-icons-png.flaticon.com/512/2479/2479880.png" alt="Team Member" className="w-full rounded-full shadow-lg mb-4" />
                            <h3 className="text-xl font-bold text-gray-600">Mike Brown</h3>
                            <p className="text-lg text-gray-600">COO</p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default AboutPage;