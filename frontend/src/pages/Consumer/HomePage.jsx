import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import api from '../../config/axiosInstance';
import { Hero } from '../../components';
import CategorySection from '../../components/homepage/CategorySection';
import OurFeatures from '../../components/ui/OurFeatures';
const StarsCanvas = lazy(() => import("../../components/canvas/Stars"));

function HomePage() {
    const [data, setData] = React.useState(null);
    const user = useSelector((state) => state.auth.username);

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