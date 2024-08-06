async function handleRegistration(event) {
  event.preventDefault();
  // console.log(event.target.name.value)
  const name = event.target.name.value;
  const times = formatDateTime();
  const data = {
    name,
    taken: times[0],
    return: times[1],
  };
  try {
    const response = await axios.post("http://localhost:3000/api/book", data);
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

async function fetchBooks() {
  try {
    const response = await axios.get("http://localhost:3000/api/book");
    // console.log(response.data)
    const books = response.data;
    const cards = document.getElementById("books");
    let html = "";
    books.forEach((book) => {
      html += `
            <div class="card">
                <h2>${book.name}</h2>
                <p>Taken: ${book.taken}</p>
                <p>Return: ${book.return}</p> 
                <p>Current fine: ${calculateHoursPassed(book.return) * 10}</p>
                <button onclick="returnBook(${book.id})">Return book</button>
            </div>
            `;
    });

    cards.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
}

async function returnBook(id) {
  try {
    const response = await axios.get(`http://localhost:3000/api/book/${id}`);
    const book = response.data;
    payFine(book);
  } catch (err) {
    console.log(err);
  }
}

async function payFine(book) {
  const hours = calculateHoursPassed(book.return);
  const data = {
    name: book.name,
    amount: hours * 10,
    date: formatDateTime()[0],
  };
  submitBook(data, book.id);
}

async function submitBook(data, id) {
  console.log("first book submitted");
  const response = await axios.post(
    `http://localhost:3000/api/submitted`,
    data
  );
  deleteBook(id)
}

async function deleteBook(id) {
  const response = await axios.get(`http://localhost:3000/api/book/${id}`);
  fetchBooks();
}

async function fetchSubmittedBooks() {
    const response = await axios.get(`http://localhost:3000/api/submitted`)
    const books = response.data
    const cards = document.getElementById("record");
    let html = "";
    books.forEach((book) => {
      html += `
            <div class="card">
                <p>Book Name: ${book.name}</p>
                <p>Fine: ${book.amount}</p>
                <p>Returned On: ${book.date}</p>
            </div>
            `;
    });
    cards.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
  fetchSubmittedBooks()
});

function formatDateTime() {
  const date = new Date();
  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, "0");

  // Format the date and time
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm} IST`;
  const formattedTime1hour = `${+hours + 1}:${minutes}:${seconds} ${ampm} IST`;

  const createTime = `${formattedDate}, ${formattedTime}`;
  const expireTime = `${formattedDate}, ${formattedTime1hour}`;
  return [createTime, expireTime];
}

function calculateHoursPassed(dateTimeStr) {
  // Parse the date string
  const [datePart, timePart] = dateTimeStr.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [time, period] = timePart.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  // Adjust hours based on AM/PM
  if (period.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (period.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  // Create a Date object
  const givenDate = new Date(year, month - 1, day, hours, minutes, seconds);

  // Get the current date and time
  const now = new Date();

  // Check if the given date is in the future
  if (givenDate > now) {
    return 0;
  }

  // Calculate the difference in milliseconds and convert to hours
  const diffInMs = now - givenDate;
  const hoursPassed = Math.floor(diffInMs / (1000 * 60 * 60)) + 1; // Counting from 1 if it's past

  return hoursPassed;
}
