import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid method!" });
  }

  const { body } = req;
  const { username, password, confirmPassword } = body;

  // validation

  // username a-zA-Z0-9_
  const regex = /^\w+$/;
  if (!regex.test(username)) {
    return res.status(422).json({ message: "Invalid Username format!" });
  }
  // password greater or equal 6
  if (password.length < 6) {
    return res.status(422).json({ message: "Invalid Password format!" });
  }
  // confirmPassword must equal to password
  if (confirmPassword !== password) {
    return res.status(422).json({ message: "Confirm password doesn't match!" });
  }

  // database connection
  const client = await connectToDatabase();
  const db = client.db();

  // check for existing username
  const existingUser = await db
    .collection("users")
    .findOne({ username: username });

  if (existingUser) {
    client.close();
    return res.status(422).json({
      message: "Username exist already!",
    });
  }

  // hash password

  const hashedPassword = await hashPassword(password);

  // insert user

  const result = await db.collection("users").insertOne({
    username: username,
    password: hashedPassword,
  });

  client.close();

  // send 201 code
  return res.status(201).json({ message: "Created user!" });
};

export default handler;
