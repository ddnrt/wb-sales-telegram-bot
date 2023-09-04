# Telegram бот: статистика заказов/продаж с Wildberries
<p align="center">
  <img src="https://i.imgur.com/WMfdERq.png">
</p>

Данный Telegram бот предназначен для отображения статистики заказов/продаж с Wildberries. Бот автоматически получает данные из вашего аккаунта на Wildberries и предоставляет информацию о количестве заказов, продаж, выручке.

## Особенности
- Бот присылает статистику в чат каждый день в 23:59
- Команда /wb YYYY-MM-DD - для вывода статистики за произвольную дату
- Бот работает только в одном канале

## Переменные среды (.env)

```
BOT_TOKEN = "ВАШ TELEGRAM BOT ТОКЕН C @BotFather"
WB_TOKEN = "ВАШ WB API ТОКЕН С ЛИЧНОГО КАБИНЕТА"
WB_SALE_URL = "https://statistics-api.wildberries.ru/api/v1/supplier/sales"
WB_ORDER_URL = "https://statistics-api.wildberries.ru/api/v1/supplier/orders"
ID_CHAT = "ID чата Telegram"
```

## Запуск проекта
Скачайте репозиторий
```
git clone https://github.com/ddnrt/wb-sales-telegram-bot.git
```

Создайте файл .env и отредактируйте его в соотвествии с главой выше
```
touch .env
```

Запустите проект
```
npm run start
```

Для фоновой работы бота, можете использовать PM2

```
cd путь_к_проекту
pm2 start index.js --name "wb-sales-telegram-bot"
```
