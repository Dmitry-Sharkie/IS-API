const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const readline = require('readline');

// Настройки API
const urlBase = 'https://0a9e214d3e8e3b90efd4da86f4dcd4a9:e9a77a7980495f1b0dab47c3bb7ab1ff@shop-47237.myinsales.ru/admin/clients.json?per_page=100';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from('0a9e214d3e8e3b90efd4da86f4dcd4a9:e9a77a7980495f1b0dab47c3bb7ab1ff').toString('base64')}`
};

// Функция для создания CSV-файла
function createCsvWriterWithFolder(folderName) {
  const path = `result/${folderName}/clients.csv`;

  // Создаем директорию, если она не существует
  if (!fs.existsSync(`result/${folderName}`)){
    fs.mkdirSync(`result/${folderName}`, { recursive: true });
  }
  return createCsvWriter({
    path: path,
    header: [
      { id: 'email', title: 'Электронная почта' },
      { id: 'name', title: 'Имя' },
      { id: 'phone', title: 'Телефон' }
    ],
    fieldDelimiter: ';' // Указываем разделитель точка с запятой
  });
}

// Функция для выполнения GET-запросов и записи данных в CSV
async function fetchData() {
  let page = 1;
  const allRecords = [];

  try {
    while (true) {
      const response = await axios.get(`${urlBase}&page=${page}`, { headers });
      console.log(`Data fetched from page ${page}:`, response.data.length);

      if (response.data.length === 0) {
        break; // Если данных нет, завершаем цикл
      }

      // Преобразование данных для записи в CSV
      const records = response.data.map(client => ({
        email: client.email,
        name: client.name,
        phone: client.phone
      }));

      allRecords.push(...records);
      page++;
    }
    
    // Получаем название папки от пользователя
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('Введите название папки: ', (folderName) => {
        rl.close();

        // Создаем и записываем данные в CSV-файл
        const csvWriter = createCsvWriterWithFolder(folderName);
        csvWriter.writeRecords(allRecords)
          .then(() => {
            console.log(`Data written to result/${folderName}/clients.csv`);
            resolve();
          });
      });
    });

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Первый запуск сразу при старте программы
fetchData();