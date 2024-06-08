import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getManagedRestaurant,
  IGetManagedRestaurantResponse,
} from '@/api/get-managed-restaurant'
import { updateProfile } from '@/api/update-profile'
import { QUERY_KEYS } from '@/utils/constants'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const { GET_MANAGED_RESTAURANT_KEY } = QUERY_KEYS

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
})

type IStoreProfileSchema = z.infer<typeof storeProfileSchema>

type IStoreProfileDialog = {
  onClose: () => void
}

export function StoreProfileDialog({ onClose }: IStoreProfileDialog) {
  const queryClient = useQueryClient()
  const { data: managedRestaurant } = useQuery({
    queryKey: GET_MANAGED_RESTAURANT_KEY,
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IStoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    },
  })

  const { mutateAsync } = useMutation({
    mutationFn: updateProfile,
    onSuccess(_data, { name, description }) {
      const oldCached = queryClient.getQueryData<IGetManagedRestaurantResponse>(
        GET_MANAGED_RESTAURANT_KEY,
      )

      if (oldCached) {
        queryClient.setQueryData<IGetManagedRestaurantResponse>(
          GET_MANAGED_RESTAURANT_KEY,
          {
            ...oldCached,
            name,
            description,
          },
        )
      }
    },
  })

  async function handleUpdateProfile(data: IStoreProfileSchema) {
    try {
      toast.loading('Atualizando perfil')

      await mutateAsync({
        name: data.name,
        description: data.description,
      })

      toast.dismiss()
      toast.success('Perfil atualizado com sucesso!')
      onClose()
    } catch (e) {
      toast.dismiss()
      toast.success('Erro ao atualizar o perfil, tente novamente.')
    }
  }

  return (
    <DialogContent onCloseAutoFocus={() => reset()}>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form action="" onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={isSubmitting}
              variant="ghost"
              onClick={() => reset()}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting} variant="success">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
