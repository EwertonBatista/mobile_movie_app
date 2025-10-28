import { icons } from '@/constants/icons'
import { login } from '@/lib/appwrite'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Login = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const makeLogin = async () => {
    let res = await login(email, password);
    if(res){
      router.push('/(tabs)');
    }
  }

  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image source={icons.person} className='size-10'/>
        <Text className='text-white font-bold text-2xl'>Login</Text>
        <View className='flex flex-col gap-2 mt-5 w-full items-center'>
          <Text className='text-light-200 w-1/2'>Email</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 w-1/2'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite seu email'
            onChangeText={setEmail}
          />
        </View>
        <View className='flex flex-col gap-2 mt-5 w-full items-center'>
          <Text className='text-light-200 w-1/2'>Senha</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 w-1/2'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite sua senha'
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity onPress={makeLogin} className='bg-accent rounded-md p-2 mt-5'>
          <Text className='text-white text-sm font-bold'>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login