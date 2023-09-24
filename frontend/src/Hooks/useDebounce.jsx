import { useEffect, useState } from 'react';

export const useDebounce = (value, time)=> {
    const [state,setState] = useState();

    useEffect(() => {
        const t = setTimeout(() => {
            setState(value);
        }, time)
        return () => {
            clearTimeout(t);
        }
    }, [value]);
    return state;
}