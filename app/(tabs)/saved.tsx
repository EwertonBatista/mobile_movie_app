import { images } from '@/constants/images'
import React from 'react'
import { FlatList, Image, ScrollView, Text, View } from 'react-native'

const Saved = () => {

  const data = Array.from({ length: 100 }).map((_, i) => `Item ${i + 1}`)

  return (
    <View className='bg-primary flex-1'>
        <Image source={images.bg} className="absolute w-full z-0"/>
        <ScrollView className='flex-1' contentContainerStyle={{paddingBottom: 80, minHeight: '100%'}}>
          <View className=''>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <Text key={index} className='text-white text-lg font-bold p-2 mr-2 bg-green-300 rounded-lg'>{item}</Text>
              )}
            />
          </View>
        </ScrollView>
      {/* </View> */}
    </View>
  )
}

export default Saved