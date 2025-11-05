import { useAuth } from '@/components/context/AuthContext';
import { icons } from '@/constants/icons';
import { getFavoriteMovies, removeFavoriteMovies, saveFavoriteMovies } from '@/lib/appwrite';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value}: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>
      {label}
    </Text>
    <Text className='text-light-100 font-bold text-sm mt-2'>
        {value || 'N/A'}
    </Text>
  </View>
)

const MovieDetails = () => {

  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const {data: movie, loading } = useFetch(() => fetchMovieDetails(id as string), true);
  
  // Pegar informação se o filme esta favoritado pelo usuário

  const [isSaved, setIsSaved] = useState(false); 
  const [loadingSaved, setLoadingSaved] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const checkIfSaved = async () => {
        if (!movie?.id) {
          setLoadingSaved(true);
          return;
        }

        setLoadingSaved(true);
        try {
          const response = await getFavoriteMovies(user?.$id as string, movie.id);
          setIsSaved(response.length > 0);
        } catch (error) {
          console.error('Erro ao verificar favorito:', error);
        } finally {
          setLoadingSaved(false);
        }
      }
  
      checkIfSaved();
    }, [movie?.id, user?.$id]) // ✅ Adicione user?.$id também
  );

  const handleFavoriteButton = async () => {
    if(isSaved){
      await removeFavoriteMovies(user?.$id as string, movie?.id as number);
    }else{
      await saveFavoriteMovies(user?.$id as string, movie as MovieDetails);
    }
      setIsSaved(!isSaved);
  }

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        <View>
          <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className='w-full h-[490px]' resizeMode='stretch'/>
        </View>

        <View className='flex-col items-start justify-center mt-5 px-5'>
          <View className='flex flex-row items-center justify-between w-full'>
            <Text className="text-white text-xl font-bold">{movie?.title}</Text>
            <TouchableOpacity 
              onPress={handleFavoriteButton} 
              disabled={loadingSaved}
              className='text-black text-sm font-bold p-1 bg-accent flex flex-row rounded-md items-center'
            >
              {loadingSaved ? (
                <ActivityIndicator size="small" color="#FFD700" />
              ) : (
                <>
                  <Image source={icons.save} className='size-4' tintColor="#FFD700"/>
                  <Text className='ml-1 text-white'>{isSaved ? 'Saved' : 'Save'}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View className='flex-row items-center justify-between gap-x-1 mt-2'>
            <Text className='text-lime-200 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-lime-200 text-sm'>{movie?.runtime}m</Text>
          </View>
          <View className='flex-row items-center bg-dark-100 rounded-full px-2 py-1 mt-2'>
            <Image source={icons.star} className='size-4' tintColor="#FFD700"/>
            <Text className='text-white text-sm ml-1 font-bold'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
            <Text className='text-light-200 text-sm ml-1'>({movie?.vote_count}) votes</Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview}/>
          <MovieInfo label="Genres" value={movie?.genres?.map(genre => genre.name).join(' - ')}/>
          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo label="Budget" value={movie?.budget ? `$${(movie?.budget / 1_000_000).toFixed(2)} millions` : 'N/A'}/>
            <MovieInfo label="Revenue" value={movie?.revenue ? `$${Math.round(movie?.revenue / 1_000_000)} millions` : 'N/A'}/>
          </View>
          <MovieInfo label="Production" value={movie?.production_companies?.map(company => company.name).join(' - ')}/>

        </View>
      </ScrollView>
      <TouchableOpacity className='absolute left-0 right-0 bottom-10 bg-accent rounded-lg py-2 mx-5 flex flex-row items-center justify-center z-50' onPress={router.back}>
        <Image source={icons.arrow} className='size-6 rotate-180' tintColor="#FFD700"/>
        <Text className='text-white text-sm font-bold'>Go back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails