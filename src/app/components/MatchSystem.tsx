"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FilterOptions } from '../types';

interface MatchSystemProps {
  filters: FilterOptions;
}

const MatchSystem: React.FC<MatchSystemProps> = ({ filters }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // API çağrısı burada yapılacak
      const sampleUsers = [
        {
          id: 1,
          name: "Ayşe",
          age: 25,
          gender: "Kadın",
          photo: "/images/users/ayse.jpg",
          interests: ["Müzik", "Seyahat", "Spor"],
          lookingFor: ["İlişki", "Arkadaşlık"],
          location: "İstanbul"
        },
        // Diğer örnek kullanıcılar...
      ];
      setUsers(sampleUsers);
      setError(null);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const currentUser = users[currentIndex];
      if (!currentUser) return;

      // API çağrısı burada yapılacak
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      setError('Beğenme işlemi sırasında bir hata oluştu');
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      const currentUser = users[currentIndex];
      if (!currentUser) return;

      // API çağrısı burada yapılacak
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      setError('Reddetme işlemi sırasında bir hata oluştu');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner h-32 w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={loadUsers}
          className="mt-4 btn"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  if (!currentUser) {
    return (
      <div className="text-center p-4">
        <h3 className="text-xl font-bold mb-4">Şu an için gösterilecek kullanıcı kalmadı</h3>
        <button
          onClick={loadUsers}
          className="btn"
        >
          Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="card animate-scale-in">
      <div className="p-8">
        <div className="mb-6 relative h-96">
          <Image
            className="object-cover rounded-lg"
            src={currentUser.photo}
            alt={currentUser.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-2">
            {currentUser.name}, {currentUser.age}
          </h3>
          <p className="text-gray-600 mb-4">{currentUser.location}</p>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">İlgi Alanları</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {currentUser.interests.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Aradığı</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {currentUser.lookingFor.map((item: string, index: number) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDislike}
              className="btn-secondary flex items-center gap-2 px-8"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reddet
            </button>
            <button
              onClick={handleLike}
              className="btn flex items-center gap-2 px-8"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Beğen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSystem; 