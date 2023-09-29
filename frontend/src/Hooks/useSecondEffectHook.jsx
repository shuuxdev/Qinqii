import { useEffect, useRef } from 'react';

export const useSecondEffectHook = (cb, deps = []) => {
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        cb();
    }, deps)
}