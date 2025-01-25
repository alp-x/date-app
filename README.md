# Dating App Projesi

## İlk Prompt
"bana dating app yaz basit bir yapıda olsun, eşleşme için match beğenme red etme sayfası, kendi profil sayfası, mesajlasma sayfası olsun, kaydırma günde 20 tane olsun, premium u olsun premium da sınırsız kaydırma olsun, profille orta detayda bir yapıya sahip olsun, kaydırma yaparken yine küçük caplı bir filtresi olsun, 2 cinsiyet olsun, ama arayışlar bir kaç tane olabilir, piyasadaki dating app lere benzer bir yapıda olsun, birde bunun yönetim paneli olsun buraya sadece ben girebileyim, bu panelde para akışı, üyeler, premium bilgileri vs hepsi olsun, ufak caplı mudahalelerim olsun, kullanıcı banlama ve premium iptali gibi yada kullanıcı silme gibi, yeni üyeler panelde görünsün bir istatistik sayfasıda olsun, birde development ortamı olsun burada fake veriler yer alsın, mysql database kullanıyorum buna göre olsun herşey, backend ve frontend uyum içinde çalışsın, development de geliştirdiğim şeyler canlı da da çalışacak şekilde olsun"

## Özellikler
- **Eşleşme Sistemi**: Kullanıcılar arasında eşleşme, beğenme ve reddetme özellikleri
- **Profil Sayfası**: Kullanıcıların kendi profillerini görüntüleyip düzenleyebileceği sayfa
- **Mesajlaşma**: Eşleşen kullanıcılar arasında mesajlaşma imkanı
- **Kaydırma Limiti**: Günde 20 kaydırma hakkı, premium kullanıcılar için sınırsız
- **Filtreleme**: Kaydırma sırasında cinsiyet, yaş ve mesafe filtreleri
- **Premium Özellikler**: Sınırsız kaydırma, görüldü bilgisi ve öne çıkan profil
- **Yönetim Paneli**: Para akışı, kullanıcı yönetimi, istatistikler ve daha fazlası

## Yönetici Paneli Kullanımı

### Giriş
1. Admin hesabı ile giriş yapın: 
   - Email: admin@dating.com
   - Şifre: admin123

### İstatistikler Sayfası
- Toplam kullanıcı sayısı
- Premium üye sayısı
- Günlük eşleşme sayısı
- Aylık gelir grafiği

### Kullanıcı Yönetimi
- Tüm kullanıcıları listele
- Kullanıcı detaylarını görüntüle
- Kullanıcı banla/yasağı kaldır
- Premium üyelik iptali

### Premium İşlemleri
- Premium üyelik durumlarını görüntüle
- Manuel premium aktivasyonu/iptali
- Ödeme geçmişi

### Raporlar
- Günlük/haftalık/aylık kayıt istatistikleri
- Premium dönüşüm oranları
- Eşleşme istatistikleri

## Kurulum
1. Projeyi klonlayın: `git clone <repo-url>`
2. Bağımlılıkları yükleyin: `npm install`
3. MySQL veritabanını oluşturun:
   ```sql
   mysql -u root < src/server/schema.sql
   mysql -u root < src/server/seed.sql
   ```
4. `.env` dosyasını düzenleyin
5. Development ortamını başlatın:
   ```bash
   # Backend için
   cd src/server
   npm run dev

   # Frontend için (yeni terminal)
   npm run dev
   ```

## Notlar
- MySQL veritabanı bağlantı bilgilerini `.env` dosyasında belirtin
- Admin paneline sadece admin@dating.com hesabı ile erişilebilir
- Development ortamında fake veriler otomatik yüklenir

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
