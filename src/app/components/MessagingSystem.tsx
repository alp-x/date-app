"use client";

import React, { useState, useEffect, useRef } from 'react';
import { messaging } from '../services/api';
import { Message, User } from '../types';
import Image from 'next/image';

interface MessagingSystemProps {
  currentUser: User;
  match?: User;
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({ currentUser, match }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Her 5 saniyede bir mesajları güncelle
      return () => clearInterval(interval);
    }
  }, [match]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!match) return;
    
    try {
      setLoading(true);
      const data = await messaging.getMessages(match.id);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Mesajlar yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!match || !newMessage.trim()) return;

    try {
      await messaging.sendMessage(match.id, newMessage);
      setNewMessage("");
      await loadMessages(); // Mesajları yeniden yükle
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu');
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!match) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-bold mb-4">Henüz bir eşleşmeniz yok</h3>
        <p className="text-gray-600">
          Eşleşme olduktan sonra mesajlaşmaya başlayabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 mr-4">
            <Image
              src={match.photo || '/images/default-avatar.jpg'}
              alt={match.name}
              fill
              className="rounded-full object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <h3 className="font-bold">{match.name}</h3>
            <p className="text-sm text-gray-600">
              {match.latitude && match.longitude ? 
                `${match.latitude.toFixed(4)}, ${match.longitude.toFixed(4)}` : 
                'Konum belirtilmemiş'
              }
            </p>
          </div>
        </div>

        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-96 overflow-y-auto mb-4 border rounded p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-3 rounded-lg max-w-[80%] ${
                  msg.senderId === currentUser.id
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <p>{msg.content}</p>
                <small className={`text-xs ${
                  msg.senderId === currentUser.id ? "text-blue-100" : "text-gray-500"
                }`}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Mesajınızı yazın..."
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem; 