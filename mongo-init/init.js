db = db.getSiblingDB('test-db');

db.users.insertOne({
  email: "test@test.com",
  passwordHash: "$2b$10$euSq660DoJNQZAQ9TdX1gOBHw8bee1QFGxp3GFE8HrqEIfeW6FvvC"
});