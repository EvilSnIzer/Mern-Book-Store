const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

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

let demoBooks = [...sampleBooks];
let bookCollections;
let mongoConnected = false;

const withApiPrefix = (path) => [path, `/api${path}`];

app.get(withApiPrefix("/"), (req, res) => {
  res.send({
    message: "MERN Book Store API is running",
    database: mongoConnected ? "MongoDB" : "in-memory demo data",
  });
});

app.post(withApiPrefix("/upload-book"), async (req, res) => {
  const data = req.body;

  if (mongoConnected) {
    const result = await bookCollections.insertOne(data);
    return res.send(result);
  }

  const insertedBook = { ...data, _id: `demo-${Date.now()}` };
  demoBooks.push(insertedBook);
  res.send({ acknowledged: true, insertedId: insertedBook._id });
});

app.patch(withApiPrefix("/book/:id"), async (req, res) => {
  const { id } = req.params;
  const updateBookData = req.body;

  if (mongoConnected) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid book id" });
    }

    const result = await bookCollections.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateBookData },
      { upsert: true }
    );
    return res.send(result);
  }

  const index = demoBooks.findIndex((book) => book._id === id);
  if (index === -1) {
    return res.status(404).send({ message: "Book not found" });
  }

  demoBooks[index] = { ...demoBooks[index], ...updateBookData };
  res.send({ acknowledged: true, modifiedCount: 1 });
});

app.delete(withApiPrefix("/book/:id"), async (req, res) => {
  const { id } = req.params;

  if (mongoConnected) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid book id" });
    }

    const result = await bookCollections.deleteOne({ _id: new ObjectId(id) });
    return res.send(result);
  }

  const beforeCount = demoBooks.length;
  demoBooks = demoBooks.filter((book) => book._id !== id);
  res.send({ acknowledged: true, deletedCount: beforeCount - demoBooks.length });
});

app.get(withApiPrefix("/all-books"), async (req, res) => {
  const query = req.query?.category ? { category: req.query.category } : {};

  if (mongoConnected) {
    const result = await bookCollections.find(query).toArray();
    return res.send(result);
  }

  const result = query.category
    ? demoBooks.filter((book) => book.category === query.category)
    : demoBooks;
  res.send(result);
});

app.get(withApiPrefix("/book/:id"), async (req, res) => {
  const { id } = req.params;

  if (mongoConnected) {
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid book id" });
    }

    const result = await bookCollections.findOne({ _id: new ObjectId(id) });
    return res.send(result);
  }

  const result = demoBooks.find((book) => book._id === id);
  if (!result) {
    return res.status(404).send({ message: "Book not found" });
  }

  res.send(result);
});

async function connectToMongoDB() {
  if (!uri) {
    console.log("MONGODB_URI is not set. Using in-memory demo data.");
    return;
  }

  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    bookCollections = client.db("BookInventory").collection("books");
    await client.db("admin").command({ ping: 1 });
    mongoConnected = true;
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Could not connect to MongoDB. Using in-memory demo data.");
    console.error(error.message);
  }
}

connectToMongoDB().finally(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Book Store API listening on port ${port}`);
  });
});
