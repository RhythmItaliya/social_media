import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../others/LoadingSpinner";

const VerifyLogin = () => {
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useParams();

    useEffect(() => {
        const checkLinkExpire = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/verify/login/${token}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setIsValid(data.isValid);
                    setTimeout(() => { window.location.href = '/login' }, 3000);
                } else {
                    console.log(data.message);
                    setIsValid(false);
                }
            } catch (e) {
                console.log(e);
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            checkLinkExpire();
        } else {
            setIsValid(false);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="text-center mt-3">
            {
                isValid == true
                    ? <>
                        <h2>Your Account is Verified</h2>
                        <Link to="/login">Go to Login</Link>
                    </>
                    : <h2>Link is invalid...</h2>
            }
        </div>
    );
};


export default VerifyLogin;
