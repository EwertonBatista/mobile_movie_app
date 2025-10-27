export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIEDB_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIEDB_API_KEY}`,
    }
}


export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();

  return Array.isArray(data.results) ? data.results : [];
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try{
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  
    const data = await response.json();
  
    return data;
  }catch(err){
    console.error(err);
    throw err;
  }
}

export const fetchFavoriteMovies = async (userId: string) => {
  try{
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/account/${userId}/favorite/movies?api_key=${TMDB_CONFIG.API_KEY}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  
    const data = await response.json();
  
    return data;
  }catch(err){
    console.error(err);
    throw err;
  }
}