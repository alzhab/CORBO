import { ITemplateProps } from '../../../src/types'

export const COMPONENT_FILE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import React from 'react'
import { Text, View } from 'react-native'
import { CompProps } from 'types/component.types'
import { I${folderName}Props } from './types'

export const ${folderName}: CompProps<I${folderName}Props>  = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>${folderName}</Text>
    </View>
  )
}
`

export const COMPONENT_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
`

export const COMPONENT_TYPE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export interface I${folderName}Props {}
`
