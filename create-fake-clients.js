const axios = require('axios');

// Настройки API
const url = 'https://0a9e214d3e8e3b90efd4da86f4dcd4a9:e9a77a7980495f1b0dab47c3bb7ab1ff@shop-47237.myinsales.ru/admin/clients.json';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from('0a9e214d3e8e3b90efd4da86f4dcd4a9:e9a77a7980495f1b0dab47c3bb7ab1ff').toString('base64')}`
};

// Функция для транслитерации кириллических символов в латинские
function transliterate(str) {
  const cyrillicToLatinMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return str.split('').map(char => cyrillicToLatinMap[char] || char).join('');
}

// Функция для генерации случайного имени
function getRandomName() {
  const names = ['Алексей', 'Елена', 'Иван', 'Светлана', 'Александр', 'Дмитрий', 'Анна', 'Сергей', 'Евгений', 'Наталья'];
  return names[Math.floor(Math.random() * names.length)];
}

// Функция для генерации случайной фамилии
function getRandomLastName() {
  const lastNames = ['Кошкин', 'Зубов', 'Князев', 'Пушкин', 'Бах', 'Уткин', 'Зайцев', 'Лосев', 'Валодин', 'Сычев'];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

// Функция для генерации случайного отчества
function getRandomMiddleName() {
  const middleNames = ['Игоревич', 'Сергеевич', 'Михайлович', 'Петровна', 'Дмитриевна', 'Андреевич', 'Викторовна', 'Евгеньевич', 'Олегович', 'Татьяновна'];
  return middleNames[Math.floor(Math.random() * middleNames.length)];
}

// Функция для генерации случайного телефона
function generatePhone() {
  const phone = '+79' + Math.floor(100000000 + Math.random() * 900000000);
  return phone;
}

// Функция для генерации email
function generateEmail(firstName, lastName) {
  const firstNameLatin = transliterate(firstName.toLowerCase());
  const lastNameLatin = transliterate(lastName.toLowerCase());
  return `${firstNameLatin}.${lastNameLatin}@example.com`;
}

// Функция для создания клиента
async function createClient() {
  for (let i = 0; i < 200; i++) {
    const firstName = getRandomName();
    const lastName = getRandomLastName();
    const middleName = getRandomMiddleName();
    const email = generateEmail(firstName, lastName);
    const phone = generatePhone();

    const clientData = {
      client: {
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        registered: true,
        email: email,
        phone: phone,
        type: "Client::Individual",
        name: `${firstName} ${lastName}` // Добавлено поле name
      }
    };

    try {
      const response = await axios.post(url, clientData, { headers });
      console.log(`Client created successfully:`, response.data);
    } catch (error) {
      console.error('Error creating client:', error.response ? error.response.data : error.message);
    }
  }
}

// Создать клиентов
createClient();