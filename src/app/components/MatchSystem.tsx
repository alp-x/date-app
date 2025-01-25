"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FilterOptions } from '../types';
import { matching } from '../services/api';

interface MatchSystemProps {
  filters: FilterOptions;
}

const MatchSystem: React.FC<MatchSystemProps> = ({ filters }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await matching.getUsers(filters);
      setUsers(response);
      setError(null);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX - offsetX);
  };

  const handleSwipeMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newOffsetX = clientX - startX;
    setOffsetX(newOffsetX);
  };

  const handleSwipeEnd = async () => {
    setIsDragging(false);
    if (Math.abs(offsetX) > 100) {
      try {
        const currentUser = users[currentIndex];
        if (!currentUser) return;

        if (offsetX > 0) {
          await matching.like(currentUser.id);
        } else {
          await matching.dislike(currentUser.id);
        }
        setCurrentIndex(prev => prev + 1);
      } catch (err) {
        setError('İşlem sırasında bir hata oluştu');
        console.error(err);
      }
    }
    setOffsetX(0);
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

  const cardStyle = {
    transform: `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
  };

  return (
    <div className="card animate-scale-in">
      <div className="p-8">
        <div 
          ref={cardRef}
          className="mb-6 relative h-96 cursor-grab active:cursor-grabbing"
          style={cardStyle}
          onMouseDown={handleSwipeStart}
          onMouseMove={handleSwipeMove}
          onMouseUp={handleSwipeEnd}
          onMouseLeave={handleSwipeEnd}
          onTouchStart={handleSwipeStart}
          onTouchMove={handleSwipeMove}
          onTouchEnd={handleSwipeEnd}
        >
          <Image
            className="object-cover rounded-lg"
            src={currentUser.photo}
            alt={currentUser.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-lg"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-3xl font-bold mb-2">
              {currentUser.name}, {currentUser.age}
            </h3>
            <p className="mb-4">
              {currentUser.latitude && currentUser.longitude ? 
                `${currentUser.latitude.toFixed(4)}, ${currentUser.longitude.toFixed(4)}` : 
                'Konum belirtilmemiş'
              }
            </p>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchSystem; 