import { useState } from 'react';

import { Color } from './Color';
import { Config } from './Config';
import { parseColorFromRgbaString, parseColorFromRgbString } from './Parser';
import { ColorInput } from './types/ColorInput';
import { RgbaString, RgbString } from './types/rgb';
import { toRgbRange, toTwoDigitHex } from './utils/filters';

export const useColor = <Str extends string>(
  colorInput: ColorInput<Str>,
  config?: Config,
): [Color] => {
  const [color] = useState(() => {
    if (typeof colorInput === 'string') {
      if (colorInput.startsWith('rgba')) {
        // RgbaString
        return parseColorFromRgbaString(colorInput as RgbaString, config)
      }

      if (colorInput.startsWith('rgb')) {
        // RgbString
        return parseColorFromRgbString(colorInput as RgbString, config)
      }

      // TODO: HexString
      const hexString = colorInput.replace('#', '')
      let red: string, green: string, blue: string, alpha: string | undefined

      switch (hexString.length) {
        default:
          ;[red, green, blue] = hexString.split('').map(toTwoDigitHex)
          break
        case 4:
          ;[red, green, blue, alpha] = hexString.split('').map(toTwoDigitHex)
          break
        case 6:
          ;[red, green, blue] = [
            hexString.substring(0, 2),
            hexString.substring(2, 4),
            hexString.substring(4, 6),
          ].map(toTwoDigitHex)
          break
        case 8:
          ;[red, green, blue, alpha] = [
            hexString.substring(0, 2),
            hexString.substring(2, 4),
            hexString.substring(4, 6),
            hexString.substring(6, 8),
          ].map(toTwoDigitHex)
          break
      }

      return new Color(
        {
          r: parseInt(red, 16),
          g: parseInt(green, 16),
          b: parseInt(blue, 16),
          a: alpha //
            ? parseFloat((parseInt(alpha, 16) / 255).toFixed(2))
            : 1,
        },
        config,
      )
    }

    // RgbaObject
    return new Color(colorInput, config)
  })

  return [color]
}
