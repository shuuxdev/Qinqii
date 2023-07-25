import { useEffect, useRef } from "react";
import { memo } from "react";
import { useLayoutEffect } from "react";
import { useMemo } from "react";

export const TopReactions = ({ reactions }) => {

    const move = 5;
    const sz = 20;
    const ref = useRef();
    const emojis = useMemo(() => {
        let map = new Map();
        reactions.forEach(r => {
            if (!map.get(r.emoji)) map.set(r.emoji, 0);
            map.set(r.emoji, map.get(r.emoji) + 1)
        })
        let topEmojisReacted = Array.from(map, ([name, value]) => ({ name, value }));
        topEmojisReacted.sort((b, c) => b.value < c.value);
        return topEmojisReacted.slice(0, 3);
    })
    useEffect(() => {
        console.log(emojis)
    })
    useLayoutEffect(() => {
        if (emojis.length >= 2) {
            ref.current.style.width = `${((sz * emojis.length) - move * (emojis.length - 1))}px`;
        }

    }, [reactions])
    return (
        <div className="flex  p-[3px] bg-white shadow-lg rounded-full">
            <div ref={ref} className="flex">
                {
                    emojis.map((e, i) => (
                        <span style={{ right: move * i, zIndex: emojis.length - i }} className='relative'>
                            <em-emoji
                                native={e.name} set="facebook" size={`${sz}px`}></em-emoji>
                        </span>
                    ))
                }
            </div>
        </div>
    )
}