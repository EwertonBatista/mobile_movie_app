import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { updateSearchCount } from '@/lib/appwrite'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, Image, Text, View } from 'react-native'

const Search = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const { 
    data: movies, 
    loading, 
    error,
    refetch: loadMovies,
    reset
  } = useFetch(
    () => fetchMovies({query: searchQuery}), 
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if(searchQuery.trim()) {
        await loadMovies();
        if(movies?.length > 0 && movies?.[0]){
          await updateSearchCount(searchQuery, movies[0]);        
        }
      }else{
        reset();
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  },[searchQuery]);

  useEffect(() => {
    if(movies?.length > 0 && movies?.[0]){
      updateSearchCount(searchQuery, movies[0]);
    }
  },[movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode='cover'/>

      <FlatList 
        data={movies} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({item}) => <MovieCard {...item} />}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center'>
              <Image source={icons.logo} className='w-12 h-10'/>
            </View>
            <View className=''>
              <SearchBar value={searchQuery} onChangeText={(text: string) => setSearchQuery(text)} placeholder="Search for a movie"/>
            </View>

            {loading && (
              <ActivityIndicator size="large" color="#0000ff" className="mt-3 self-center"/>
            )}

            {error && (
              <Text className="mt-3 text-red-600 text-center">Erro: {error.message}</Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (            
                <Text className="text-xl text-white font-bold">
                  Search results for{' '}              
                  <Text className='text-accent'>{searchQuery}</Text>
                </Text>
            )}

            {/* Debug buttons */}
            <View className='mb-5'>
              <Button title='logar dados' onPress={() => console.log(movies)}/>
            </View>
            <Button title="fazer fetch" onPress={() => loadMovies()}/>
          </>
        }
        ListEmptyComponent={
          <View className='mt-10 px-5'>
            {!loading && !error && searchQuery.trim() && movies?.length === 0 && (            
              <Text className="text-gray-500 text-center">No results found for {searchQuery}</Text>
            )}
          </View>
        }
      />
    </View>
  )
}

export default Search;