import { useEffect, useRef } from 'react';
import { fetchMoreStories } from '../Reducers/Stories';

export const useScroll = (ref, callback) => {
    const currentPage = useRef(2);
    const reachEnd = useRef(false);
    const data = useRef([]);
    const handleScroll = async () => {
        if(reachEnd.current) return;
        const scrollableDiv = ref.current;
        if (scrollableDiv.scrollHeight - scrollableDiv.scrollTop === scrollableDiv.clientHeight) {
            currentPage.current++;
            let results = await callback(currentPage.current);
            data.current = [...data.current, ...results];
            if(results.length === 0)
                reachEnd.current = true;
        }
    }
    useEffect(() => {
        if(reachEnd.current) return;
        const scrollableDiv = ref.current;
        if(!scrollableDiv) return;
        scrollableDiv.addEventListener('scroll', handleScroll);
        return ()=> {
            scrollableDiv.removeEventListener('scroll', handleScroll)

        }
    }, []);

    return {page: currentPage.current, isEnd: reachEnd.current, data: data.current};
}