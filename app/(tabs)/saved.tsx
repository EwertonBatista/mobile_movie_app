import { useAuth } from '@/components/context/AuthContext';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getFavoriteMovies } from '@/lib/appwrite';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
          <Text className='text-white font-bold text-xl text-center'>Favoritados</Text>
        {/* </View> */}
        <Image source={images.bg} className="absolute w-full z-0"/>
        <ScrollView className='flex-1' contentContainerStyle={{paddingBottom: 80, minHeight: '100%'}}>
          <View className=''>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item) => item.$id}
              renderItem={({ item }) => (
                <Link href={`/movies/${item.movie_id}`} asChild>
                  <TouchableOpacity className='flex-row items-center justify-center w-32 relative pl-5'>
                    <Text className='text-white text-lg font-bold p-2 mr-2 bg-green-300 rounded-lg'>{item.title}</Text>
                  </TouchableOpacity>
                </Link>
              )}
            />
          </View>
        </ScrollView>
      {/* </View> */}
    </View>
  )
}

export default Saved