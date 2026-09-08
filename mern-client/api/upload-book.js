const { getBooks, sendJson } = require("./_books");

module.exports = function handler(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 200, {});
  if (req.method !== "POST") return sendJson(res, 405, { message: "Method not allowed" });

  const insertedBook = { ...req.body, _id: `demo-${Date.now()}` };
  getBooks().push(insertedBook);

  return sendJson(res, 200, { acknowledged: true, insertedId: insertedBook._id });
};
