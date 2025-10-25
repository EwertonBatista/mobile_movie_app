import { images } from '@/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const TrendingCard = ({movie: { movie_id, title, poster_url}, index}: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity className='w-32 relative pl-5'>
        <Image source={{uri: poster_url}} className='w-32 h-48 rounded-lg' resizeMode='cover'/>

        <View className='absolute bottom-1 left-2 mb-4'>
          <MaskedView maskElement={
            <Text className='text-gray-400 font-bold text-5xl'>{index + 1}</Text>
          }>
            <Image source={images.rankingGradient} className='size-14' resizeMode='cover'/>
          </MaskedView>
        </View>

        <View className='mt-2'>
          <Text className='text-sm font-bold text-light-200' numberOfLines={1}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default TrendingCard