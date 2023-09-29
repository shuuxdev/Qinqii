import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { undoReactThunk } from '../../Thunks/Posts';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { useUserID } from '../../Hooks/useUserID';

export const TopReactions = ({ entity, reactions, action, entity_type }) => {
    const user_id = useUserID()
    const move = 5;
    const sz = 20;
    const px = 3;
    const ref = useRef();
    const [selectedEmoji, setSelectedEmoji] = useState(0);
    const [showModal, setShowModal] = useState(false);


    const emojis = useMemo(() => {
        let map = new Map();
        reactions.forEach(r => {
            if (!map.get(r.emoji)) map.set(r.emoji, 0);
            map.set(r.emoji, map.get(r.emoji) + 1)
        })
        let topEmojisReacted = Array.from(map, ([name, value]) => ({ name, value }));
        topEmojisReacted.sort((b, c) => b.value < c.value);

        return topEmojisReacted;
    })
    const dispatch = useDispatch();
    // use for top reactions
    const UndoReaction = (reaction) => {
        const payload = {entity,entity_type, reaction_id: reaction.id}
        dispatch(undoReactThunk(payload, action));
    }

    useLayoutEffect(() => {
        const _emoji = emojis.slice(0, 3);
        if (emojis.length === 0) ref.current.style.display = 'none';
        else if (ref.current) {
            ref.current.style.display = 'flex';
            ref.current.style.width = `${(sz * _emoji.length) - (move * (_emoji.length - 1)) + px * 2}px`
        }
    }, [emojis])
    return (
        <>
            <div ref={ref} onClick={() => setShowModal(true)} className={`flex cursor-pointer px-[3px] pb-[2px] bg-white qinqii-thin-shadow rounded-full`}>
                {
                    emojis.slice(0, 3).map((e, i) => (
                        <span key={e.name} style={{ right: move * i, zIndex: emojis.length - i }} className='relative'>
                            <em-emoji
                                native={e.name} set="facebook" size={`${sz}px`}></em-emoji>
                        </span>
                    ))
                }
            </div>
            <Modal footer={null} open={showModal} onCancel={() => setShowModal(false)} title="Danh sách những người thả cảm xúc" >
                <div className="flex gap-[2px] flex-wrap">
                    {
                        emojis.map((e, index) => (
                            <Button key={e.name} onClick={() => setSelectedEmoji(e.name)} className={`${e.name == selectedEmoji ? 'custom-outline-button' : ''}`} >
                                <div className="flex gap-[5px]">
                                    <span color="black">{e.value}</span>

                                    <em-emoji
                                        native={e.name} set="facebook" size={`${20}px`}></em-emoji>
                                </div>

                            </Button>
                        ))
                    }
                </div>
                <div className="flex flex-col gap-[15px] overflow-y-scroll my-[10px] max-h-[400px]">
                    {
                        reactions.filter((reaction) => reaction.emoji == selectedEmoji).map((reaction) => (
                            <div className="flex items-center gap-[10px]">
                                <div className="shrink-0 relative">
                                    <Avatar sz={36} src={reaction.reactor_avatar} user_id={reaction.reactor_id} />
                                    <div className="absolute right-0 bottom-0">
                                        <em-emoji
                                            native={reaction.emoji} set="facebook" size={`${18}px`}></em-emoji>
                                    </div>

                                </div>
                                <div className="grow">
                                    <Text>{reaction.reactor_name}</Text>
                                </div>
                                {
                                    user_id === reaction.reactor_id ?
                                        <div className="justify-end">
                                            <Button danger onClick={() => UndoReaction(reaction)}>Hủy</Button>
                                        </div>
                                        :
                                        <div className="justify-end">
                                            <Button >Thêm bạn</Button>
                                        </div>
                                }
                            </div>

                        ))
                    }
                </div>
            </Modal>
        </>

    )
}
