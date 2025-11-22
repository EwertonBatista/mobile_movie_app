import { useAuth } from '@/components/context/AuthContext'
import { icons } from '@/constants/icons'
import { Link } from 'expo-router'
import React from 'react'
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const SignUp = () => {
  const { register } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const makeRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, name);
      // AuthGuard will handle redirect
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image source={icons.person} className='size-10'/>
        <Text className='text-white font-bold text-2xl'>Criar Conta</Text>
        
        <View className='flex flex-col gap-2 mt-5 w-full items-center'>
          <Text className='text-light-200 w-1/2'>Nome</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 w-1/2 text-white'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite seu nome'
            onChangeText={setName}
          />
        </View>

        <View className='flex flex-col gap-2 mt-5 w-full items-center'>
          <Text className='text-light-200 w-1/2'>Email</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 w-1/2 text-white'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite seu email'
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className='flex flex-col gap-2 mt-5 w-full items-center'>
          <Text className='text-light-200 w-1/2'>Senha</Text>
          <TextInput
            className='bg-dark-100 rounded-md p-2 w-1/2 text-white'
            placeholderTextColor='#A8B5DB'
            placeholder='Digite sua senha'
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          onPress={makeRegister} 
          className='bg-accent rounded-md p-2 mt-5 w-1/2 items-center'
          disabled={isSubmitting}
        >
          <Text className='text-white text-sm font-bold'>
            {isSubmitting ? 'Criando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row gap-2 mt-5">
            <Text className="text-light-200">Já tem uma conta?</Text>
            <Link href="/(auth)/login" className="text-accent font-bold">
                Faça Login
            </Link>
        </View>
      </View>
    </View>
  )
}

export default SignUp
