import { hash } from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

hash(password, 10)
  .then((passwordHash) => {
    console.log(passwordHash);
  })
  .catch((error) => {
    console.error("Could not hash the password.", error);
    process.exit(1);
  });
