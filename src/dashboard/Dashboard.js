import React, { useState, useEffect } from 'react';
import VerticalTabs from './Tab/VerticalTabs';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading delay with useEffect
    useEffect(() => {
        // Simulate an asynchronous operation (e.g., fetching data)
        const fetchData = async () => {
            // Simulate a delay of 2 seconds (adjust as needed)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Once the data is loaded, set isLoading to false
            setIsLoading(false);
        };

        fetchData();
    }, []); // Empty dependency array ensures that this effect runs only once

    return (
        <div className='container-fluid p-0 m-0 overflow-hidden '>
            <div className='row'>
                {isLoading ? (
                    // Display a loading indicator or message while data is loading
                    <p>Loading...</p>
                ) : (
                    // Render the VerticalTabs component once the data is loaded
                    <VerticalTabs />
                )}
            </div>
        </div>
    );
}

export default Dashboard;
