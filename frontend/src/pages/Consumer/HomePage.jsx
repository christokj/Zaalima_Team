import React from 'react';
import { useSelector } from 'react-redux';
import api from '../../config/axiosInstance';
import { StarsCanvas } from '../../components/canvas';
import { Hero, Navbar } from '../../components';
import CategorySection from '../../components/homepage/CategorySection';
import OurFeatures from '../../components/ui/OurFeatures';

function HomePage() {
    const [data, setData] = React.useState(null);
    const user = useSelector((state) => state.auth.user?.username);

    // Function to fetch data from the API
    const getData = () => {
        api.get('/public/getProducts')
            .then((response) => {
                setData(response.data);
                console.log(response.data); // Log the entire data object to see its structure
            })
            .catch((error) => {
                console.error("Error fetching data:", error); // Use console.error for errors
            });
    };

    // Use useEffect to call getData when the component mounts
    React.useEffect(() => {
        getData(); // Fetch data initially when the component loads
    }, []); // The empty dependency array ensures this runs only once on mount

    return (
        <div className=" ">
            <div className="relative z-0 ">
                <div className=" w-full h-screen " >
                    <Hero />
                </div>
                <CategorySection />
                <OurFeatures />
                <StarsCanvas />
            </div>
        </div >
    );
}

export default HomePage;