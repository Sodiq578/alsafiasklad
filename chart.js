const products = JSON.parse(localStorage.getItem('products')) || [];

// Mahsulot sotilganda vaqtni saqlash
function sellProduct(index, quantity) {
  const product = products[index];
  const soldTime = new Date(); // Sotish vaqti
  product.sold += quantity;
  product.quantity -= quantity;
  
  // Mahsulot sotish vaqtini saqlash (soat, kun, hafta bo'yicha)
  const saleRecord = {
    productName: product.name,
    quantity: quantity,
    time: soldTime
  };
  
  let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
  salesHistory.push(saleRecord);
  localStorage.setItem('salesHistory', JSON.stringify(salesHistory)); // Saqlash
  
  localStorage.setItem('products', JSON.stringify(products));
  displayProducts();
}



function generateSalesReport() {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    
    const hourlySales = {}; // Soatlik sotishlar
    const dailySales = {};  // Kunlik sotishlar
    const weeklySales = {}; // Haftalik sotishlar
  
    salesHistory.forEach(sale => {
      const hour = sale.time.getHours();
      const day = sale.time.toISOString().slice(0, 10);  // YYYY-MM-DD format
      const week = getWeekNumber(sale.time);
  
      // Soatlik sotish
      if (!hourlySales[hour]) hourlySales[hour] = 0;
      hourlySales[hour] += sale.quantity;
  
      // Kunlik sotish
      if (!dailySales[day]) dailySales[day] = 0;
      dailySales[day] += sale.quantity;
  
      // Haftalik sotish
      if (!weeklySales[week]) weeklySales[week] = 0;
      weeklySales[week] += sale.quantity;
    });
  
    const hourlyLabels = Object.keys(hourlySales);
    const dailyLabels = Object.keys(dailySales);
    const weeklyLabels = Object.keys(weeklySales);
  
    const hourlyData = Object.values(hourlySales);
    const dailyData = Object.values(dailySales);
    const weeklyData = Object.values(weeklySales);
  
    // Sotish chartini yaratish
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
      type: 'line', // Yoki 'bar', 'pie', va boshqalar
      data: {
        labels: hourlyLabels, // yoki dailyLabels / weeklyLabels
        datasets: [{
          label: 'Soatlik Sotishlar',
          data: hourlyData, // yoki dailyData / weeklyData
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false
        }]
      }
    });
  }
  
  // Haftaning raqamini olish uchun yordamchi funksiya
  function getWeekNumber(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil(dayOfYear / 7);
  }

  

  // Mahsulot sotilganda
sellProduct(index, 1);

// Xisobotni yaratish
generateSalesReport();


























// dollar kusi




async function fetchExchangeRates() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    const rubleRate = data.rates.RUB; // Ruble to USD
    const usdRate = data.rates.UZS;  // Dollar to UZS
    
    document.getElementById('dollar-rate').textContent = `1 USD = ${usdRate} UZS`;
    document.getElementById('ruble-rate').textContent = `1 RUB = ${rubleRate} UZS`;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
}

async function fetchWeather() {
  try {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Tashkent&appid=YOUR_API_KEY&units=metric');
    const data = await response.json();
    document.getElementById('weather').textContent = `Havo: ${data.weather[0].description}, ${data.main.temp}°C`;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Call APIs
fetchExchangeRates();
fetchWeather();









// vaqt 











function calculateSoldProductsSummary() {
  // Maxsulotlar ro'yxati bo'lsa davom etamiz
  if (!Array.isArray(products) || products.length === 0) {
    console.error('Maxsulotlar ro\'yxati bo\'sh yoki noto\'g\'ri');
    return;
  }

  // reduce() yordamida totalSoldSum ni hisoblash
  let totalSoldSum = products.reduce((sum, product) => {
    if (product.sold && product.price) {
      sum += product.sold * product.price;
    }
    return sum;
  }, 0);

  // Vergul bilan formatlash
  let formattedSum = totalSoldSum.toLocaleString();

  // 'sold-sum' ID'li elementga natijani joylashtirish
  const soldSumElement = document.getElementById('sold-sum');
  if (soldSumElement) {
    soldSumElement.textContent = `Sotilgan maxsulotlar summasi: ${formattedSum} so'm`;
  } else {
    console.error("'sold-sum' ID'li element topilmadi.");
  }
}









