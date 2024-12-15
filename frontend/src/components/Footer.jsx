import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, LinkedIn, Favorite } from '@mui/icons-material';

function Footer() {
  return (
    <footer className="bg-surface mt-auto py-8 border-t border-surface-light/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo ve Slogan */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold heading-gradient mb-2">DateApp</h2>
            <p className="text-text-secondary">Aşkı keşfetmenin modern yolu</p>
          </div>

          {/* Linkler */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/about" className="text-text-secondary hover:text-primary transition-colors">
              Hakkımızda
            </Link>
            <Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors">
              Gizlilik
            </Link>
            <Link to="/terms" className="text-text-secondary hover:text-primary transition-colors">
              Kullanım Şartları
            </Link>
            <Link to="/contact" className="text-text-secondary hover:text-primary transition-colors">
              İletişim
            </Link>
          </div>

          {/* Sosyal Medya */}
          <div className="flex gap-4">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <Instagram />
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <Twitter />
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <Facebook />
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <LinkedIn />
            </a>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 pt-6 border-t border-surface-light/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © 2024 DateApp. Tüm hakları saklıdır.
          </p>
          <p className="text-text-secondary text-sm flex items-center gap-1">
            Made with <Favorite className="text-primary text-sm" /> in Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 