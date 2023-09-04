const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");
const cron = require("node-cron");
require('dotenv').config()

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

bot.onText(/\/wb(.*)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (chatId == process.env.ID_CHAT) {
            const date = match[1].split(' ').join('')
            sendMessage(chatId, date)
    }
})

async function sendMessage(chatId, date, type) {
    try {
        const salesInfo = await getSalesData(date)
        const ordersInfo = await getOrdersData(date)
        if (type == 'regular') {
            bot.sendMessage(chatId, 
                `📊 Регулярная статистика за день: ${date}\n\n📦 Количество заказов: ${ordersInfo[0]}\n💵 Сумма заказов: ${Math.round(ordersInfo[1])}\n\n🛒 Количество продаж: ${salesInfo[0]}\n💰 Сумма продаж: ${Math.round(salesInfo[1])}`
            )
        } else {
            bot.sendMessage(chatId, 
                `📊 Статистика с: ${date}\n\n📦 Количество заказов: ${ordersInfo[0]}\n💵 Сумма заказов: ${Math.round(ordersInfo[1])}\n\n🛒 Количество продаж: ${salesInfo[0]}\n💰 Сумма продаж: ${Math.round(salesInfo[1])}`
            )
        }

    } catch (error) {
        bot.sendMessage(chatId, 'Произошла ошибка при выполнении запроса. Используйте запись в формате /wb YYYY-MM-DD. Например: 2023-01-30.')
    }
}

async function getSalesData(date) {
        const salesData = await axios.get(process.env.WB_SALE_URL, {
            headers: {
                Authorization: process.env.WB_TOKEN
            },
            params: {
                dateFrom: date
            }
        })
        const sales = salesData.data
        const countSales = sales.length
        let sumPay = 0
        for (i in sales) {
            sumPay =  sumPay + sales[i].forPay
        }
        const result = [countSales, sumPay]
        return result
}

async function getOrdersData(date) {
        const ordersData = await axios.get(process.env.WB_ORDER_URL, {
            headers: {
                Authorization: process.env.WB_TOKEN
            },
            params: {
                dateFrom: date
            }
        })
        const orders = ordersData.data
        const countOrders = orders.length
        let sumPay= 0
        for (i in orders) {
            sumPay =  sumPay + (orders[i].totalPrice * (1 - orders[i].discountPercent/100))
        }
        const result = [countOrders, sumPay]
        return result
    }

// Cron

cron.schedule('59 23 * * *', () => {
    let today = new Date()
    let date = today.toISOString().split('T')[0]
    sendMessage(process.env.ID_CHAT, date, type='regular')
})