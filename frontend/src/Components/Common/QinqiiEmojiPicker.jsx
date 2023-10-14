import React, { useEffect } from 'react';
const LazyEmojiPicker = React.lazy(() => import('@emoji-mart/react'))

export const QinqiiEmojiPicker = React.forwardRef((props, textareaRef) => {


    const InsertEmoji = (emoji) => {
        
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const val = textareaRef.current.value;
        textareaRef.current.value = val.slice(0, start) + emoji.native + val.slice(end);
        textareaRef.current.selectionStart = start + emoji.native.length;
        textareaRef.current.selectionEnd = end + emoji.native.length;

    };
    return (
        <div className='relative  left-0'>
            <LazyEmojiPicker
                set='facebook'
                onEmojiSelect={InsertEmoji}
            ></LazyEmojiPicker>
        </div>
    );
});