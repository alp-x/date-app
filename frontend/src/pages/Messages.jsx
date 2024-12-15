import { useState } from 'react';
import { Send } from '@mui/icons-material';
import config from '../config';

const mockChats = [
  {
    id: 1,
    user: {
      name: "Ayşe",
      image: "/uploads/profile1.jpg",
      lastSeen: "5 dk önce"
    },
    messages: [
      { id: 1, text: "Merhaba!", sender: "them", time: "14:30" },
      { id: 2, text: "Nasılsın?", sender: "me", time: "14:31" },
    ]
  },
  {
    id: 2,
    user: {
      name: "Mehmet",
      image: "/uploads/profile2.jpg",
      lastSeen: "1 saat önce"
    },
    messages: [
      { id: 1, text: "Selam!", sender: "them", time: "13:20" },
    ]
  }
];

function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Mesaj gönderme API çağrısı burada yapılacak
    console.log('Message sent:', newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4 max-w-6xl mx-auto">
      {/* Sohbet Listesi */}
      <div className="w-1/3 card overflow-hidden">
        <div className="p-4 border-b border-surface-light/10">
          <h2 className="text-xl font-bold heading-gradient">Mesajlar</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {mockChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 flex items-center gap-3 hover:bg-surface-light/10 cursor-pointer transition-colors ${
                selectedChat?.id === chat.id ? 'bg-surface-light/20' : ''
              }`}
            >
              <img
                src={`${config.apiUrl}${chat.user.image}`}
                alt={chat.user.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `${config.avatarService}/avataaars/png?seed=${chat.user.id}`;
                }}
              />
              <div>
                <h3 className="font-semibold text-text-primary">{chat.user.name}</h3>
                <p className="text-sm text-text-secondary">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mesajlaşma Alanı */}
      {selectedChat ? (
        <div className="flex-1 card overflow-hidden flex flex-col">
          {/* Sohbet Başlığı */}
          <div className="p-4 border-b border-surface-light/10 flex items-center gap-3">
            <img
              src={`${config.apiUrl}${selectedChat.user.image}`}
              alt={selectedChat.user.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `${config.avatarService}/avataaars/png?seed=${selectedChat.user.id}`;
              }}
            />
            <div>
              <h3 className="font-semibold text-text-primary">{selectedChat.user.name}</h3>
              <p className="text-sm text-text-secondary">{selectedChat.user.lastSeen}</p>
            </div>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedChat.messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    message.sender === 'me'
                      ? 'bg-primary text-text-primary'
                      : 'bg-surface-light/20'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mesaj Gönderme */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-surface-light/10 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="input flex-1"
            />
            <button
              type="submit"
              className="btn-primary !px-6"
              disabled={!newMessage.trim()}
            >
              <Send />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 card flex items-center justify-center">
          <p className="text-text-secondary">Sohbet başlatmak için bir kişi seçin</p>
        </div>
      )}
    </div>
  );
}

export default Messages; 