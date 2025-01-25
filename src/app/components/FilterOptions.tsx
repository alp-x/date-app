"use client";

import React, { useState, useEffect } from 'react';
import { FilterOptions as FilterOptionsType } from '../types';

interface FilterOptionsProps {
  onFilterChange: (filters: FilterOptionsType) => void;
  userGender?: string;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange, userGender }) => {
  const [filters, setFilters] = useState<FilterOptionsType>({
    gender: userGender === 'Erkek' ? 'Kadın' : 'Erkek',
    minAge: 18,
    maxAge: 50,
    lookingFor: [],
    distance: 50
  });

  const [showAllDistance, setShowAllDistance] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (field: keyof FilterOptionsType, value: FilterOptionsType[keyof FilterOptionsType]) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgeChange = (field: 'minAge' | 'maxAge', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 18 && numValue <= 100) {
      handleChange(field, numValue);
    }
  };

  const handleGenderChange = (value: string) => {
    handleChange('gender', value || undefined);
  };

  const handleDistanceChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      handleChange('distance', numValue);
    }
  };

  const handleLookingForChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value)
        ? prev.lookingFor.filter(item => item !== value)
        : [...prev.lookingFor, value]
    }));
  };

  const lookingForOptions = [
    'Uzun Süreli İlişki',
    'Kısa Süreli İlişki',
    'Arkadaşlık',
    'Yeni İnsanlar Tanıma'
  ];

  const handleDistanceToggle = () => {
    setShowAllDistance(prev => !prev);
    setFilters(prev => ({
      ...prev,
      distance: showAllDistance ? 50 : undefined
    }));
  };

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-xl font-bold mb-6">Filtreler</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Cinsiyet</label>
        <select
          value={filters.gender || ''}
          onChange={(e) => handleGenderChange(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Seçiniz</option>
          <option value="Erkek">Erkek</option>
          <option value="Kadın">Kadın</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Yaş Aralığı</label>
        <div className="flex gap-4">
          <input
            type="number"
            min="18"
            max="100"
            value={filters.minAge.toString()}
            onChange={(e) => handleAgeChange('minAge', e.target.value)}
            className="w-1/2 p-2 border rounded-lg"
            placeholder="Min"
          />
          <input
            type="number"
            min="18"
            max="100"
            value={filters.maxAge.toString()}
            onChange={(e) => handleAgeChange('maxAge', e.target.value)}
            className="w-1/2 p-2 border rounded-lg"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Ne Arıyorsun?</label>
        <div className="flex flex-wrap gap-2">
          {lookingForOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleLookingForChange(option)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.lookingFor.includes(option)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Mesafe (KM)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="100"
            value={filters.distance || 50}
            onChange={(e) => handleDistanceChange(e.target.value)}
            className="w-full"
            disabled={showAllDistance}
          />
          <span className="text-sm font-medium w-12">
            {showAllDistance ? '∞' : filters.distance}
          </span>
        </div>
        <button
          onClick={handleDistanceToggle}
          className={`mt-2 text-sm ${
            showAllDistance ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          {showAllDistance ? 'Mesafe Sınırı Belirle' : 'Tüm Dünya'}
        </button>
      </div>

      <button
        onClick={() => setFilters({
          gender: userGender === 'Erkek' ? 'Kadın' : 'Erkek',
          minAge: 18,
          maxAge: 50,
          lookingFor: [],
          distance: 50
        })}
        className="w-full btn-secondary"
      >
        Filtreleri Sıfırla
      </button>
    </div>
  );
};

export default FilterOptions; 