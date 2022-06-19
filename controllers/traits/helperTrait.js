class Dates {

    static getDates(day_value) {
        const days = [];

        var day = new Date()
        day.setDate(day.getDate() + day_value - day.getDay());

        for (var i = 0; i < 48; i++) {
            // console.log(day.toLocaleString());
            days.push(new Date(day.getTime()));
            day.setDate(day.getDate() + 7);
        }

        return days;
    }
}

export default Dates;