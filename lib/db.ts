import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  const client = MongoClient.connect(
    "mongodb+srv://khaiztervashh:aeoxVl1dGTtdvrVU@next-auth-cluster.guyh294.mongodb.net/project-anime-db?retryWrites=true&w=majority&appName=next-auth-cluster"
  );

  return client;
};
