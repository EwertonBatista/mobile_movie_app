import { useAuth } from '@/components/context/AuthContext';
import MovieCard from '@/components/MovieCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getFavoriteMovies } from '@/lib/appwrite';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, View } from 'react-native';

const Saved = () => {

  const { user } = useAuth();

  const [data, setData] = useState([]);

useFocusEffect(
  useCallback(() => {
    const fetchSavedMovies = async () => {
      const response = await getFavoriteMovies(user?.$id as string);
      setData(response || []);
    }

    fetchSavedMovies();
  }, [user?.$id])
);

  return (
    <View className='flex-1 bg-primary'>
        {/* <View className='mb-20'> */}
          <View>
            <Image source={icons.logo} className='w-12 h-10 mt-20 mb-5 mx-auto z-1'/>
          </View>
          {/* <Text className='text-white font-bold text-xl text-center'>Favoritados</Text> */}
        {/* </View> */}
        <Image source={images.bg} className="absolute w-full z-0"/>
        
          <View className=''>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.$id}
              ItemSeparatorComponent={() => <View className="w-3" />}
              numColumns={3}
              columnWrapperStyle={{
                  justifyContent: 'flex-start',
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10
                }}
              renderItem={({ item }) => (                

                <MovieCard {...item} id={item.movie_id}/>

                // <Link href={`/movies/${item.movie_id}`} asChild>
                //   <TouchableOpacity className='flex-row items-center justify-center w-32 relative pl-5'>
                //     <View className='flex flex-col'>
                //       <Image source={{uri: item.poster_url}} className='w-32 h-48 rounded-lg' resizeMode='cover'/>
                //       <Text className='text-white text-lg font-bold' numberOfLines={1}>{item.title}</Text>
                //     </View>
                //   </TouchableOpacity>
                // </Link>
              )}
            />
          </View>
      {/* </View> */}
    </View>
  )
}

export default Saved