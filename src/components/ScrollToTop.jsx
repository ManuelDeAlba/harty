import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ children }) {
    const location = useLocation();

    console.log(location, window.location);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return children;
}