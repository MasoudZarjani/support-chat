import moment from 'moment-jalaali'
moment.loadPersian({
    usePersianDigits: true
})

class Utility {
    getPersianDate(date) {
        let now = new Date().toISOString().split("T")[0];
        if (date == now) {
            return moment(date).fromNow()
        } else {
            return moment(date).format('jD jMMMM jYYYY')
        }
    }

    getPersianTime(date) {
        let now = new Date().toISOString().split("T")[1];
        if (date == now) {
            return moment(date).fromNow()
        } else {
            return moment(date).format('HH:mm')
        }
    }
}

export default new Utility();