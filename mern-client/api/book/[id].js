const { getBooks, sendJson } = require("../_books");

module.exports = function handler(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 200, {});

  const { id } = req.query;
  const books = getBooks();
  const index = books.findIndex((book) => book._id === id);

  if (req.method === "GET") {
    if (index === -1) return sendJson(res, 404, { message: "Book not found" });
    return sendJson(res, 200, books[index]);
  }

  if (req.method === "PATCH") {
    if (index === -1) return sendJson(res, 404, { message: "Book not found" });
    books[index] = { ...books[index], ...req.body };
    return sendJson(res, 200, { acknowledged: true, modifiedCount: 1 });
  }

  if (req.method === "DELETE") {
    if (index === -1) return sendJson(res, 404, { message: "Book not found" });
    books.splice(index, 1);
    return sendJson(res, 200, { acknowledged: true, deletedCount: 1 });
  }

  return sendJson(res, 405, { message: "Method not allowed" });
};
