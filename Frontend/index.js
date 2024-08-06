function formatDateTime(date) {
    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert to 12-hour format
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');

    // Format the date and time
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm} IST`;
    const formattedTime1hour = `${+hours+1}:${minutes}:${seconds} ${ampm} IST`;

    const createTime = `${formattedDate}, ${formattedTime}`
    const expireTime =  `${formattedDate} ${formattedTime1hour}`
    return [createTime, expireTime];
}

// Example usage:
const now = new Date();
const formattedDateTime = formatDateTime(now);
console.log(formattedDateTime);

