import { IValideName } from '../../../src/Validators'

export const SCREEN_FILE = (data: IValideName) => `import React from 'react'
import { observer } from 'mobx-react'
import { Text, View } from 'react-native'

export const ${data.folderName} = observer(() => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>${data.folderName}</Text>
    </View>
  )
})
`
