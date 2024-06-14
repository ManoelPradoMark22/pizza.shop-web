import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Search, X } from 'lucide-react'
import { useState } from 'react'

import { cancelOrder } from '@/api/cancel-order'
import { IGetOrdersResponse, IOrder } from '@/api/get-orders'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { QUERY_KEYS } from '@/utils/constants'
import { currencyBRL, timeAgo } from '@/utils/functions'

import { OrderDetails } from './order-details'

export interface IOrderTableRow {
  order: IOrder
}

const { GET_ORDERS } = QUERY_KEYS

export function OrderTableRow({ order }: IOrderTableRow) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: cancelOrderFn } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: async (_data, { orderId }) => {
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
                status: 'canceled',
              }
            }

            return order
          }),
        })
      })
    },
  })

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
        <Button variant="outline" size="xs">
          <ArrowRight className="mr-2 h-3 w-3" />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          disabled={!['pending', 'processing'].includes(order.status)}
          onClick={() => cancelOrderFn({ orderId: order.orderId })}
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
