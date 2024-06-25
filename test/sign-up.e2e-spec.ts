import { expect, test } from '@playwright/test'

test('sign up successfully', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByLabel('Nome do estabelecimento').fill('Sorveteria Chaplin')

  await page.getByLabel('Seu nome').fill('Manoel Prado')

  await page.getByLabel('Seu e-mail').fill('manoelprado.aecjr@gmail.com')

  await page.getByLabel('Seu celular').fill('31933332222')

  await page.getByRole('button', { name: 'Finalizar cadastro' }).click()

  await page.waitForLoadState('networkidle')

  const toast = page.getByText('Restaurante cadastrado com sucesso')

  await expect(toast).toBeVisible()
})

test('sign up with wrong credentials', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByLabel('Nome do estabelecimento').fill('Invalid Name')

  await page.getByLabel('Seu nome').fill('Manoel Prado')

  await page.getByLabel('Seu e-mail').fill('manoelprado.aecjr@gmail.com')

  await page.getByLabel('Seu celular').fill('31933332222')

  await page.getByRole('button', { name: 'Finalizar cadastro' }).click()

  await page.waitForLoadState('networkidle')

  const toast = page.getByText('Erro ao cadastrar restaurante')

  await expect(toast).toBeVisible()
})

test('navigate to login page', async ({ page }) => {
  await page.goto('/sign-up', { waitUntil: 'networkidle' })

  await page.getByRole('link', { name: 'Fazer login' }).click()

  await page.waitForLoadState('networkidle')

  expect(page.url()).toContain('sign-in')
})
