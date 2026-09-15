export const dateFormater = ( date: Date ) => {
    const newDate= date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    console.log(newDate)
    return newDate
}