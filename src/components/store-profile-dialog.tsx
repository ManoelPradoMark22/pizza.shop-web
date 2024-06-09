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
  description: z.string().nullable(),
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
    formState: { isSubmitting, isDirty },
  } = useForm<IStoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    },
  })

  type IUpdateManagedRestaurantCacheReturn = {
    previousProfile?: IGetManagedRestaurantResponse
  }

  function updateManagedRestaurantCache({
    name,
    description,
  }: IStoreProfileSchema): IUpdateManagedRestaurantCacheReturn {
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

    return { previousProfile: oldCached }
  }

  const { mutateAsync } = useMutation({
    mutationFn: updateProfile,
    onMutate: ({ name, description }) => {
      const { previousProfile } = updateManagedRestaurantCache({
        name,
        description,
      })

      return { previousProfile }
    },
    onError: (_error, __variables, context) => {
      if (context?.previousProfile) {
        updateManagedRestaurantCache(context.previousProfile)
      }
    },
  })

  async function handleUpdateProfile(data: IStoreProfileSchema) {
    try {
      toast.loading('Atualizando perfil')

      onClose()

      await mutateAsync({
        name: data.name,
        description: data.description,
      })

      toast.dismiss()
      toast.success('Perfil atualizado com sucesso!')
    } catch (e) {
      toast.dismiss()
      toast.error('Erro ao atualizar o perfil, tente novamente.')
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
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            variant="success"
          >
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
