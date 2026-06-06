import { useEffect, useState } from "react";
import { makeRequest } from "../makeRequest";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await makeRequest.get(url);
                setData(res.data);
            } catch (error) {
                console.error("Fetch error:", error.response || error.message);
                setError(true);
            }
            setLoading(false);
        };
        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;