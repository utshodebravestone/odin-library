class App {
  constructor() {
    this.books = JSON.parse(localStorage.getItem("books") ?? "[]");
  }

  newBooksNode() {
    const ul = document.createElement("ul");
    ul.classList.add("books");
    document.body.appendChild(ul);
    return ul;
  }

  add(book) {
    this.books = [...this.books, book];
    this.booksNode.appendChild(createBookDOM(book));
    this.update();
  }

  delete(id) {
    this.books = this.books.filter((book) => book.id !== id);
    this.update();
    this.render();
  }

  changeState(id) {
    this.books = this.books.map((book) =>
      book.id === id ? { ...book, haveRead: !book.haveRead } : book
    );
    this.update();
    this.render();
  }

  update() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }

  render() {
    this.booksNode = this.newBooksNode();
    this.books.map((book) => {
      this.booksNode.appendChild(createBookDOM(book));
    });
  }
}

function Book(name, author, description, haveRead) {
  return { id: createID(), name, author, description, haveRead };
}

function createID() {
  return String(Math.floor(Math.random() * 10000000));
}

function createBookDOM(book) {
  const li = document.createElement("li");

  const name = document.createElement("h1");
  name.textContent = book.name;
  li.appendChild(name);

  const author = document.createElement("h2");
  author.textContent = book.author;
  li.appendChild(author);

  const description = document.createElement("p");
  description.textContent = book.description;
  li.appendChild(description);

  const haveRead = document.createElement("button");
  haveRead.textContent = book.haveRead ? "Have Read" : "Not Read";
  haveRead.dataset.bookId = book.id;
  haveRead.classList.add("have-read-button");
  li.appendChild(haveRead);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Book";
  deleteButton.dataset.bookId = book.id;
  deleteButton.classList.add("delete-button");
  li.appendChild(deleteButton);

  return li;
}

function createBookFromEvent(event) {
  const name = event.target.name.value;
  if (name === "") {
    alert("Name of the book can't be empty.");
    return null;
  }
  const author = event.target.author.value;
  if (author === "") {
    alert("Author of the book can't be empty.");
    return null;
  }
  const description = event.target.description.value;
  if (description === "") {
    alert("Description of the book can't be empty.");
    return null;
  }
  const haveRead = event.target.haveRead.checked;
  return new Book(name, author, description, haveRead);
}

const app = new App();

const addModal = document.getElementById("add-modal");
const addButton = document.getElementById("add-button");
const addForm = document.getElementById("add-form");

app.render();

addButton.addEventListener("click", () => {
  addModal.open = true;
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  switch (e.target.to) {
    case "add":
      const book = createBookFromEvent(e);
      if (book) {
        console.log(`About to add a new book: ${JSON.stringify(book)}`);
        app.add(book);
        // e.target.reset();
        location.reload();
      }

    case "cancel":
      addModal.open = false;
      break;

    default:
      throw new Error(
        "Unknown value for `to`. Acceptable values are: `add`, `cancel`."
      );
  }
});

document.querySelectorAll(".delete-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const id = e.target.dataset.bookId;
    app.delete(id);
    location.reload();
  });
});

document.querySelectorAll(".have-read-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const id = e.target.dataset.bookId;
    app.changeState(id);
    location.reload();
  });
});
