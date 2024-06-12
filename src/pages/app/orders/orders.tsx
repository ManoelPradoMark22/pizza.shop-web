import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getOrders } from '@/api/get-orders'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { QUERY_KEYS } from '@/utils/constants'
import { parsedPageIndex } from '@/utils/functions'

import { OrderTableFilters } from './order-table-filters'
import { OrderTableRow } from './order-table-row'

const { GET_ORDERS } = QUERY_KEYS

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filterParams = {
    orderId: searchParams.get('orderId') ?? '',
    customerName: searchParams.get('customerName') ?? '',
    status: searchParams.get('status') ?? 'all',
  }

  const pageParam = searchParams.get('page') ?? '1'

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(parsedPageIndex(pageParam) ?? 1)

  const { data: result } = useQuery({
    queryKey: [
      GET_ORDERS,
      pageIndex,
      filterParams.orderId,
      filterParams.customerName,
      filterParams.status,
    ],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId: filterParams.orderId,
        customerName: filterParams.customerName,
        status: filterParams.status === 'all' ? null : filterParams.status,
      }),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (pageIndex + 1).toString())
      return state
    })
  }

  return (
    <>
      <Helmet title="Pedidos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>

        <div className="space-y-2.5">
          <OrderTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Realizado há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[140px]">Total do pedido</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result &&
                  result.orders.map((order) => {
                    return <OrderTableRow key={order.orderId} order={order} />
                  })}
              </TableBody>
            </Table>
          </div>

          {result && (
            <Pagination
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
