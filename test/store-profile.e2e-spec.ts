import { expect, test } from '@playwright/test'

test('update profile successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })

  const accountMenuBtn = page.getByTestId('account-menu-btn')

  await accountMenuBtn.click()

  const updateProfileBtn = page.getByTestId('update-profile-btn')
  await expect(updateProfileBtn).toBeVisible()
  await updateProfileBtn.click()

  const modalUpdateProfile = page.getByLabel('Perfil da loja')
  await expect(modalUpdateProfile).toBeVisible()

  const storePizzaName = 'Pizza Shop'

  await page.getByLabel('Nome').fill(storePizzaName)

  await page.getByLabel('Descrição').fill('The best pizza ever!')

  const saveBtn = page.getByRole('button', { name: 'Salvar' })
  await expect(saveBtn).toBeEnabled()
  await saveBtn.click()

  await page.waitForLoadState('networkidle')

  const toast = page.getByText('Perfil atualizado com sucesso!')
  await expect(toast).toBeVisible()

  await expect(accountMenuBtn).toHaveText(storePizzaName)
})
