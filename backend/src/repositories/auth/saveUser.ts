import { User } from '@models/userModel';
import getUsersCollection from './getUsersCollection';

const saveUser = async (user: User): Promise<User> => {
  const usersCollection = await getUsersCollection();
  const result = await usersCollection.insertOne(user);

  const savedUser = { _id: result.insertedId, ...user };
  return savedUser;
};

export default saveUser;
