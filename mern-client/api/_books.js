const sampleBooks = [
  {
    _id: "demo-1",
    bookTitle: "The Great Gatsby",
    authorName: "F. Scott Fitzgerald",
    imageURL: "https://m.media-amazon.com/images/I/81af+MCATTL._AC_UF1000,1000_QL80_.jpg",
    category: "Fiction",
    bookDescription: "A classic novel about ambition, wealth, and longing in the Jazz Age.",
    bookPDFURL: "https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf",
  },
  {
    _id: "demo-2",
    bookTitle: "To Kill a Mockingbird",
    authorName: "Harper Lee",
    imageURL: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg",
    category: "Fiction",
    bookDescription: "A powerful story about justice, childhood, and moral courage.",
    bookPDFURL: "https://example.com/to-kill-a-mockingbird.pdf",
  },
  {
    _id: "demo-3",
    bookTitle: "Atomic Habits",
    authorName: "James Clear",
    imageURL: "https://m.media-amazon.com/images/I/81F90H7hnML._AC_UF1000,1000_QL80_.jpg",
    category: "Self-Help",
    bookDescription: "Practical strategies for building good habits and breaking bad ones.",
    bookPDFURL: "https://example.com/atomic-habits.pdf",
  },
  {
    _id: "demo-4",
    bookTitle: "The Hobbit",
    authorName: "J. R. R. Tolkien",
    imageURL: "https://m.media-amazon.com/images/I/91b0C2YNSrL._AC_UF1000,1000_QL80_.jpg",
    category: "Fantasy",
    bookDescription: "Bilbo Baggins begins an unexpected adventure through Middle-earth.",
    bookPDFURL: "https://example.com/the-hobbit.pdf",
  },
  {
    _id: "demo-5",
    bookTitle: "Dune",
    authorName: "Frank Herbert",
    imageURL: "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg",
    category: "Science Fiction",
    bookDescription: "A sweeping science fiction epic of politics, power, and desert survival.",
    bookPDFURL: "https://example.com/dune.pdf",
  },
  {
    _id: "demo-6",
    bookTitle: "Pride and Prejudice",
    authorName: "Jane Austen",
    imageURL: "https://m.media-amazon.com/images/I/81Scutrtj4L._AC_UF1000,1000_QL80_.jpg",
    category: "Romance",
    bookDescription: "A witty classic romance about first impressions and social expectations.",
    bookPDFURL: "https://www.planetebook.com/free-ebooks/pride-and-prejudice.pdf",
  },
  {
    _id: "demo-7",
    bookTitle: "Sapiens",
    authorName: "Yuval Noah Harari",
    imageURL: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg",
    category: "History",
    bookDescription: "A broad look at the history and impact of humankind.",
    bookPDFURL: "https://example.com/sapiens.pdf",
  },
  {
    _id: "demo-8",
    bookTitle: "The Alchemist",
    authorName: "Paulo Coelho",
    imageURL: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
    category: "Fiction",
    bookDescription: "A fable about following your dreams and listening to your heart.",
    bookPDFURL: "https://example.com/the-alchemist.pdf",
  },
];

if (!globalThis.__bookStoreDemoBooks) {
  globalThis.__bookStoreDemoBooks = [...sampleBooks];
}

function getBooks() {
  return globalThis.__bookStoreDemoBooks;
}

function sendJson(res, statusCode, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(statusCode).json(data);
}

module.exports = { getBooks, sendJson };
