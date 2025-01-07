// Google Sheets API ishlatish uchun kerakli sozlamalar
const CLIENT_ID = 'YOUR_CLIENT_ID';  // O'z Google API Client ID ni qo'yish
const API_KEY = 'YOUR_API_KEY';      // O'z Google API Key ni qo'yish
const SPREADSHEET_ID = '1tqeMXSxhmkpOWr7VmrfAv5dcol_hGvcqYWWK7IdS1lM'; // Google Sheet ID
const RANGE = 'Sheet1!A:F'; // Google Sheetdagi ma'lumotlar joylashgan oraliq

// Google Sheets API`ga ulanish
function initGoogleSheetsAPI() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  }).then(() => {
    console.log("Google Sheets API ready");
  });
}

// Google Sheetsga yangi mahsulot qo'shish
function addProductToGoogleSheets(product) {
  const values = [
    [
      product.name,         // Mahsulot nomi
      product.image,        // Mahsulot rasmi URL
      product.quantity,     // Mahsulot miqdori
      product.sold,         // Sotilgan miqdor
      product.price,        // Mahsulot narxi
      product.sold * product.price // Sotilgan mahsulot narxi
    ]
  ];

  const body = {
    values: values
  };

  // Google Sheetsga ma'lumotni qo'shish
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    resource: body
  }).then((response) => {
    console.log('Product added to Google Sheets: ', response);
  }, (error) => {
    console.error('Error adding product to Google Sheets:', error);
  });
}

// Mahsulot qo'shish formasi
document.getElementById('product-form').addEventListener('submit', function (event) {
  event.preventDefault();

  // Formdan mahsulot ma'lumotlarini olish
  const productName = document.getElementById('product-name').value;
  const productImage = document.getElementById('product-image').files[0];
  const productQuantity = parseInt(document.getElementById('product-quantity').value);
  const productPrice = parseInt(document.getElementById('product-price').value);

  // Mahsulotni tekshirish
  if (!productName || !productImage || isNaN(productQuantity) || isNaN(productPrice)) {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  // Mahsulot yaratish
  const newProduct = {
    name: productName,
    image: URL.createObjectURL(productImage),
    quantity: productQuantity,
    price: productPrice,
    sold: 0,
  };

  // Mahsulotni Google Sheets`ga qo'shish
  addProductToGoogleSheets(newProduct);

  // Mahsulotni ko'rsatish va formani tozalash
  displayProducts();
  document.getElementById('product-form').reset();
});

// Google API bilan bog'lanish va mahsulotlarni qo'shish uchun sahifani yuklash
function loadGoogleAPI() {
  gapi.load("client:auth2", initGoogleSheetsAPI);
}

// Sahifa yuklanganda Google API bilan bog'lanish
window.onload = function() {
  loadGoogleAPI();
};
