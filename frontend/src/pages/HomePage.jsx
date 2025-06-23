import React from 'react';
import { useSelector } from 'react-redux';
import api from '../config/axiosInstance';

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
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">
                Welcome to Zaalima Web Development
            </h1>
            {user && (
                <p className="text-lg text-gray-700">
                    Hello, <span className="font-semibold">{user}</span>! You are successfully logged in.
                </p>
            )}
            {/* Call getData when the button is clicked. Note the arrow function to prevent immediate execution */}
            <button onClick={getData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Get/Refresh Details
            </button>

            {/* Conditionally render data once it's available */}
            {data ? (
                <div className="mt-8 text-left border p-4 rounded-lg shadow-md mx-auto max-w-md">
                    <h2 className="text-xl font-bold mb-2">Fetched Data:</h2>
                    {/* Assuming data.user is an array and each user object has a 'name' property */}
                    {data.user && data.user.length > 0 ? (
                        <ul>
                            {data.user.map((u, index) => (
                                <li key={index} className="mb-1">
                                    <strong>Name:</strong> {u.name}
                                    {/* Add more properties here if they exist in your user object */}
                                    {u.email && <span>, <strong>Email:</strong> {u.email}</span>}
                                    {u.age && <span>, <strong>Age:</strong> {u.age}</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No user data available.</p>
                    )}

                    {/* If you have other data properties directly on the 'data' object, you can display them here */}
                    {data.message && <p><strong>Message:</strong> {data.message}</p>}
                </div>
            ) : (
                <p className="mt-4 text-gray-600">Loading data...</p>
            )}
        </div>
    );
}

export default HomePage;