const bcrypt = require("bcrypt");

async function run() {
  const password = "password123"; // cambia qui
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  console.log("Password:", password);
  console.log("Hash:", hash);
}

run();