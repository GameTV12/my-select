import {SubscriberStatistics} from "../pages/UserInfoPage";

function generateData() {
    const data: SubscriberStatistics[] = [];
    const realData: SubscriberStatistics[] = [];
    const startDate: number = Number(new Date('2020-01-01').getTime())
    const endDate: number = Number(new Date('2023-01-01').getTime())
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24)
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate + i * (1000 * 60 * 60 * 24))
        let subscribers
        let realSubscribers
        if (i < 200) {
            subscribers = Math.floor(Math.random() * 40)
        }
        else if (i < 500) {
            subscribers = Math.floor(Math.random() * 100)
        }
        else if (i < 650) {
            subscribers = Math.floor(Math.random() * 1000)
        }
        else {
            subscribers = Math.floor(Math.random() * 400)
        }
        realSubscribers = Math.ceil((Math.random() + 3.5) / 5 * subscribers)
        if (i >= 500 && i <= 652) {
            realSubscribers = Math.ceil((Math.random()) / 7 * subscribers)
        }
        if (i > 0) {
            if (i<600 || i>650) {
                subscribers+= data[i-1].subscribers
            }
            else {
                subscribers = Math.floor(data[i-1].subscribers - 1.7*subscribers)
            }
            realSubscribers+= realData[i-1].subscribers
        }
        data.push({ time: date.getTime(), subscribers })
        realData.push({ time: date.getTime(), subscribers: realSubscribers })
    }
    return {allSubscribers: data, verifiedSubscribers: realData};
}

console.log(1)

export const mockSubscribers: SubscriberStatistics[] = Array(...generateData().allSubscribers)
export const mockRealSubscribers: SubscriberStatistics[] = Array(...generateData().verifiedSubscribers)
//
// export const mockSubscribers: SubscriberStatistics[] = [
//     {time: Number(new Date('2023-10-07').getTime()), subscribers: 0},
//     {time: Number(new Date('2023-10-08').getTime()), subscribers: 0},
//     {time: Number(new Date('2023-10-09').getTime()), subscribers: 0},
//     {time: Number(new Date('2023-10-10').getTime()), subscribers: 1},
//     {time: Number(new Date('2023-10-11').getTime()), subscribers: 1},
//     {time: Number(new Date('2023-10-12').getTime()), subscribers: 8},
//     {time: Number(new Date('2023-10-13').getTime()), subscribers: 8},
//     {time: Number(new Date('2023-10-13').getTime()), subscribers: 8},
// ]
// export const mockRealSubscribers: SubscriberStatistics[] = [
//     {time: Number(new Date('2023-10-07').getTime()), subscribers: 0},
//     {time: Number(new Date('2023-10-08').getTime()), subscribers: 0},
//     {time: Number(new Date('2023-10-09').getTime()), subscribers: 0},
//     {time: Number(new Date('2023-10-10').getTime()), subscribers: 1},
//     {time: Number(new Date('2023-10-11').getTime()), subscribers: 1},
//     {time: Number(new Date('2023-10-12').getTime()), subscribers: 1},
//     {time: Number(new Date('2023-10-13').getTime()), subscribers: 1},
//     {time: Number(new Date('2023-10-13').getTime()), subscribers: 1},
// ]