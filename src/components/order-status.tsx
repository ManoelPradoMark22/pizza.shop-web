import { IOrderStatus } from '@/api/get-orders'

interface IOrderStatusProps {
  status: IOrderStatus
}

const orderStatusMap: Record<IOrderStatus, string> = {
  pending: 'Pendente',
  canceled: 'Cancelado',
  delivered: 'Entregue',
  delivering: 'Em entrega',
  processing: 'Em preparo',
}

const pickColor = ({ status }: IOrderStatusProps) => {
  switch (status) {
    case 'pending':
      return 'bg-slate-400'
    case 'canceled':
      return 'bg-rose-500'
    case 'delivered':
      return 'bg-emerald-500'
    case 'processing':
    case 'delivering':
      return 'bg-amber-500'
  }
}

export function OrderStatus({ status }: IOrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        data-testid="badge"
        className={`h-2 w-2 rounded-full ${pickColor({ status })}`}
      />
      <span className="font-medium text-muted-foreground">
        {orderStatusMap[status]}
      </span>
    </div>
  )
}
