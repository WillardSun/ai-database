import './App.css'
import {useState} from 'react'

function AiChat() {
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('')

    const handleKeyDown = (e: any) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
                setChatHistory([...chatHistory, message]);
                setMessage('');
            }
            console.log(chatHistory);
        }
    }

    return (
        <div className='bg-primary h-full min-w-screen flex items-center justify-center flex-col'>
            <div className="w-4xl max-w-3xl max-h-3x1 mx-auto p-4">
                {(chatHistory.length === 0) ? (
                    <div className="pb-5"> 
                        <p className ="text-2xl font-semibold text-center text-primarycontent pb-5"> 你好，歡迎來到AI對話 </p>
                        <p className ="text-base text-center text-primarycontent"> 請把你的任務交給我吧~ </p>
                    </div>
                ) : (
                    <div> message entered </div>
                )}
                <ChatInput message={message} setMessage={setMessage} handleKeyDown={handleKeyDown}/>
            </div>
        </div>
    )
}

const ChatInput = ({message, setMessage, handleKeyDown}: {message: any, setMessage: any, handleKeyDown: (e: any) => void}) => {
    return (
        <textarea 
            className= "field-sizing-content resize-none w-full min-h-29 max-h-80 bg-secondary rounded-3xl p-4 text-primarycontent placeholder:text-secondary-content outline-0" 
            placeholder="給AI發送消息" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    )
}

export default AiChat