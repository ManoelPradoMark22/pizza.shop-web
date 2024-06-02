import colors from 'tailwindcss/colors'

type IPopularProductsChartData = {
  product: string
  amount: number
}

export const data: IPopularProductsChartData[] = [
  { product: 'Calabresa', amount: 59 },
  { product: 'Frango catupiry', amount: 40 },
  { product: 'Moda', amount: 23 },
  { product: 'Carne seca', amount: 102 },
  { product: 'Bacon cheddar', amount: 20 },
  { product: 'Marguerita', amount: 45 },
  { product: 'Atum', amount: 22 },
]

export const COLORS = [
  colors.sky['500'],
  colors.amber['500'],
  colors.violet['500'],
  colors.emerald['500'],
  colors.rose['500'],
]

export const QUERY_KEYS = {
  GET_PROFILE_KEY: ['get-profile'],
  GET_MANAGED_RESTAURANT_KEY: ['get-managed-restaurant'],
} as const
