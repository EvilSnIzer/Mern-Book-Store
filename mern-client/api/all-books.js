const { getBooks, sendJson } = require("./_books");

module.exports = function handler(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 200, {});
  if (req.method !== "GET") return sendJson(res, 405, { message: "Method not allowed" });

  const { category } = req.query;
  const books = getBooks();
  const result = category ? books.filter((book) => book.category === category) : books;

  return sendJson(res, 200, result);
};
