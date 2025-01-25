"use client";

import React, { useState } from 'react';
import { FilterOptions as FilterOptionsType } from '../types';

interface FilterOptionsProps {
  onFilterChange: (filters: FilterOptionsType) => void;
  userGender: 'Erkek' | 'Kadın' | null;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange, userGender }) => {
  const [filters, setFilters] = useState<FilterOptionsType>({
    gender: userGender === 'Erkek' ? 'Kadın' : 'Erkek',
    minAge: 18,
    maxAge: 99,
    distance: 100,
    lookingFor: []
  });

  const handleChange = (
    name: keyof FilterOptionsType,
    value: string | number | string[] | null
  ) => {
    const updatedFilters = {
      ...filters,
      [name]: value === '' ? undefined : value
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleLookingForChange = (value: string) => {
    const lookingFor = filters.lookingFor || [];
    const updatedLookingFor = lookingFor.includes(value)
      ? lookingFor.filter(item => item !== value)
      : [...lookingFor, value];

    handleChange('lookingFor', updatedLookingFor);
  };

  const lookingForOptions = [
    "Uzun Süreli İlişki",
    "Kısa Süreli İlişki",
    "Yeni Arkadaşlar",
    "Henüz Karar Veremedim"
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Filtreleme</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cinsiyet
          </label>
          <select
            value={filters.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value || null)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!userGender}
          >
            <option value="">Hepsi</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yaş Aralığı
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={filters.minAge}
                onChange={(e) => handleChange('minAge', parseInt(e.target.value) || 18)}
                min="18"
                max="99"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={filters.maxAge}
                onChange={(e) => handleChange('maxAge', parseInt(e.target.value) || 99)}
                min="18"
                max="99"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ne Arıyorsun?
          </label>
          <div className="flex flex-wrap gap-2">
            {lookingForOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleLookingForChange(option)}
                className={`px-4 py-2 rounded-full text-sm ${
                  filters.lookingFor?.includes(option)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mesafe
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="100"
              value={filters.distance}
              onChange={(e) => handleChange('distance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filters.distance} KM</span>
              <button
                onClick={() => handleChange('distance', 0)}
                className="text-blue-500 hover:text-blue-600"
              >
                Tüm Dünya
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              const defaultFilters: FilterOptionsType = {
                gender: userGender === 'Erkek' ? 'Kadın' : 'Erkek',
                minAge: 18,
                maxAge: 99,
                distance: 100,
                lookingFor: []
              };
              setFilters(defaultFilters);
              onFilterChange(defaultFilters);
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions; 