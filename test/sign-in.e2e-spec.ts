import { expect, test } from '@playwright/test'

test('sign in successfully', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' }) // aguarde tds as requisicoes do JS finalizarem

  await page.getByLabel('Seu e-mail').fill('manoelprado.aecjr@gmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()

  await page.waitForLoadState('networkidle')

  const toast = page.getByText(
    'Enviamos um link de autenticação para o seu e-mail.',
  )

  await expect(toast).toBeVisible()
})

test('sign in with wrong credentials', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page.getByLabel('Seu e-mail').fill('wrong@gmail.com')

  await page.getByRole('button', { name: 'Acessar painel' }).click()

  await page.waitForLoadState('networkidle')

  const toast = page.getByText('Credenciais inválidas')

  await expect(toast).toBeVisible()
})

test('navigate to new restaurant page', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'networkidle' })

  await page.getByRole('link', { name: 'Novo estabelecimento' }).click()

  expect(page.url()).toContain('sign-up')
})
