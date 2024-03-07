import { CurrencyResponse } from "@/apis/summary/summary.dto";

// Fungsi untuk analisis teknis
function technicalAnalysis(data: CurrencyResponse) {
  const high = parseFloat(data.high);
  const low = parseFloat(data.low);
  const last = parseFloat(data.last);
  const volIdr = parseFloat(data.vol_idr);
  // Menghitung range harga
  const priceRange = high - low;
  // Menghitung persentase perubahan harga
  const priceChangePercent = ((last - low) / priceRange) * 100;
  // Menghitung rasio volume terhadap harga terakhir
  const volRatio = volIdr / last;
  return {
      priceRange: priceRange.toLocaleString('id-ID'),
      priceChangePercent: priceChangePercent.toFixed(2) + "%",
      volRatio: volRatio.toFixed(2)
  };
}

  function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  }

  function formatCryptoVolume(value: number) {
    if(value != null || value != 0){
      return value?.toLocaleString('id-ID'); 
    }else{
      return 0;
    }
  }

  
function getTrendStyle(trend: string) {
    switch (trend) {
      case 'Bullish':
        return 'bg-green-100 text-green-800'; // Green badge for Bullish
      case 'Bearish':
        return 'bg-red-100 text-red-800'; // Red badge for Bearish
      case 'Neutral':
        return 'bg-gray-100 text-gray-800'; // Gray badge for Neutral
      case 'Overbought':
        return 'bg-purple-100 text-purple-800'; // Purple badge for Overbought
      case 'High Vilo':
        return 'bg-yellow-100 text-yellow-800'; // Yellow badge for High Volatility
      default:
        return 'bg-gray-100 text-gray-800'; // Default badge color
    }
  }

  function toTimeFormat(value: number){
  // Convert seconds to milliseconds and add UTC+7 offset (7 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const utcOffset = 7 * 60 * 60 * 1000;
  const date = new Date(value * 1000 + utcOffset);
  
  // Extract and format date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Construct formatted date string
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
  }
  
  

  export { formatRupiah, formatCryptoVolume ,getTrendStyle, technicalAnalysis, toTimeFormat}