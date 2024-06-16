import { useQuery } from '@tanstack/react-query'

import { getOrderDetails } from '@/api/get-order-details'
import { DataStatus } from '@/components/data-status'
import { OrderStatus } from '@/components/order-status'
import { OrderDetailsSkeleton } from '@/components/skeletons/order-details-skeleton'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { QUERY_KEYS } from '@/utils/constants'
import { currencyBRL, timeAgo } from '@/utils/functions'

export interface OrderDetailsProps {
  orderId: string
  isOpen: boolean
}

const { GET_ORDER_DETAILS } = QUERY_KEYS

export function OrderDetails({ orderId, isOpen }: OrderDetailsProps) {
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [GET_ORDER_DETAILS, orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: isOpen,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  const reFetchOrderDetails = () => {
    refetch()
  }

  const isLoadingOrderDetails = isLoading && !isError

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pedido: {orderId}</DialogTitle>
        <DialogDescription>Detalhes do pedido</DialogDescription>
      </DialogHeader>

      {isLoadingOrderDetails ? (
        <OrderDetailsSkeleton />
      ) : !order ? (
        <div className="flex items-center justify-center">
          <DataStatus type="error" size={35} refetch={reFetchOrderDetails} />
        </div>
      ) : (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foregroud">Status</TableCell>
                <TableCell className="flex justify-end">
                  <OrderStatus status={order.status} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foregroud">Cliente</TableCell>
                <TableCell className="flex justify-end">
                  {order.customer.name}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foregroud">Telefone</TableCell>
                <TableCell className="flex justify-end">
                  {order.customer.phone ?? 'Não informado'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foregroud">E-mail</TableCell>
                <TableCell className="flex justify-end">
                  {order.customer.email}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foregroud">
                  Realizado há
                </TableCell>
                <TableCell className="flex justify-end">
                  {timeAgo(order.createdAt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Qtd.</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyBRL(item.priceInCents / 100)}
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyBRL((item.priceInCents * item.quantity) / 100)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total do pedido</TableCell>
                <TableCell className="text-right font-medium">
                  {currencyBRL(order.totalInCents / 100)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </DialogContent>
  )
}
