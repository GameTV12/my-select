import {SubscriberStatistics} from "../pages/UserInfoPage";

function generateData() {
    const data: SubscriberStatistics[] = [];
    const startDate: number = Number(new Date('2020-01-01').getTime())
    const endDate: number = Number(new Date('2023-01-01').getTime())
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate + i * (1000 * 60 * 60 * 24));
        const subscribers = Math.floor(Math.random() * 10000);
        data.push({ time: date.getTime() / 1000, subscribers });
    }
    return data;
}

console.log(1)

export const mockSubscribers: SubscriberStatistics[] = Array(...generateData())