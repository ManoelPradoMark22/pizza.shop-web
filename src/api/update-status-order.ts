import { api } from '@/lib/axios'

import { IOrderStatus } from './get-orders'

type IUpdateKey = 'approve' | 'dispatch' | 'deliver' | 'cancel'

export type IChangeStatusOptions = {
  label: string
  newStatus: IOrderStatus
  updateKey: IUpdateKey
}

export interface IOrderIdParam {
  orderId: string
}

export interface IUpdateStatusOrderParams extends IOrderIdParam {
  changeStatusOptions: IChangeStatusOptions
}

export async function updateStatusOrder({
  orderId,
  changeStatusOptions,
}: IUpdateStatusOrderParams) {
  await api.patch(`/orders/${orderId}/${changeStatusOptions.updateKey}`)
}
