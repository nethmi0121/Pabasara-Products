import react from "react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/product-management/dashboard");
    }, [navigate]);

    return null;
};

export default RedirectComponent;