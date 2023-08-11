import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { IBootProps } from './types'

export const Boot: FC<IBootProps> = ({ hide }) => {
  return !hide ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Boot Module</Text>
    </View>
  ) : null
}
