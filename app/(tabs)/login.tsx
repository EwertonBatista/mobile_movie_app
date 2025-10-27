import { icons } from '@/constants/icons'
import { getCurrentUser, login } from '@/lib/appwrite'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Login = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image source={icons.person} className='size-10'/>
        <Text className='text-white font-bold text-2xl'>Login</Text>
        <View className='flex flex-row gap-2 mt-5'>
          <Text className='text-light-200'>Email</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 flex-1'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite seu email'
            onChangeText={setEmail}
          />
        </View>
        <View className='flex flex-row gap-2 mt-5'>
          <Text className='text-light-200'>Senha</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 flex-1'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite sua senha'
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity onPress={() => login(email, password)} className='bg-accent rounded-md p-2 mt-5'>
          <Text className='text-white text-sm font-bold'>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={getCurrentUser} className='bg-accent rounded-md p-2 mt-5'>
          <Text className='text-white text-sm font-bold'>Pegar usuario</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login