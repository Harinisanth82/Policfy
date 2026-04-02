import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { SmartToy, CloseRounded, SendRounded, AutoAwesome } from '@mui/icons-material';
import { sendChatbotMessage } from '../api';

const popUp = keyframes`
    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const slideUp = keyframes`
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
`;

const typingDot = keyframes`
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
`;

const FloatingButton = styled.button`
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.primary || '#1976d2'}, #0A4EB0);
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
        transform: scale(1.08) translateY(-4px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    
    &:active {
        transform: scale(0.95);
    }
`;

const ChatWindow = styled.div`
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 360px;
    height: 480px;
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.text_secondary}20;
    font-family: 'Poppins', sans-serif;
    transform-origin: bottom right;
    animation: ${popUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;

    @media (max-width: 480px) {
        width: calc(100vw - 40px);
        right: 20px;
        height: 70vh;
        bottom: 110px;
    }
`;

const ChatHeader = styled.div`
    background: ${({ theme }) => theme.bg || '#ffffff'};
    color: ${({ theme }) => theme.text_primary || '#111'};
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    font-size: 15px;
    border-bottom: 1px solid ${({ theme }) => theme.text_secondary}20;
    z-index: 2;
    
    .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${({ theme }) => theme.primary}15;
        color: ${({ theme }) => theme.primary || '#1976d2'};
    }
`;

const MessageList = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: ${({ theme }) => theme.bgLight || '#f9fafb'};
    scroll-behavior: smooth;
    
    /* Scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.text_secondary}40;
        border-radius: 10px;
    }
`;

const MessageBubble = styled.div`
    max-width: 85%;
    padding: 12px 14px;
    font-size: 13px;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: pre-wrap;
    animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    
    ${({ $isUser, theme }) => $isUser ? `
        align-self: flex-end;
        background: linear-gradient(135deg, ${theme.primary || '#1976d2'}, #0A4EB0);
        color: #ffffff;
        border-radius: 16px 16px 4px 16px;
    ` : `
        align-self: flex-start;
        background: ${theme.bg || '#ffffff'};
        color: ${theme.text_primary || '#333333'};
        border: 1px solid ${theme.text_secondary}20;
        border-radius: 16px 16px 16px 4px;
    `}
`;

const TypingIndicatorContainer = styled.div`
    align-self: flex-start;
    background: ${({ theme }) => theme.bg || '#ffffff'};
    padding: 12px 16px;
    border-radius: 16px 16px 16px 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    border: 1px solid ${({ theme }) => theme.text_secondary}20;
    animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

    .dot {
        width: 6px;
        height: 6px;
        background-color: ${({ theme }) => theme.primary || '#1976d2'};
        border-radius: 50%;
        animation: ${typingDot} 1.4s infinite ease-in-out both;
    }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
`;

const InputArea = styled.div`
    padding: 14px 20px;
    background: ${({ theme }) => theme.bg || '#ffffff'};
    border-top: 1px solid ${({ theme }) => theme.text_secondary}20;
    display: flex;
    gap: 10px;
    align-items: center;
`;

const InputField = styled.input`
    flex: 1;
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.text_secondary}40;
    outline: none;
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    color: ${({ theme }) => theme.text_primary || '#333'};
    background: ${({ theme }) => theme.bgLight || '#f9fafb'};
    transition: all 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.primary || '#1976d2'};
        background: ${({ theme }) => theme.bg || '#ffffff'};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
    }
`;

const SendButton = styled.button`
    background: ${({ theme }) => theme.primary || '#1976d2'};
    color: white;
    border: none;
    border-radius: 10px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px ${({ theme }) => theme.primary}40;
    }
    
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    
    &:disabled {
        background: ${({ theme }) => theme.text_secondary}40;
        color: ${({ theme }) => theme.text_primary}80;
        cursor: not-allowed;
    }
`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I am Policfy AI 👋\nI am your personal insurance assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await sendChatbotMessage({ messages: newMessages });
            setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the servers. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FloatingButton onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <CloseRounded sx={{ fontSize: 28 }} /> : <SmartToy sx={{ fontSize: 28 }} />}
            </FloatingButton>

            {isOpen && (
                <ChatWindow>
                    <ChatHeader>
                        <div className="icon-container">
                            <AutoAwesome fontSize="small" />
                        </div>
                        Policfy AI Assistant
                    </ChatHeader>
                    <MessageList>
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} $isUser={msg.role === 'user'}>
                                {msg.content}
                            </MessageBubble>
                        ))}
                        {loading && (
                            <TypingIndicatorContainer>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </TypingIndicatorContainer>
                        )}
                        <div ref={messagesEndRef} />
                    </MessageList>
                    <InputArea>
                        <InputField
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                            disabled={loading}
                            autoFocus
                        />
                        <SendButton onClick={handleSend} disabled={!input.trim() || loading}>
                            <SendRounded fontSize="small" />
                        </SendButton>
                    </InputArea>
                </ChatWindow>
            )}
        </>
    );
};

export default Chatbot;
