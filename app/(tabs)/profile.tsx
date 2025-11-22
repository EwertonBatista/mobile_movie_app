import { useAuth } from '@/components/context/AuthContext'
import { icons } from '@/constants/icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const Profile = () => {
  const { logout } = useAuth();

  const makeLogout = async () => {
    await logout();
    // AuthGuard will handle redirect
  }

  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image source={icons.person} className='size-10'/>
        <Text className='text-white font-bold text-2xl'>Profile</Text>
        <TouchableOpacity onPress={makeLogout} className='p-2 bg-accent rounded-md'>
          <Text className='text-white font-bold'>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile