export default function addMonths(date = new Date(), numOfMonths) {
    date.setMonth(date.getMonth() + numOfMonths)

    return date
}