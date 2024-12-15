import { useState } from 'react';
import { Check, Apple, Google } from '@mui/icons-material';

const features = [
  "Sınırsız beğeni hakkı",
  "Kimlerin sizi beğendiğini görün",
  "Premium rozeti",
  "Reklamsız deneyim",
  "Özel mesajlaşma özellikleri",
  "Konum değiştirme"
];

function Premium() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (method) => {
    setLoading(true);
    try {
      // Ödeme API çağrısı burada yapılacak
      console.log(`Processing ${method} payment...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simüle edilmiş API çağrısı
      alert('Ödeme başarılı!');
    } catch (error) {
      alert('Ödeme işlemi başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Premium'a Yükselt</h1>
      <p className="text-gray-600 mb-8">
        Tüm özelliklere erişim kazanın ve eşleşme şansınızı artırın!
      </p>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full">
            Aylık sadece ₺99.99
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-left"
            >
              <Check className="text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handlePayment('apple')}
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-4 px-6 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Apple />
            Apple Pay ile Öde
          </button>

          <button
            onClick={() => handlePayment('google')}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 rounded-lg py-4 px-6 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Google />
            Google Pay ile Öde
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        * Aboneliğiniz otomatik olarak yenilenir. İstediğiniz zaman iptal edebilirsiniz.
      </p>
    </div>
  );
}

export default Premium; 