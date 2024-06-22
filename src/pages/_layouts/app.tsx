import { isAxiosError } from 'axios'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { Header } from '@/components/header'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response, // a primeira funcao é disparada quando houver sucesso na requisicao
      (error) => {
        // a segunda funcao é disparada quando houver erro na requisicao
        if (isAxiosError(error)) {
          const status = error.response?.status

          const code = error.response?.data?.code

          if (status === 401 && code === 'UNAUTHORIZED') {
            navigate('/sign-in', { replace: true })
            queryClient.clear()
          } else {
            throw error
          }
        }
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    } // qnd o componente for desmontado, essa é a funcao de limpeza do listener do useEffect
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
