import { useMemo } from 'react'

export const useIconSizes = ({
  baseWidth,
  baseHeight,
  size,
  sizeType,
}: {
  baseWidth: number
  baseHeight: number
  size?: number
  sizeType?: 'width' | 'height'
}) => {
  const width: number = useMemo(() => {
    if (size) {
      if (sizeType === 'height') {
        return (baseWidth * size) / baseHeight
      } else {
        return size
      }
    } else {
      return baseWidth
    }
  }, [size, baseWidth, baseHeight, sizeType])

  const height: number = useMemo(() => {
    if (size) {
      if (sizeType === 'width') {
        return (baseHeight * size) / baseWidth
      } else {
        return size
      }
    } else {
      return baseHeight
    }
  }, [size, baseWidth, baseHeight, sizeType])

  return { width, height }
}
