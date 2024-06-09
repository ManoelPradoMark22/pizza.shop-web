import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { z } from 'zod'

export const parsedPageIndex = (page: string) => {
  const pageSchema = z.preprocess((arg) => {
    const str = typeof arg === 'string' ? arg : undefined
    const parsed = str ? parseInt(str, 10) : NaN
    return isNaN(parsed) ? undefined : parsed
  }, z.number().int().min(1).optional())

  const result = pageSchema.safeParse(page)
  return result.success ? result.data : undefined
}

export function currencyBRL(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function timeAgo(dateStr: string) {
  return formatDistanceToNow(dateStr, {
    locale: ptBR,
    addSuffix: true,
  })
}

export function generateRandomColorVariant(
  color: string,
  maxVariation: number,
) {
  // Converter cor hex para HSL
  const hslColor = hexToHSL(color)

  // Definir a variação máxima para H, S e L
  const maxHueVariation = maxVariation // Máximo de variação permitida para a matiz (0-360)
  const maxSaturationVariation = maxVariation // Máximo de variação permitida para a saturação (0-100)
  const maxLightnessVariation = maxVariation // Máximo de variação permitida para o brilho (0-100)

  // Gerar valores aleatórios de variação para H, S e L dentro dos limites definidos
  const hueVariation = getRandomInt(-maxHueVariation, maxHueVariation)
  const saturationVariation = getRandomInt(
    -maxSaturationVariation,
    maxSaturationVariation,
  )
  const lightnessVariation = getRandomInt(
    -maxLightnessVariation,
    maxLightnessVariation,
  )

  // Aplicar variações aos componentes HSL, garantindo que permaneçam dentro dos limites válidos
  const newHue = (hslColor.h + hueVariation + 360) % 360 // Manter o valor de H dentro de 0-360
  const newSaturation = clamp(hslColor.s + saturationVariation, 0, 100) // Manter o valor de S dentro de 0-100
  const newLightness = clamp(hslColor.l + lightnessVariation, 0, 100) // Manter o valor de L dentro de 0-100

  // Converter a nova cor HSL de volta para hex
  const newHexColor = HSLToHex(newHue, newSaturation, newLightness)

  return newHexColor
}

function hexToHSL(hex: string) {
  // Remover o "#" da string hex
  hex = hex.substring(1)

  // Converter os valores hex para RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Calcular os valores máximos e mínimos de RGB
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h, s, l

  // Calcular o valor da matiz
  if (max === min) {
    h = 0 // A cor é acinzentada
  } else if (max === r) {
    h = 60 * ((g - b) / (max - min)) + 360
  } else if (max === g) {
    h = 60 * ((b - r) / (max - min)) + 120
  } else {
    h = 60 * ((r - g) / (max - min)) + 240
  }

  // Calcular o valor de luminosidade (Lightness)
  l = (max + min) / 2

  // Calcular o valor de saturação
  if (max === min) {
    s = 0
  } else if (l <= 0.5) {
    s = (max - min) / (2 * l)
  } else {
    s = (max - min) / (2 - 2 * l)
  }

  // Converter a matiz para um número inteiro
  h = Math.round(h)
  // Converter a saturação e a luminosidade para porcentagens
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return { h, s, l }
}

function HSLToHex(h: number, s: number, l: number) {
  // Converter a matiz para um valor entre 0 e 360
  h %= 360
  // Converter a saturação e a luminosidade para valores entre 0 e 1
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    // Se a saturação for 0, a cor é acinzentada
    r = g = b = l
  } else {
    const hueToRGB = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRGB(p, q, h / 360 + 1 / 3)
    g = hueToRGB(p, q, h / 360)
    b = hueToRGB(p, q, h / 360 - 1 / 3)
  }

  // Converter os valores de RGB para valores inteiros entre 0 e 255
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  // Converter os valores de RGB para hex
  const red = toHex(r)
  const green = toHex(g)
  const blue = toHex(b)

  return `#${red}${green}${blue}`
}

// Função para gerar um número inteiro aleatório dentro de um intervalo
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Função para garantir que um valor esteja dentro de um intervalo
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
