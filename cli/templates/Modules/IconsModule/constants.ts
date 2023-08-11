import { IIconTemplateProps } from '../../../src/types'

export const ICON_COMPONENT_FILE_TEMPLATE: (
  data: IIconTemplateProps,
) => string = (data: IIconTemplateProps) => `import React, { FC } from 'react'
import { ${data.imports.join(', ')} } from 'react-native-svg'
import { IIconProps, baseIcon } from '@alzhan/rncore-icons-module'
import { Spacings } from '@alzhan/rncore-spacing-props-module'

export const ${data.name}: FC<IIconProps & Spacings> = baseIcon(
  props => (
    <>
     ${data.svg}
    </>
  ),
  ${data.baseWidth},
  ${data.baseHeight},
)
`
