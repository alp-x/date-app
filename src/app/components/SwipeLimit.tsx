"use client";

import React, { useState, useEffect } from 'react';
import { premium } from '../services/api';

interface SwipeLimitProps {
  onSwipe: () => void;
  onPremiumChange: (isPremium: boolean) => void;
}

const SwipeLimit: React.FC<SwipeLimitProps> = ({ onSwipe, onPremiumChange }) => {
  const [swipesLeft, setSwipesLeft] = useState(20);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      setLoading(true);
      const status = await premium.getStatus();
      setIsPremium(status.isActive);
      onPremiumChange(status.isActive);
      setError(null);
    } catch (err) {
      setError('Premium durumu kontrol edilirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = () => {
    if (isPremium || swipesLeft > 0) {
      if (!isPremium) {
        setSwipesLeft(prev => prev - 1);
      }
      onSwipe();
    }
  };

  const handlePremiumSubscribe = async () => {
    try {
      setLoading(true);
      await premium.subscribe(1); // 1 aylık üyelik
      await checkPremiumStatus();
      setError(null);
    } catch (err) {
      setError('Premium üyelik işlemi sırasında bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Kaydırma Limiti</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!isPremium && (
        <div className="mb-6">
          <p className="text-lg font-medium">
            Kalan kaydırma: <span className="text-blue-600">{swipesLeft}</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(swipesLeft / 20) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleSwipe}
          disabled={!isPremium && swipesLeft === 0}
          className={`w-full py-2 px-4 rounded-lg ${
            !isPremium && swipesLeft === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isPremium ? 'Sınırsız Kaydır' : 'Kaydır'}
        </button>

        {!isPremium && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-2">Premium&apos;a Geç</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Sınırsız kaydırma hakkı
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Görüldü bilgisi
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Öne çıkan profil
              </li>
            </ul>
            <button
              onClick={handlePremiumSubscribe}
              className="w-full bg-white text-yellow-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Premium&apos;a Geç
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeLimit; 