import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignIn() {
  return (
    <>
      <Helmet title="Login" />
      <div className="flex w-[350px] min-w-[100%] items-center justify-center p-8">
        <div className="flex w-[100%] max-w-[400px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Accesar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input type="email" id="email" />
            </div>

            <Button className="w-full">Acessar painel</Button>
          </form>
        </div>
      </div>
    </>
  )
}
