import { useState, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Favorite, Close, LocationOn, School, Work, OpenInNew } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, isAuthenticated } = useAuth();

  // Potansiyel eşleşmeleri getir
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}${config.endpoints.users.potentialMatches}`,
        { headers: config.defaultHeaders() }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
        setCurrentIndex(0);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError('Kullanıcılar yüklenirken bir hata oluştu.');
      }
      setLoading(false);
    }
  }, [logout]);

  // Beğenme veya geçme işlemi
  const handleMatch = async (action) => {
    const currentUser = users[currentIndex];
    if (!currentUser) return;

    try {
      const endpoint = action === 'like' ? config.endpoints.matches.create : config.endpoints.matches.pass;
      const response = await axios.post(
        `${config.apiUrl}${endpoint}`,
        { targetUserId: currentUser.id },
        { headers: config.defaultHeaders() }
      );

      if (response.data) {
        // Eşleşme olduysa bildirim göster
        if (response.data.status === 'matched') {
          setError('Tebrikler! Yeni bir eşleşmeniz var! 🎉');
          setTimeout(() => setError(null), 3000);
        }

        // Sonraki kullanıcıya geç
        if (currentIndex < users.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // Son kullanıcıya gelindiğinde yeni kullanıcıları yükle
          await fetchUsers();
        }
      }
    } catch (err) {
      console.error('Error matching:', err);
      if (err.response?.status === 401) {
        logout();
      } else {
        setError(err.response?.data?.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Sayfa yüklendiğinde ve auth durumu değiştiğinde kullanıcıları getir
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, fetchUsers]);

  // Swipe işlemleri
  const handlers = useSwipeable({
    onSwipedLeft: () => handleMatch('pass'),
    onSwipedRight: () => handleMatch('like'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Profil resmi yüklenemezse avatar göster
  const handleImageError = (e) => {
    const currentUser = users[currentIndex];
    if (currentUser) {
      e.target.src = `${config.avatarService}/avataaars/png?seed=${currentUser.id}`;
    }
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4 text-red-500">{error}</h2>
        <button 
          onClick={fetchUsers} 
          className="btn-primary"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  // Gösterilecek kullanıcı kalmadığında
  const currentUser = users[currentIndex];
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Şu an için görüntülenecek profil kalmadı!</h2>
        <p className="text-gray-600">Daha sonra tekrar dene</p>
        <button 
          onClick={fetchUsers}
          className="btn-primary mt-4"
        >
          Yenile
        </button>
      </div>
    );
  }

  // Ana görünüm
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative card aspect-[4/5] overflow-hidden rounded-3xl shadow-xl bg-surface group">
        {/* Üst gradient */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-bg-dark/50 to-transparent z-10" />
        
        {/* Profil resmi */}
        <img 
          src={currentUser?.profileImage ? `${config.apiUrl}${currentUser.profileImage}` : `${config.avatarService}/avataaars/png?seed=${currentUser.id}`}
          alt={currentUser?.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={handleImageError}
        />

        {/* Alt bilgi alanı */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-dark/90 to-transparent z-10">
          <Link 
            to={`/user/${currentUser?.id}`}
            className="group/name inline-flex items-center text-text-primary hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold heading-gradient">{currentUser?.name}, {currentUser?.age}</h2>
            <OpenInNew className="ml-2 opacity-0 group-hover/name:opacity-100 transition-opacity" />
          </Link>

          {currentUser?.location && (
            <div className="flex items-center mt-3 text-text-secondary">
              <LocationOn className="mr-1" />
              <span>{currentUser.location}</span>
            </div>
          )}

          {currentUser?.education && (
            <div className="flex items-center mt-2 text-text-secondary">
              <School className="mr-1" />
              <span>{currentUser.education}</span>
            </div>
          )}

          {currentUser?.job && (
            <div className="flex items-center mt-2 text-text-secondary">
              <Work className="mr-1" />
              <span>{currentUser.job}</span>
            </div>
          )}

          {/* Beğenme/Geçme butonları */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleMatch('pass')}
              className="w-16 h-16 flex items-center justify-center bg-surface rounded-full shadow-lg hover:bg-surface-light hover:scale-110 hover:shadow-neon transition-all duration-300"
            >
              <Close className="text-secondary text-2xl" />
            </button>
            <button
              onClick={() => handleMatch('like')}
              className="w-16 h-16 flex items-center justify-center bg-surface rounded-full shadow-lg hover:bg-surface-light hover:scale-110 hover:shadow-glow transition-all duration-300"
            >
              <Favorite className="text-primary text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary rounded-xl text-center text-primary">
          {error}
        </div>
      )}
    </div>
  );
}

export default Home; 