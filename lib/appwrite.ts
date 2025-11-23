import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Avatars, Client, ID, Query, Storage, TablesDB } from 'react-native-appwrite';



export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

export const databases = new TablesDB(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

const SESSION_KEY = "@appwrite_session_user";

export async function register(email: string, password: string, name: string) {
    const user = await account.create("unique()", email, password, name);
    return user;
}

export async function login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    if (user) {
        console.log(user);
    } else {
        console.log('no user');
    }
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
}

export async function logout() {
    try {
        await account.deleteSession("current");
    } catch (error) {
        console.error("Error deleting session:", error);
    } finally {
        await AsyncStorage.removeItem(SESSION_KEY);
    }
}

export async function getCurrentUser() {
    try {
        const user = await account.get();
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
    } catch (err: any) {
        if (err.code === 401) {
            await AsyncStorage.removeItem(SESSION_KEY);
            return null;
        }

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

        if (result.rows.length > 0) {
            const existingMovie = result.rows[0];
            await databases.updateRow(process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_NAME!, existingMovie.$id, {
                count: existingMovie.count + 1
            });
        } else {
            await databases.createRow(process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, process.env.EXPO_PUBLIC_APPWRITE_DATABASE_TABLE_NAME!, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                poster_url: `http://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title
            });

        }
    } catch (err) {
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
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

export const getFavoriteMovies = async (userId: string, movieId?: string | number): Promise<MovieDetails[] | undefined> => {
    try {
        const result = await databases.listRows(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "favorite_movies",
            [
                Query.equal('user_id', userId),
                movieId ? Query.equal('movie_id', movieId) : Query.isNotNull('movie_id'),
                Query.orderDesc('$createdAt')
            ]
        );

        return result.rows as unknown as MovieDetails[];
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

export const saveFavoriteMovies = async (userId: string, movie: MovieDetails) => {
    console.log("Detalhes do filme", movie);
    try {
        await databases.createRow(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "favorite_movies",
            ID.unique(),
            {
                user_id: userId,
                movie_id: movie.id,
                poster_url: `http://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title,
                release_date: movie.release_date,
                vote_average: String(movie.vote_average)
            }
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const removeFavoriteMovies = async (userId: string, movieId: number) => {
    try {
        const result = await databases.listRows(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "favorite_movies",
            [
                Query.equal('user_id', userId),
                Query.equal('movie_id', movieId)
            ]
        );

        if (result.rows.length > 0) {
            await databases.deleteRow(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                "favorite_movies",
                result.rows[0].$id
            );
            return true;
        } else {
            console.log("Nenhum filme encontrado com o ID fornecido na lista de favoritos do usuário.");
            return false;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const uploadFile = async (file: { uri: string; name: string; type: string; size: number }) => {
    if (!file) return;

    if (!file) return;

    try {
        const uploadedFile = await storage.createFile(
            process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID!,
            ID.unique(),
            file
        );

        const fileUrl = `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID}/files/${uploadedFile.$id}/view?project=${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`;

        return fileUrl;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export const updateUserAvatar = async (avatarUrl: string) => {
    try {
        await account.updatePrefs({ avatar: avatarUrl });
        return true;
    } catch (error) {
        console.error("Error updating user avatar:", error);
        throw error;
    }
}