import bcrypt from "bcryptjs";

const password = "yosia123";

bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
