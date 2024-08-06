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
    document.getElementById("myForm").reset()
    fetchBooks();
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
            <div class="card" id="cart_${book.id}">
                <h4>Book Name: ${book.name}</h4>
                <p>Taken: ${book.taken}</p>
                <p>Return: ${book.return}</p> 
                <p>Current fine: ${
                  calculateHoursPassed(book.return) * 10
                } rs</p>
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

    const hours = calculateHoursPassed(book.return);
    const fine = hours * 10;
    const data = {
      name: book.name,
      amount: fine,
      date: formatDateTime()[0],
    };

    if (fine > 0) {
      payFine(data, id);
    } else {
      submitBook(data, book.id);
    }
  } catch (err) {
    console.log(err);
  }
}

async function payFine(data, id) {
  const card = document.getElementById(`cart_${id}`);
  card.innerHTML = `
  <div class="cardForm">
    <form onsubmit="handleSubmitBook(event)" method="get">
        <input type="text" name="id" value="${id}" hidden/>
        <input type="text" name="amount" value="${data.amount}" disabled/>
        <input type="text" name="name" value="${data.name}" hidden/>
        <input type="text" name="date" value="${data.date}" hidden/>
        <button type="submit">Pay Fine</button>
    </form>
  </div>   
    `;
}

async function handleSubmitBook(event) {
  event.preventDefault();
  const [id, amount, name, date] = event.target
  const data = {
    name: name.value,
    amount: amount.value,
    date: date.value,
  }
  await submitBook(data, id.value);
}

async function submitBook(data, id) {

  const response = await axios.post(
    `http://localhost:3000/api/submitted`,
    data
  );
  deleteBook(id);
}

async function deleteBook(id) {
  const response = await axios.delete(`http://localhost:3000/api/book/${id}`);
  fetchBooks();
  fetchSubmittedBooks();
}

async function fetchSubmittedBooks() {
  const response = await axios.get(`http://localhost:3000/api/submitted`);
  const books = response.data;
  const cards = document.getElementById("record");
  let html = "";
  books.forEach((book) => {
    html += `
            <div class="card">
                <p>Book Name: ${book.name}</p>
                <p>Fine: ${book.amount} rs</p>
                <p>Returned On: ${book.date}</p>
            </div>
            <hr>
            `;
  });
  cards.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
  fetchSubmittedBooks();
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
