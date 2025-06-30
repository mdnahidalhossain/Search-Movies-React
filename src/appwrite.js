// appwrite.js

import { Client, Databases, ID, Query } from "appwrite";

// Load environment variables correctly
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


// Initialize Appwrite client
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

const database = new Databases(client);

export async function updateSearchCount(searchItem, movie) {
    try {
        // 1. Query for existing document with matching `searchItem`
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchItem', searchItem),
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            // 2. Update count if found
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                countMovieSearch: doc.countMovieSearch + 1,
            });

        } else {
            // 3. Create new document if none found

            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchItem,
                countMovieSearch: 1,
                movieposter_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                movie_id: movie.id,
            });
        }

    } catch (error) {
        console.error("Appwrite updateSearchCount error:", error);
    }
}

export async function getTrendingMovies() {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('countMovieSearch')
        ])

        return result.documents
    } catch (error) {
        console.error(error);
    }
}