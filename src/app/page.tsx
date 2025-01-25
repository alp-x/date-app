"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MatchSystem from './components/MatchSystem';
import FilterOptions from './components/FilterOptions';
import SwipeLimit from './components/SwipeLimit';
import { FilterOptions as FilterOptionsType } from './types';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGender, setUserGender] = useState<string | undefined>();
  const [isPremium, setIsPremium] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [filters, setFilters] = useState<FilterOptionsType>({
    gender: undefined,
    minAge: 18,
    maxAge: 50,
    lookingFor: [],
    distance: 50
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const gender = localStorage.getItem('userGender');
    const premium = localStorage.getItem('isPremium') === 'true';
    const dailySwipes = parseInt(localStorage.getItem('dailySwipes') || '0');
    
    setIsLoggedIn(!!token);
    setUserGender(gender || undefined);
    setIsPremium(premium);
    setSwipeCount(dailySwipes);

    if (gender) {
      setFilters(prev => ({
        ...prev,
        gender: gender === 'Erkek' ? 'Kadın' : 'Erkek'
      }));
    }
  }, []);

  const handleFilterChange = (newFilters: FilterOptionsType) => {
    setFilters(newFilters);
  };

  const handleSwipe = () => {
    if (isPremium || swipeCount < 10) {
      setSwipeCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem('dailySwipes', newCount.toString());
        return newCount;
      });
      return true; // Swipe'a izin ver
    }
    return false; // Swipe limitine ulaşıldı
  };

  const handlePremiumChange = () => {
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
    // Premium satın alma başarılı olduğunda çağrılacak
  };

  // Reset daily swipes at midnight
  useEffect(() => {
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // tomorrow
      0, 0, 0 // midnight
    );
    const msToMidnight = night.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setSwipeCount(0);
      localStorage.setItem('dailySwipes', '0');
    }, msToMidnight);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
        {/* Animasyonlu Arka Plan */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 opacity-80"></div>
          <Image
            src="/images/hero-bg.jpg"
            alt="Dating App"
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>

        {/* Animasyonlu Şekiller */}
        <div className="absolute inset-0 -z-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative text-center px-4 py-16 backdrop-blur-sm rounded-3xl max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-8 text-gray-900 drop-shadow-lg animate-fade-in">
            Aşkı Keşfetmenin En İyi Yolu
          </h1>
          
          <p className="text-2xl mb-12 text-gray-800 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200 drop-shadow">
            Hayalinizdeki eşleşmeyi bulun. Modern, güvenli ve eğlenceli bir deneyimle yeni insanlarla tanışın.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in animation-delay-400">
            <Link 
              href="/register" 
              className="btn-lg group relative overflow-hidden bg-gray-900 text-white hover:text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Hemen Başla</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            
            <Link 
              href="/login" 
              className="btn-lg-secondary bg-white/90 text-gray-900 border-2 border-gray-900/10 hover:bg-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Giriş Yap
            </Link>
          </div>

          {/* Özellikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-gray-900 animate-fade-in animation-delay-600">
            <div className="bg-white/90 p-6 rounded-2xl border border-gray-200 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Eşleşme</h3>
              <p className="text-gray-700">Doğrulanmış profiller ve güvenli mesajlaşma sistemi</p>
            </div>
            
            <div className="bg-white/90 p-6 rounded-2xl border border-gray-200 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-4">💝</div>
              <h3 className="text-xl font-semibold mb-2">Akıllı Eşleştirme</h3>
              <p className="text-gray-700">İlgi alanlarınıza göre en uygun eşleşmeler</p>
            </div>
            
            <div className="bg-white/90 p-6 rounded-2xl border border-gray-200 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Premium Özellikler</h3>
              <p className="text-gray-700">Sınırsız eşleşme ve özel ayrıcalıklar</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-3">
        <SwipeLimit 
          onSwipe={handleSwipe}
          onPremiumChange={handlePremiumChange}
        />
      </div>

      <div className="md:col-span-6">
        <MatchSystem filters={filters} />
      </div>

      <div className="md:col-span-3">
        <FilterOptions
          onFilterChange={handleFilterChange}
          userGender={userGender}
        />
      </div>
    </div>
  );
}
