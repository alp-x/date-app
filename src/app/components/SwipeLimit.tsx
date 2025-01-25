"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SwipeLimitProps {
  onSwipe: () => boolean;
  onPremiumChange: () => void;
}

const SwipeLimit: React.FC<SwipeLimitProps> = ({ onSwipe, onPremiumChange }) => {
  const router = useRouter();
  const [remainingSwipes, setRemainingSwipes] = React.useState(10);
  const [isPremium, setIsPremium] = React.useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = React.useState(false);

  React.useEffect(() => {
    const premium = localStorage.getItem('isPremium') === 'true';
    const dailySwipes = parseInt(localStorage.getItem('dailySwipes') || '0');
    setIsPremium(premium);
    setRemainingSwipes(10 - dailySwipes);
  }, []);

  const handleSwipe = () => {
    const canSwipe = onSwipe();
    if (canSwipe) {
      setRemainingSwipes(prev => prev - 1);
    } else {
      setShowPremiumPrompt(true);
    }
  };

  const handlePremiumUpgrade = () => {
    onPremiumChange();
    setIsPremium(true);
    setShowPremiumPrompt(false);
  };

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-xl font-bold mb-4">Günlük Swipe Limiti</h3>
      
      {isPremium ? (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-2xl font-bold text-yellow-500">∞</span>
            <p className="text-sm text-gray-600">Sınırsız Swipe Hakkı</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-3 rounded-lg">
            <p className="font-semibold">Premium Üye</p>
            <p className="text-sm">Tüm özelliklere erişiminiz var</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold text-blue-500">{remainingSwipes}</span>
            <p className="text-sm text-gray-600">Kalan Swipe Hakkı</p>
          </div>
          
          {showPremiumPrompt && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-yellow-800 mb-2">
                Günlük swipe limitinize ulaştınız!
              </p>
              <p className="text-xs text-yellow-600 mb-4">
                Premium üyelik ile sınırsız swipe yapabilirsiniz.
              </p>
            </div>
          )}

          <button
            onClick={handlePremiumUpgrade}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200"
          >
            Premium&apos;a Geç
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Her gün gece yarısı yenilenir
          </p>
        </div>
      )}

      {!isPremium && remainingSwipes > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleSwipe}
            className="btn-secondary w-full"
          >
            Swipe Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipeLimit; 