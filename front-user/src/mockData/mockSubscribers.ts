import {SubscriberStatistics} from "../pages/UserInfoPage";

function generateData() {
    const data: SubscriberStatistics[] = [];
    const startDate: number = Number(new Date('2020-01-01').getTime())
    const endDate: number = Number(new Date('2023-01-01').getTime())
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24)
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate + i * (1000 * 60 * 60 * 24))
        let subscribers
        if (i < 200) {
            subscribers = Math.floor(Math.random() * 40)
        }
        else if (i < 500) {
            subscribers = Math.floor(Math.random() * 100)
        }
        else {
            subscribers = Math.floor(Math.random() * 1000)
        }
        if (i > 0) {
            if (i<600 || i>700) {
                subscribers+= data[i-1].subscribers
            }
            else {
                subscribers = data[i-1].subscribers - subscribers
            }
        }
        data.push({ time: date.getTime(), subscribers })
    }
    return data;
}

console.log(1)

export const mockSubscribers: SubscriberStatistics[] = Array(...generateData())