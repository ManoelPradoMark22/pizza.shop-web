import { render } from '@testing-library/react'

import { OrderStatus } from './order-status'

describe('Order Status', () => {
  it('should display the right text when order status is pending', () => {
    const wrapper = render(<OrderStatus status="pending" />)

    const statusText = wrapper.getByText('Pendente')
    // console.log(statusText.outerHTML)

    expect(statusText).toBeInTheDocument()
  })

  it('should have the right color in class when order status is pending', () => {
    const wrapper = render(<OrderStatus status="pending" />)

    const badgeElement = wrapper.getByTestId('badge')
    // console.log(badgeElement.outerHTML)

    expect(badgeElement).toHaveClass('bg-slate-400')
  })

  it('should display the right text when order status is processing', () => {
    const wrapper = render(<OrderStatus status="processing" />)

    const statusText = wrapper.getByText('Em preparo')
    // console.log(statusText.outerHTML)

    expect(statusText).toBeInTheDocument()
  })

  it('should have the right color in class when order status is processing', () => {
    const wrapper = render(<OrderStatus status="processing" />)

    const badgeElement = wrapper.getByTestId('badge')
    // console.log(badgeElement.outerHTML)

    expect(badgeElement).toHaveClass('bg-amber-500')
  })
  it('should display the right text when order status is delivering', () => {
    const wrapper = render(<OrderStatus status="delivering" />)

    const statusText = wrapper.getByText('Em entrega')
    // console.log(statusText.outerHTML)

    expect(statusText).toBeInTheDocument()
  })

  it('should have the right color in class when order status is delivering', () => {
    const wrapper = render(<OrderStatus status="delivering" />)

    const badgeElement = wrapper.getByTestId('badge')
    // console.log(badgeElement.outerHTML)

    expect(badgeElement).toHaveClass('bg-amber-500')
  })

  it('should display the right text when order status is delivered', () => {
    const wrapper = render(<OrderStatus status="delivered" />)

    const statusText = wrapper.getByText('Entregue')
    // console.log(statusText.outerHTML)

    expect(statusText).toBeInTheDocument()
  })

  it('should have the right color in class when order status is delivered', () => {
    const wrapper = render(<OrderStatus status="delivered" />)

    const badgeElement = wrapper.getByTestId('badge')
    // console.log(badgeElement.outerHTML)

    expect(badgeElement).toHaveClass('bg-emerald-500')
  })

  it('should display the right text when order status is canceled', () => {
    const wrapper = render(<OrderStatus status="canceled" />)

    const statusText = wrapper.getByText('Cancelado')
    // console.log(statusText.outerHTML)

    expect(statusText).toBeInTheDocument()
  })

  it('should have the right color in class when order status is canceled', () => {
    const wrapper = render(<OrderStatus status="canceled" />)

    const badgeElement = wrapper.getByTestId('badge')
    // console.log(badgeElement.outerHTML)

    expect(badgeElement).toHaveClass('bg-rose-500')
  })
})
