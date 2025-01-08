// ".navList" klassiga ega barcha elementlarga klik hodisasini qo'shish
document.querySelectorAll(".navList").forEach(function(element) {
  element.addEventListener("click", function() {
    // 1. Barcha ".navList" elementlaridan "active" klassini olib tashlash
    document.querySelectorAll(".navList").forEach(function(e) {
      e.classList.remove("active");
    });

    // 2. Faqat bosingan elementga "active" klassini qo'shish
    this.classList.add("active");

    // 3. Bosingan navList elementining indeksini olish
    var navLists = Array.from(document.querySelectorAll(".navList"));
    var index = navLists.indexOf(this);

    // 4. Barcha ".data-table" elementlarini yashirish
    document.querySelectorAll(".data-table").forEach(function(table) {
      table.style.display = "none";
    });

    // 5. Mos keluvchi ".data-table" elementini ko'rsatish
    var tables = document.querySelectorAll(".data-table");
    if (tables.length > index) {
      tables[index].style.display = "block";
    }
  });
});

// Mahsulotlarni localStorage'dan olish yoki bo'sh massivni boshlash
const products = JSON.parse(localStorage.getItem('products')) || [];

// Yangi mahsulotni qo'shish funksiyasi
document.getElementById('product-form').addEventListener('submit', function (event) {
  event.preventDefault();

  // Formdan mahsulotning nomi, rasmi, miqdori va narxini olish
  const productName = document.getElementById('product-name').value;
  const productImage = document.getElementById('product-image').files[0];
  const productQuantity = parseInt(document.getElementById('product-quantity').value);
  const productPrice = parseInt(document.getElementById('product-price').value);

  // Bo'sh maydonlarni tekshirish
  if (!productName || !productImage || isNaN(productQuantity) || isNaN(productPrice)) {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  // Takrorlanuvchi mahsulotlarni tekshirish
  const existingProduct = products.find(product => product.name === productName);
  if (existingProduct) {
    alert(`Bunday nomdagi mahsulot allaqachon mavjud: ${productName}`);
    return; // Takroriy mahsulotni qo'shmaslik
  }

  // Yangi mahsulotni massivga qo'shish
  const newProduct = {
    name: productName,
    image: URL.createObjectURL(productImage),
    quantity: productQuantity,
    price: productPrice,
    sold: 0,
  };
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products)); // Mahsulotlarni localStorage'da saqlash
  displayProducts();

  // Formni tozalash
  document.getElementById('product-form').reset();
});

// Mahsulotlarni ko'rsatish funksiyasi
function displayProducts() {
  const productList = document.getElementById('product-list');
  const trackedProductList = document.getElementById('tracked-products-list').getElementsByTagName('tbody')[0];
  productList.innerHTML = '';
  trackedProductList.innerHTML = '';

  let totalSum = 0; // Jami summani hisoblash

  products.forEach((product, index) => {
    const li = document.createElement('li');
    li.textContent = product.name;

    // Mahsulotni ro'yxatga qo'shish
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td><img src="${product.image}" alt="${product.name}" width="150" height="150" /></td>
      <td>${product.quantity}</td>
      <td>${product.sold}</td>
      <td>${product.quantity - product.sold}</td>
      <td>${product.price} so'm</td>
      <td>${(product.quantity - product.sold) * product.price} so'm</td>
      <td>2025-01-04</td>
      <td class="icons-box">
        <button class="sotilganlar"><i class="fas fa-cart-plus"></i></button>
        <button onclick="openEditModal(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="openDeleteModal(${index})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    trackedProductList.appendChild(tr);

    // Jami summa hisoblash
    totalSum += (product.quantity - product.sold) * product.price;
  });

  // Jami summani formatlash
  const formattedTotalSum = totalSum.toLocaleString('uz-UZ');
  document.getElementById('total-sum').textContent = `Jami Summa: ${formattedTotalSum} so'm`;
}

// Sotuvlar oynasini ochish


function openModalSale(index) {
  const product = products[index];
  document.getElementById('sales-modal').style.display = 'flex'; // Modalni ko'rsatish

  // Modalda mahsulot nomini ko'rsatish
  document.getElementById('product-name-modal').textContent = `Mahsulot: ${product.name}`;
  
  document.getElementById('sold-quantity-modal').value = 1;
  document.getElementById('product-price-modal').value = product.price;

  // Miqdor kiritilganda jami narxni avtomatik hisoblash
  document.getElementById('sold-quantity-modal').addEventListener('input', function () {
    const soldQuantity = parseInt(document.getElementById('sold-quantity-modal').value);
    const totalPrice = soldQuantity * product.price;
    document.getElementById('total-price-modal').value = totalPrice;
  });

  // Sotish oynasining "submit" hodisasi
  document.getElementById('sales-form').onsubmit = function (event) {
    event.preventDefault();

    const soldQuantity = parseInt(document.getElementById('sold-quantity-modal').value);
    if (soldQuantity <= product.quantity - product.sold) {
      // Sotuvdan keyin mahsulotni yangilash
      product.sold += soldQuantity;
      product.quantity -= soldQuantity;

      localStorage.setItem('products', JSON.stringify(products)); // Mahsulotlarni yangilash
      displayProducts(); // Mahsulot ro'yxatini yangilash

      // Modalni yopish
      closeModal();
    } else {
      alert('Sotiladigan miqdor mavjud emas!');
    }
  };
}

// Modalni yopish funksiyasi
function closeModal() {
  document.getElementById('sales-modal').style.display = 'none';
}





























// Mahsulotni tahrirlash uchun modalni ochish
function openEditModal(index) {
  const product = products[index];
  const newName = prompt("Mahsulot nomini kiriting:", product.name);
  const newPrice = prompt("Mahsulot narxini kiriting:", product.price);
  const newQuantity = prompt("Mahsulot miqdorini kiriting:", product.quantity);

  if (newName && newPrice && newQuantity) {
    product.name = newName;
    product.price = parseInt(newPrice);
    product.quantity = parseInt(newQuantity);
    localStorage.setItem('products', JSON.stringify(products)); // Mahsulotlarni yangilash
    displayProducts(); // Mahsulot ro'yxatini yangilash
  }
}

// Mahsulotni o'chirish uchun modalni ochish
function openDeleteModal(index) {
  const product = products[index];
  document.getElementById('edit-delete-modal').style.display = 'block';
  document.getElementById('confirmation-message').textContent = `Siz ${product.name} mahsulotini o'chirmoqchimisiz?`;
  
  // O'chirishni tasdiqlash
  window.confirmDelete = function() {
    products.splice(index, 1); // Mahsulotni massivdan olib tashlash
    localStorage.setItem('products', JSON.stringify(products)); // Mahsulotlarni yangilash
    displayProducts(); // Mahsulot ro'yxatini yangilash
    closeEditDeleteModal();
  };
}

// Modalni yopish
function closeModal() {
  document.getElementById('sales-modal').style.display = 'none';
  
  // Inputlarni tozalash
  document.getElementById('sold-quantity-modal').value = '';
  document.getElementById('product-price-modal').value = '';
  document.getElementById('total-price-modal').value = '';
}

// Tahrir/ochirish modalini yopish
function closeEditDeleteModal() {
  document.getElementById('edit-delete-modal').style.display = 'none';
}

// Mahsulotlarni boshida ko'rsatish
displayProducts();

// Mahsulotlarni qidirish
function searchProducts() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const productList = document.getElementById('tracked-products-list').getElementsByTagName('tr');
  
  Array.from(productList).forEach((row) => {
    const productName = row.children[0].textContent.toLowerCase();
    if (productName.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Dollar kursini olish
async function fetchDollarExchangeRate() {
  try {
    const response = await fetch('https://v6.exchangerate-api.com/v6/0b13a9bfaa3548ffb8c8aa8d77d26b06/latest/USD');
    const data = await response.json();
    return data.conversion_rates.UZS; // USD dan UZS ga kurs
  } catch (error) {
    console.error('Dollar kursini olishda xatolik:', error);
    return null;
  }
}

// Ob-havo ma'lumotlarini olish
async function fetchWeather() {
  try {
    const apiKey = 'YOUR_API_KEY';  // O'z API kalitingizni kiriting
    const city = 'Tashkent';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    const temperature = data.main.temp;
    const weatherDescription = data.weather[0].description;
    return `${city}: ${temperature}°C, ${weatherDescription}`;
  } catch (error) {
    console.error('Ob-havo ma\'lumotlarini olishda xatolik:', error);
    return 'Ob-havo ma\'lumotlarini olishda xatolik.';
  }
}

// Joriy vaqtni olish
function getCurrentTime() {
  const currentTime = new Date();
  let hours = currentTime.getHours().toString().padStart(2, '0');
  let minutes = currentTime.getMinutes().toString().padStart(2, '0');
  let seconds = currentTime.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Footer bo'limidagi barcha ma'lumotlarni yangilash
async function updateFooter() {
  const dollarRate = await fetchDollarExchangeRate();
  const weather = await fetchWeather();
  const time = getCurrentTime();

  document.getElementById('dollar-rate').textContent = dollarRate ? `Dollar: ${dollarRate}` : 'Dollar kursini olishda xatolik';
  document.getElementById('weather').textContent = weather;
  document.getElementById('time').textContent = time;

  setTimeout(updateFooter, 1000);  // Har bir soniyada yangilash
}

updateFooter();  // Footerni yangilashni boshlash











const users = [
  { username: 'Alibek', password: 'sodiq191929' },
  { username: 'Dilfuza', password: 'ssx191929' },
];




function checkLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Tizimga muvaffaqiyatli kirish
    document.querySelector('.user-info span').textContent = `Assalomu alaykum, ${user.username}!`;
    document.getElementById('login-form').style.display = 'none'; // Kirish formasi yashirilsin
  } else {
    alert('Ism yoki parol xato!');
  }
}

// Foydalanuvchini tizimga kirishini tekshirish
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Formani yuborishni oldini olish
  checkLogin();
});




















function openModal() {
  document.getElementById('employeeFormModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('employeeFormModal').style.display = 'none';
}

function addEmployee() {
  alert('Xodim qo\'shildi!');
  closeModal();
}
