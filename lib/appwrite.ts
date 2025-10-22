import { Client, ID, Query, TablesDB } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

const databases = new TablesDB(client);

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
                poster_url: `http://image.tdb.org/t/p/w500${movie.poster_path}`,
                title: movie.title
            });

            console.log("Criado com sucesso");
        }
    }catch(err){
        console.error(err);
        throw err;
    }
}