import React from "react";
const { useEffect } = require("react");
const { useState } = require("react");

export const GlobalContext = React.createContext();
export const GlobalProvider = ({ children }) => {


    async function getMessageOfConversation(chat_id, contact) {
        let messages = await fetch(`/chat/get_conversation?conversation_id=${chat_id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => data);

        let res = { ...contact, messages };
        let existed = chatList.findIndex((chat) => chat.conversation_id == chat_id) != -1;
        if (!existed)
            setChatList([...chatList, res]);
    }
    function closeChat(chat_id) {
        if (chat_id)
            setChatList(prevChatList => prevChatList.filter(chat => chat.conversation_id != chat_id));
    }
    const [chatList, setChatList] = useState([]) //Lưu những chat được mở

    const contextValue = { getMessageOfConversation, closeChat, chatList }


    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    )
}