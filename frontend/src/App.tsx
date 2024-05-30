import { useEffect, useState } from "react";

const App = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8000/');
    
    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send("Hello world");
    };

    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      setMessages((prevMessages) => [...prevMessages, message.data]);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(inputValue);
      setInputValue('');
    }
  };

  return (
    <div>
      <h1>Message Broadcasting</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
