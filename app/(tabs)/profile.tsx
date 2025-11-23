import { useAuth } from '@/components/context/AuthContext';
import MovieCard from '@/components/MovieCard';
import { avatars, getFavoriteMovies, updateUserAvatar, uploadFile } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { logout, user, refetchUser } = useAuth();
  const [savedMoviesCount, setSavedMoviesCount] = useState(0);
  const [recentMovies, setRecentMovies] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedMovies = async () => {
        if (user?.$id) {
          const response = await getFavoriteMovies(user.$id);
          setSavedMoviesCount(response?.length || 0);
          setRecentMovies(response?.slice(0, 5) || []);
        }
      }

      fetchSavedMovies();
    }, [user?.$id])
  );

  const makeLogout = async () => {
    await logout();
  }

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        try {
            const file = {
                uri: result.assets[0].uri,
                name: `avatar_${user?.$id}.jpg`,
                type: 'image/jpeg',
                size: result.assets[0].fileSize || 0,
            };

            const fileUrl = await uploadFile(file);
            
            if (fileUrl) {
                await updateUserAvatar(fileUrl.toString());
                await refetchUser();
                alert('Profile picture updated!');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to upload image');
        }
    }
  };

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <ScrollView className='flex-1' contentContainerStyle={{ paddingHorizontal: 24, marginTop: 40, paddingBottom: 40 }}>
        {/* Header */}
        <View className='flex flex-row items-center justify-center mb-10'>
            <Text className='text-white font-bold text-2xl'>My Profile</Text>
        </View>

        {/* User Info */}
        <View className='items-center mb-10'>
          <View className='relative'>
            <View className='w-24 h-24 rounded-full border-2 border-accent overflow-hidden mb-4 relative'>
              <Image 
                  source={{ uri: user?.prefs?.avatar || avatars.getInitials(user?.name).toString() }} 
                  className='w-full h-full'
                  resizeMode='cover'
              />
            </View>
            <TouchableOpacity 
                  onPress={handleImagePicker}
                  className='absolute bottom-6 -right-6 bg-accent p-1 rounded-full z-10'
              >
                  <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
          </View>
          <Text className='text-white font-bold text-xl mb-1'>{user?.name}</Text>
          <Text className='text-gray-400 text-sm'>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View className='flex-row justify-between bg-gray-800/50 p-6 rounded-2xl mb-8'>
            <View className='items-center flex-1'>
                <Text className='text-accent font-bold text-2xl mb-1'>{savedMoviesCount}</Text>
                <Text className='text-gray-400 text-sm'>Saved Movies</Text>
            </View>
            <View className='w-[1px] h-full bg-gray-700' />
             <View className='items-center flex-1'>
                <Text className='text-accent font-bold text-2xl mb-1'>2025</Text>
                <Text className='text-gray-400 text-sm'>Member Since</Text>
            </View>
        </View>

        {/* Recent Favorites */}
        {recentMovies.length > 0 && (
          <View className='mb-8'>
            <Text className='text-white font-bold text-lg mb-4'>Recent Favorites</Text>
            <FlatList
              data={recentMovies}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.$id}
              contentContainerStyle={{ gap: 16 }}
              renderItem={({ item }) => (
                <MovieCard 
                  {...item} 
                  id={item.movie_id} 
                  poster_path={item.poster_url} 
                  // Override container style for horizontal list
                  className="w-[120px]"
                />
              )}
            />
          </View>
        )}

        {/* Settings Menu */}
        <View className='mb-10'>
          <Text className='text-white font-bold text-lg mb-4'>Settings</Text>
          <View className='bg-gray-800/50 rounded-2xl overflow-hidden'>
            {[
              { icon: 'person-outline', label: 'Edit Profile' },
              { icon: 'notifications-outline', label: 'Notifications' },
              { icon: 'shield-checkmark-outline', label: 'Privacy Policy' },
              { icon: 'information-circle-outline', label: 'About App' },
            ].map((item, index) => (
              <TouchableOpacity 
                key={index}
                className={`flex-row items-center p-4 ${index !== 3 ? 'border-b border-gray-700' : ''}`}
              >
                <Ionicons name={item.icon as any} size={22} color="#9ca3af" />
                <Text className='text-white ml-3 flex-1'>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View className='mt-auto mb-36'>
            <TouchableOpacity 
                onPress={makeLogout} 
                className='flex-row items-center justify-center bg-transparent border border-red-500 p-4 rounded-xl active:bg-red-500/10'
            >
                <Ionicons name="log-out-outline" size={24} color="#ef4444" className="mr-2" />
                <Text className='text-red-500 font-bold text-lg'>Logout</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile