function formatDate(timeInt) {
    const datetime = new Date(timeInt)
    var year = datetime.getFullYear(),
        month = (datetime.getMonth() + 1 < 10) ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1,
        day = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate(),
        hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours(),
        min = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes(),
        sec = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
}

export { formatDate }