import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Search, X } from 'lucide-react'
import { useState } from 'react'

import { IGetOrderDetailsResponse } from '@/api/get-order-details'
import { IGetOrdersResponse, IOrder, IOrderStatus } from '@/api/get-orders'
import { updateStatusOrder } from '@/api/update-status-order'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { QUERY_KEYS } from '@/utils/constants'
import {
  currencyBRL,
  returnChangeStatusOptions,
  timeAgo,
} from '@/utils/functions'

import { OrderDetails } from './order-details'

export interface IOrderTableRow {
  order: IOrder
}

export interface IUpdateOrderStatusOnCache {
  orderId: string
  status: IOrderStatus
}

const { GET_ORDERS, GET_ORDER_DETAILS } = QUERY_KEYS

export function OrderTableRow({ order }: IOrderTableRow) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const queryClient = useQueryClient()

  function updateOrderStatusOnCache({
    orderId,
    status,
  }: IUpdateOrderStatusOnCache) {
    const ordersListCache = queryClient.getQueriesData<IGetOrdersResponse>({
      queryKey: [GET_ORDERS],
    })

    ordersListCache.forEach(([cacheKey, cachedData]) => {
      if (!cachedData) {
        return
      }

      queryClient.setQueryData<IGetOrdersResponse>(cacheKey, {
        ...cachedData,
        orders: cachedData.orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status,
            }
          }

          return order
        }),
      })

      const orderDetailsCache =
        queryClient.getQueryData<IGetOrderDetailsResponse>([
          GET_ORDER_DETAILS,
          orderId,
        ])

      if (orderDetailsCache) {
        queryClient.setQueryData<IGetOrderDetailsResponse>(
          [GET_ORDER_DETAILS, orderId],
          {
            ...orderDetailsCache,
            status,
          },
        )
      }
    })
  }

  const { mutateAsync: updateStatusOrderFn, isPending: isUpdatingStatusOrder } =
    useMutation({
      mutationFn: updateStatusOrder,
      onSuccess: async (_data, { orderId, changeStatusOptions }) => {
        updateOrderStatusOnCache({
          orderId,
          status: changeStatusOptions.newStatus,
        })
      },
    })

  const isNotPendingOrProcessing = !['pending', 'processing'].includes(
    order.status,
  )

  const isNotCanceledOrDelivered = !['canceled', 'delivered'].includes(
    order.status,
  )

  const changeStatusOptions = returnChangeStatusOptions(order.status)

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>

          <OrderDetails orderId={order.orderId} isOpen={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {timeAgo(order.createdAt)}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="font-medium">
        {currencyBRL(order.total / 100)}
      </TableCell>
      <TableCell>
        {isNotCanceledOrDelivered && (
          <Button
            variant="outline"
            size="xs"
            disabled={isUpdatingStatusOrder}
            onClick={() =>
              updateStatusOrderFn({
                orderId: order.orderId,
                changeStatusOptions,
              })
            }
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            {changeStatusOptions.label}
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          disabled={isUpdatingStatusOrder || isNotPendingOrProcessing}
          onClick={() =>
            updateStatusOrderFn({
              orderId: order.orderId,
              changeStatusOptions: returnChangeStatusOptions('canceled'),
            })
          }
          variant="ghost"
          size="xs"
        >
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
