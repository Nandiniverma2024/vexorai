import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => { //cb -> callback
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fn = async(...args) => {
        // Before fetching our Api, make setLoading true nd setError null
        setLoading(true);
        setError(null);

        // Try-catch block for hadling our errors nd all
        try {
            const response = await cb(...args);
            setData(response);// set Data equals to whatever response we get
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };
};

export default useFetch;
