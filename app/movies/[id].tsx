import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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

  const {data: movie, loading } = useFetch(() => fetchMovieDetails(id as string), true);

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        <View>
          <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className='w-full h-[490px]' resizeMode='stretch'/>
        </View>

        <View className='flex-col items-start justify-center mt-5 px-5'>
          <Text className="text-white text-xl w-full font-bold">{movie?.title}</Text>
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