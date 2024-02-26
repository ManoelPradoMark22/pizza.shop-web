import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { FieldErrors, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signUpForm = z.object({
  // informe as mensagens de erro customizadas para cada campo - note que coloquei o mínimo de 1 caracter para campo .string(), nao aceitando assim string vazia
  restaurantName: z.string().min(1, 'Insira o nome do seu estabelecimento.'),
  managerName: z.string().min(1, 'Insira o seu nome.'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(1, 'Insira o seu telefone.'),
})

type ISignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ISignUpForm>({
    // precisamos passar o resolver: zodResolver(signUpForm) para o nosso formulario usar a validacao do zod!!
    // importante o resolver, pois sem ele o nosso forms sempre q clicarmos no botao submit, irá chamar a funcao handleSubmit (mesmo com erros no formulario ou campos sem preencher!!)
    resolver: zodResolver(signUpForm),
    // informe os valores defaults
    defaultValues: {
      restaurantName: '',
      managerName: '',
      email: '',
      phone: '',
    },
  })

  async function handleSignUp(data: ISignUpForm) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
    toast.success('Restaurante cadastrado com sucesso.', {
      // duration é a duração do toast em milisegundos
      duration: 6000,
      description: 'Agora, faça login para acessar o Dashboard.',
    })
    // aqui nao coloquei o navigate no button dentro do toast, mas fora mesmo. nao se preocupe, ele vai continar vizivel por 6 segundos la na pagina de login (achei mais intuitivo assim)
    navigate('/sign-in')
  }

  /*
  e aqui será a nossa funcao quando tiver algum erro de validacao do zod! ele recebe os campos com erros!!
  observe q o parametro errorFields (pode chamar do q preferir) é um objeto. 
   - cada chave desse objeto é o nome q usamos no register de cada input, por exemplo, o do estabelecimento é 'restaurantName'
   - e o valor de cada chave é a mensagem de erro padrão que veio do zod para cada campo (ou a mensagem q vc especificou)
  por isso uso o Object.values(errorFields) para transformar em um array com os valores de cada chave (ou seja, um array com as mensagens de erros!! e é o q precisamos, pois iremos usar o toas com cada mensagem)
  */
  function onFormError(errorFields: FieldErrors<ISignUpForm>) {
    Object.values(errorFields).forEach((error) => {
      toast.error(error.message, {
        duration: 2000,
      })
    })
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="flex w-[350px] min-w-[100%] items-center justify-center p-8">
        <Button variant="ghost" asChild className="absolute right-8 top-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="flex w-[100%] max-w-[400px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e comece suas vendas!
            </p>
          </div>

          <form
            className="space-y-4"
            // segundo parâmetro da funcao handleSubmit do react-hook-form permite vc passar uma funcao para obter os erros do formulario - q no caso estamos validando com o zod
            onSubmit={handleSubmit(handleSignUp, onFormError)}
          >
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input
                type="text"
                id="restaurantName"
                {...register('restaurantName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input
                type="text"
                id="managerName"
                {...register('managerName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input type="email" id="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Seu celular</Label>
              <Input type="tel" id="phone" {...register('phone')} />
            </div>

            <Button disabled={isSubmitting} className="w-full">
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com os nossos{' '}
              <a href="" className="underline underline-offset-4">
                Termos de serviço
              </a>{' '}
              e{' '}
              <a href="" className="underline underline-offset-4">
                políticas de privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
