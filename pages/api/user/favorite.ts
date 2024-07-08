import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const methodPatch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { animeId, remove } = body;
  // get session
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" });
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

  var favorites = user.favorites || [];
  // remove logic
  if (remove) {
    favorites = favorites.filter((favorite: string) => animeId !== favorite);
  }
  // add logic
  else {
    if (!favorites.includes(animeId)) {
      favorites.push(animeId);
    }
  }

  // update favorites
  const result = await db
    .collection("users")
    .updateOne({ username: user.username }, { $set: { favorites: favorites } });

  // send 200 code
  client.close();
  return res.status(200).json({ message: "Favorites updated!" });
};

const methodGet = async (req: NextApiRequest, res: NextApiResponse) => {
  // get session
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" });
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

  var favorites = user.favorites || [];

  client.close();
  return res
    .status(200)
    .json({ message: "Fetched successfully!", data: favorites });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    return methodPatch(req, res);
  } else if (req.method === "GET") {
    return methodGet(req, res);
  } else {
    return res.status(400).json({ message: "Invalid method!" });
  }

  methodPatch(req, res);
};

export default handler;
