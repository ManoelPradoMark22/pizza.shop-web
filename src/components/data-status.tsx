import { Inbox, RefreshCw } from 'lucide-react'

type IDataStatus = {
  size?: number
  type: 'no-data' | 'error'
  label?: string
  refetch?: () => void
}

export function DataStatus({ size, type, label, refetch }: IDataStatus) {
  return (
    <div className="flex flex-col items-center gap-2">
      {type === 'no-data' ? (
        <>
          <Inbox size={size} />
          <span className="font-normal text-muted-foreground">
            {label ?? 'Nenhum registro encontrado'}
          </span>
        </>
      ) : (
        <>
          <RefreshCw
            size={size}
            onClick={() => {
              refetch && refetch()
            }}
            className="cursor-pointer"
          />
          <div className="flex flex-col items-center gap-[0.5]">
            <span className="font-normal text-muted-foreground">
              {label ?? 'Erro ao carregar dados'}
            </span>
            <span className="font-thin text-muted-foreground">
              Clique para recarregar
            </span>
          </div>
        </>
      )}
    </div>
  )
}
