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
}

export default Utility;