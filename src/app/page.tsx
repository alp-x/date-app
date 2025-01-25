"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import MatchSystem from './components/MatchSystem';
import FilterOptions from './components/FilterOptions';
import SwipeLimit from './components/SwipeLimit';
import { FilterOptions as FilterOptionsType } from './types';

export default function Home() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGender, setUserGender] = useState<'Erkek' | 'Kadın' | null>(null);
  const [filters, setFilters] = useState<FilterOptionsType>({
    gender: undefined,
    minAge: 18,
    maxAge: 99,
    distance: 100,
    lookingFor: []
  });

  useEffect(() => {
    // Kullanıcı giriş durumunu kontrol et
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Kullanıcı cinsiyetini al
    const gender = localStorage.getItem('userGender');
    if (gender === 'Erkek' || gender === 'Kadın') {
      setUserGender(gender);
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
    // Kaydırma işlemi gerçekleştiğinde yapılacak işlemler
  };

  const handlePremiumChange = (status: boolean) => {
    setIsPremium(status);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Aşkı Keşfetmenin Modern Yolu
          </h1>
          <p className="text-xl mb-12">
            Hayalinizdeki kişiyi bulmanın en kolay ve güvenli yolu.
            Hemen ücretsiz üye olun ve eşleşmeye başlayın.
          </p>
          <div className="space-x-4">
            <a href="/login" className="btn bg-white text-blue-600 hover:bg-gray-100">
              Giriş Yap
            </a>
            <a href="/register" className="btn bg-transparent border-2 hover:bg-white/10">
              Kayıt Ol
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sol Sidebar - Kaydırma Limiti */}
          <div className="md:col-span-3">
            <SwipeLimit onSwipe={handleSwipe} onPremiumChange={handlePremiumChange} />
          </div>

          {/* Ana İçerik - Eşleşme Sistemi */}
          <div className="md:col-span-6">
            <MatchSystem filters={filters} />
          </div>

          {/* Sağ Sidebar - Filtreler */}
          <div className="md:col-span-3">
            <FilterOptions onFilterChange={handleFilterChange} userGender={userGender} />
          </div>
        </div>

        {/* Premium Özellikleri */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Premium Avantajları
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center text-white">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sınırsız Kaydırma</span>
                </div>
                <div className="flex items-center text-white">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Görüldü Bilgisi</span>
                </div>
                <div className="flex items-center text-white">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Öne Çıkan Profil</span>
                </div>
              </div>
              <button className="mt-6 w-full sm:w-auto bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Premium&apos;a Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
