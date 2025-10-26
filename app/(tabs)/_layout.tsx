import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'

const TabIcon = ({ focused, icon, title }: { focused: boolean, icon: typeof Image['source'], title: string }) => {
    if(focused){
        return (
            <>
                <ImageBackground source={images.highlight} className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-6 justify-center items-center rounded-full overflow-hidden">
                    <Image source={icon} tintColor="#151312" className='size-6'/>
                    <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
                </ImageBackground>
            </>
        )
    }
    return (
      <View className='size-full justify-center items-center mt-[45px] rounded-full'>
        <Image source={icon} tintColor="#A8B5DB" className="size-5" />
        <Text className='text-secondary text-base font-semibold ml-2'></Text>
      </View>
    )
}

const _Layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {width: '70%', height: '10%', justifyContent: 'center', alignItems: 'center'},
        tabBarStyle: {backgroundColor: '#0f0D23', borderRadius: 10, marginHorizontal: 20, marginBottom: 50, height: 52, position: 'absolute', overflow: 'hidden', borderWidth: 1, borderColor: '#0f0D23'},
      }}>
      <Tabs.Screen name="index" options={{ headerShown: false, title: 'Home', tabBarIcon: ({focused}) => (<TabIcon focused={focused} icon={icons.home} title="Home" />) }} />
      <Tabs.Screen name="search" options={{ headerShown: false, title: 'Search', tabBarIcon: ({focused}) => (<TabIcon focused={focused} icon={icons.search} title="Search"/>) }} />
      <Tabs.Screen name="saved" options={{ headerShown: false, title: 'Saved', tabBarIcon: ({focused}) => (<TabIcon focused={focused} icon={icons.save} title="Saved"/>) }} />
      <Tabs.Screen name="profile" options={{ headerShown: false, title: 'Profile', tabBarIcon: ({focused}) => (<TabIcon focused={focused} icon={icons.person} title="Profile"/>) }} />
    </Tabs>
  )
}

export default _Layout