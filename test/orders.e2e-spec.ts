import { expect, test } from '@playwright/test'

test('list orders', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await expect(
    page.getByRole('cell', { name: 'customer-1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'customer-10', exact: true }),
  ).toBeVisible()

  await expect(page.getByText('Total de 60 itens')).toBeVisible()
})

test('navigate between all pagination buttons and list orders properly', async ({
  page,
}) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  await expect(page.getByText('Total de 60 itens')).toBeVisible()

  const firstPageBtn = page.getByRole('button', { name: 'Primeira página' })
  const previousPageBtn = page.getByRole('button', { name: 'Página anterior' })
  const nextPageBtn = page.getByRole('button', { name: 'Próxima página' })
  const lastPageBtn = page.getByRole('button', { name: 'Última página' })

  await expect(nextPageBtn).toBeEnabled()

  await expect(lastPageBtn).toBeEnabled()
  await expect(firstPageBtn).toBeDisabled()
  await expect(previousPageBtn).toBeDisabled()

  await nextPageBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('cell', { name: 'customer-11', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'customer-20', exact: true }),
  ).toBeVisible()

  await expect(lastPageBtn).toBeEnabled()

  await expect(nextPageBtn).toBeEnabled()
  await expect(firstPageBtn).toBeEnabled()
  await expect(previousPageBtn).toBeEnabled()

  await lastPageBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('cell', { name: 'customer-51', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'customer-60', exact: true }),
  ).toBeVisible()

  await expect(previousPageBtn).toBeEnabled()

  await expect(firstPageBtn).toBeEnabled()
  await expect(lastPageBtn).toBeDisabled()
  await expect(nextPageBtn).toBeDisabled()

  await previousPageBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('cell', { name: 'customer-41', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'customer-50', exact: true }),
  ).toBeVisible()

  await expect(firstPageBtn).toBeEnabled()

  await expect(previousPageBtn).toBeEnabled()
  await expect(lastPageBtn).toBeEnabled()
  await expect(nextPageBtn).toBeEnabled()

  await firstPageBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('cell', { name: 'customer-1', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('cell', { name: 'customer-10', exact: true }),
  ).toBeVisible()

  await expect(nextPageBtn).toBeEnabled()
  await expect(lastPageBtn).toBeEnabled()
  await expect(firstPageBtn).toBeDisabled()
  await expect(previousPageBtn).toBeDisabled()
})

test('filter by order id', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  const filterBtn = page.getByRole('button', { name: 'Filtrar resultados' })

  await page.getByPlaceholder('ID do pedido').fill('order-11')

  await filterBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(page.getByRole('cell', { name: 'order-11' })).toBeVisible()
})

test('filter by customer name', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  const filterBtn = page.getByRole('button', { name: 'Filtrar resultados' })

  await page.getByPlaceholder('Nome do cliente').fill('customer-22')

  await filterBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('cell', { name: 'customer-22', exact: true }),
  ).toBeVisible()
})

test('filter by status', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'networkidle' })

  const filterBtn = page.getByRole('button', { name: 'Filtrar resultados' })

  await page.getByRole('combobox').click()

  await expect(page.getByLabel('Pendente')).toBeVisible()

  await page.getByLabel('Pendente').click()

  await filterBtn.click()

  await page.waitForLoadState('networkidle')

  await expect(page.getByRole('cell', { name: 'pendente' })).toHaveCount(10)
})
