import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Client, ID, Query, Storage, TablesDB } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

const databases = new TablesDB(client);
const account = new Account(client);
const storage = new Storage(client);

const SESSION_KEY = "@appwrite_session_user";

export async function register(email: string, password: string, name: string) {
  const user = await account.create("unique()", email, password, name);
  return user;
}

export async function login(email: string, password: string) {
  await account.createEmailPasswordSession(email, password);
  const user = await account.get();
  if(user){
    console.log(user);
  }else{
    console.log('no user');
  }
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function logout() {
  try {
    await account.deleteSession("current");
  } finally {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    console.log("Usuário logado: ", user);
    return user;
  } catch (err) {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

export const updateSearchCount = async (query: string, movie: Movie) => {

    try {
        const result = await databases.listRows(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, 
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_NAME!, 
            [
                Query.equal('searchTerm', query)
            ]
        );

        if(result.rows.length > 0){
            const existingMovie = result.rows[0];
            await databases.updateRow(process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_NAME!, existingMovie.$id, {
                count: existingMovie.count + 1
            });
        }else{
            await databases.createRow(process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_NAME!, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                poster_url: `http://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title
            });

        }
    }catch(err){
        console.error(err);
        throw err;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await databases.listRows(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, 
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_NAME!, 
            [
                Query.limit(5),
                Query.orderDesc('count')
            ]
        );

        return result.rows as unknown as TrendingMovie[];
    }catch(err){
        console.error(err);
        return undefined;
    }
}

export const getFavoriteMovies = async (userId: string): Promise<Movie[] | undefined> => {
    try {
        const result = await databases.listRows(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, 
            "favorite_movies",
            [
                Query.equal('user_id', userId)
            ]
        );

        return result.rows as unknown as Movie[];
    }catch(err){
        console.error(err);
        return undefined;
    }
}

export const saveFavoriteMovies = async (userId: string, movie: MovieDetails) => {
    console.log(userId);
    try {
        await databases.createRow(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, 
            "favorite_movies",
            ID.unique(),
            {
                user_id: 1,
                movie_id: movie.id,
                poster_url: `http://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title
            }
        );
    }catch(err){
        console.error(err);
        throw err;
    }
}