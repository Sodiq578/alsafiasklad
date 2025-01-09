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

    // Quantity va sold raqam ekanligini tekshiramiz
    const availableQuantity = Number(product.quantity) || 0;
    const soldQuantity = Number(product.sold) || 0;
    const remainingQuantity = availableQuantity - soldQuantity;
    const totalPrice = remainingQuantity * Number(product.price) || 0;
    
    tr.innerHTML = `
      <td>${product.name}</td>
      <td><img src="${product.image}" alt="${product.name}" width="150" height="150" /></td>
      <td>${availableQuantity}</td>
      <td>${soldQuantity}</td>
      <td>${remainingQuantity}</td>
      <td>${Number(product.price).toLocaleString()} so'm</td>
      <td>${totalPrice.toLocaleString()} so'm</td>
      <td>2025-01-04</td>
      <td class="icons-box">
        <button onclick="openModal(${index})"><i class="fas fa-cart-plus"></i></button>
        <button onclick="openEditModal(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="openDeleteModal(${index})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    
    trackedProductList.appendChild(tr);
    
    
    trackedProductList.appendChild(tr);

    // Jami summa hisoblash
    totalSum += (product.quantity - product.sold) * product.price;
  });

  // Jami summani formatlash
  const formattedTotalSum = totalSum.toLocaleString('uz-UZ');
  document.getElementById('total-sum').textContent = ` ${formattedTotalSum} so'm`;
}

// Sotuvlar oynasini ochish
function openModal(index) {
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
  
    // Narxni milliy formatda ko'rsatish
    const formattedPrice = totalPrice.toLocaleString('uz-UZ', { style: 'decimal' });
    
    // Formatted narxni inputga chiqarish
    document.getElementById('total-price-modal').value = formattedPrice;
  });
  

  document.getElementById('sales-form').onsubmit = function (event) {
    event.preventDefault();

    const soldQuantity = parseInt(document.getElementById('sold-quantity-modal').value);
    if (soldQuantity <= product.quantity - product.sold) {
      // Sotuvdan keyin mahsulotni yangilash
      product.sold += soldQuantity;
      product.quantity -= soldQuantity;

      // Mahsulotlarni localStorage'da yangilash
      localStorage.setItem('products', JSON.stringify(products));

      // Mahsulot ro'yxatini yangilash
      displayProducts(); 

      // Modalni yopish
      closeModal();
    } else {
      alert('Sotiladigan miqdor mavjud emas!');
    }
  };
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
  const isDelete = confirm(`Are you sure you want to delete "${product.name}"?`);
  
  if (isDelete) {
    products.splice(index, 1); // Mahsulotni massivdan o'chirish
    localStorage.setItem('products', JSON.stringify(products)); // Mahsulotlarni yangilash
    displayProducts(); // Mahsulot ro'yxatini yangilash
  }
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
 





 
                                    

 







// Sotuvlar oynasini ochish
function openModal(index) {
  const product = products[index];
  document.getElementById('sales-modal').style.display = 'flex'; // Modalni ko'rsatish

  // Modalda mahsulot nomini ko'rsatish
  document.getElementById('product-name-modal').textContent = `Mahsulot: ${product.name}`;

  document.getElementById('sold-quantity-modal').value = 1;
  document.getElementById('total-price-modal').value = product.price;

  // Miqdor kiritilganda jami narxni avtomatik hisoblash
  document.getElementById('sold-quantity-modal').addEventListener('input', function () {
    const soldQuantity = parseInt(document.getElementById('sold-quantity-modal').value);
    const totalPrice = soldQuantity * product.price;
    document.getElementById('total-price-modal').value = totalPrice;
  });

  // Sotuvni bajarish (Formani yuborish)
  document.getElementById('sales-form').onsubmit = function (event) {
    event.preventDefault();

    const soldQuantity = parseInt(document.getElementById('sold-quantity-modal').value);
    if (soldQuantity <= product.quantity - product.sold) {
      // Sotuvdan keyin mahsulotni yangilash
      product.sold += soldQuantity;
      product.quantity -= soldQuantity;

      // Mahsulotlarni localStorage'da yangilash
      localStorage.setItem('products', JSON.stringify(products));

      // Mahsulot ro'yxatini yangilash
      displayProducts();

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

// Yopish tugmasi bosilganda modalni yopish
document.querySelector('.close-btn').addEventListener('click', closeModal);











// exelga yuklash




document.getElementById('download-excel').addEventListener('click', function () {
  // Excel faylga mahsulotlar ma'lumotlarini tayyorlash
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    ['Nomi', 'Rasmi', 'Mavjud miqdor', 'Sotilgan miqdor', 'Qolgan miqdor', 'Narxi (so\'m)', 'Jami summa (so\'m)', 'Sana']
  ];

  products.forEach(product => {
    const availableQuantity = Number(product.quantity) || 0;
    const soldQuantity = Number(product.sold) || 0;
    const remainingQuantity = availableQuantity - soldQuantity;
    const totalPrice = remainingQuantity * Number(product.price) || 0;

    worksheetData.push([
      product.name,
      product.image, // Rasmlarni URL sifatida saqlash
      availableQuantity,
      soldQuantity,
      remainingQuantity,
      Number(product.price).toLocaleString(),
      totalPrice.toLocaleString(),
      '2025-01-04' // Har bir mahsulot uchun sanani qo'shishingiz mumkin
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mahsulotlar');

  // Excel faylni saqlash
  XLSX.writeFile(workbook, 'mahsulotlar.xlsx');
});














// zaxira







// Statistikani ko'rsatish uchun funksiya
function updateStatistics() {
  const statisticsContainer = document.getElementById('statistics-container');
  statisticsContainer.innerHTML = ''; // Eski statistikani tozalash

  let totalProducts = 0; // Umumiy mahsulot miqdori
  let totalRemaining = 0; // Qolgan mahsulotlar soni

  products.forEach(product => {
    const availableQuantity = Number(product.quantity) || 0;
    const soldQuantity = Number(product.sold) || 0;
    const remainingQuantity = availableQuantity - soldQuantity;

    // Statistika elementini yaratish
    const statItem = document.createElement('div');
    statItem.classList.add('stat-item');
    statItem.innerHTML = `
      <strong>${product.name}</strong>: Qolgan miqdor <span>${remainingQuantity}</span> ta
    `;

    statisticsContainer.appendChild(statItem);

    totalProducts += availableQuantity;
    totalRemaining += remainingQuantity;
  });

  // Umumiy statistikani ko'rsatish
  const totalStats = document.createElement('div');
  totalStats.classList.add('stat-summary');
  totalStats.innerHTML = `
    <strong>Jami mahsulotlar:</strong> ${totalProducts} ta<br>
    <strong>Jami qolgan mahsulotlar:</strong> ${totalRemaining} ta
  `;
  statisticsContainer.appendChild(totalStats);
}

// Mahsulotlar ro'yxatini yangilaganda statistikani ham yangilash
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

    // Quantity va sold raqam ekanligini tekshiramiz
    const availableQuantity = Number(product.quantity) || 0;
    const soldQuantity = Number(product.sold) || 0;
    const remainingQuantity = availableQuantity - soldQuantity;
    const totalPrice = remainingQuantity * Number(product.price) || 0;
    
    tr.innerHTML = `
      <td>${product.name}</td>
      <td><img src="${product.image}" alt="${product.name}" width="150" height="150" /></td>
      <td>${availableQuantity}</td>
      <td>${soldQuantity}</td>
      <td>${remainingQuantity}</td>
      <td>${Number(product.price).toLocaleString()} so'm</td>
      <td>${totalPrice.toLocaleString()} so'm</td>
      <td>2025-01-04</td>
      <td class="icons-box">
        <button onclick="openModal(${index})"><i class="fas fa-cart-plus"></i></button>
        <button onclick="openEditModal(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="openDeleteModal(${index})"><i class="fas fa-trash-alt"></i></button>
      </td>
    `;
    
    trackedProductList.appendChild(tr);
    
    totalSum += (product.quantity - product.sold) * product.price;
  });

  // Jami summani formatlash
  const formattedTotalSum = totalSum.toLocaleString('uz-UZ');
  document.getElementById('total-sum').textContent = ` ${formattedTotalSum} so'm`;

  // Statistikani yangilash
  updateStatistics();
}









































// Mahsulotlar ro'yxati (ma'lumotlar)
 
// Statistikalarni yangilash
function generateCharts() {
  // Mahsulot nomlari
  const productNames = products.map((product) => product.name);

  // Qolgan miqdor va sotilgan miqdor
  const remainingQuantities = products.map(
    (product) => product.quantity - product.sold
  );
  const soldQuantities = products.map((product) => product.sold);

  // Qolgan miqdor uchun diagramma
  const ctx1 = document.getElementById('remainingChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [
        {
          label: 'Qolgan Miqdor',
          data: remainingQuantities,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Miqdor' } },
        x: { title: { display: true, text: 'Mahsulotlar' } },
      },
    },
  });

  // Sotilgan miqdor uchun diagramma
  const ctx2 = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: productNames,
      datasets: [
        {
          label: 'Sotilgan Mahsulotlar',
          data: soldQuantities,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true },
      },
    },
  });
}

// Grafiklarni yaratish
generateCharts();



















