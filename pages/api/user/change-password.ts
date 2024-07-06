import { hashPassword, verifiyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(400).json({ message: "Invalid method!" });
  }

  const { body } = req;
  const { oldPassword, newPassword, confirmPassword } = body;

  // get session
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" });
  }
  // validation
  // newPassword greater or equal 6
  if (newPassword.length < 6) {
    return res.status(422).json({ message: "Invalid Password format!" });
  }

  // confirm password must equal to password
  if (confirmPassword !== newPassword) {
    return res.status(422).json({ message: "Confirm password doesn't match!" });
  }

  // database connect
  const client = await connectToDatabase();
  const db = client.db();

  // check for user
  const user = await db
    .collection("users")
    .findOne({ username: session?.user?.name });
  if (!user) {
    client.close();
    return res.status(404).json({ message: "No user found!" });
  }

  // check if old password match
  const isValid = await verifiyPassword(oldPassword, user.password);
  if (!isValid) {
    client.close();
    return res.status(422).json({ message: "Invalid password" });
  }

  // hash password
  const hashedPassword = await hashPassword(newPassword);

  // update user password
  const result = await db
    .collection("users")
    .updateOne(
      { username: user.username },
      { $set: { password: hashedPassword } }
    );

  // send 200 code
  client.close();
  return res.status(200).json({ message: "Password updated!" });
};

export default handler;
