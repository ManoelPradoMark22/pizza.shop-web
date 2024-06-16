import { Link, useRouteError } from 'react-router-dom'

export function Error() {
  const error = useRouteError() as Error

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Whoops, algo aconteceu....</h1>
      <p className="text-accent-foreground">
        Um erro aconteceu na aplicação, abaixo você encontra mais detalhes:
      </p>
      <pre>{error?.message || JSON.stringify(error)}</pre>
      {/** A LINHA ACIMA É APENAS PARA APRENDIZADO. EM PRODUCAO NAO COSTUMAMOS MOSTRAR O ERRO DA APLIACAO PARA O USUARIO FINAL, MAS SIM ENVIAR PARA ALGUMA PLATAFORMA DE ANALISE DE ERROS QUE GERENCIAMOS */}
      <p className="text-accent-foreground">
        Voltar para o{' '}
        <Link
          to="/"
          className="text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
        >
          Dashboard
        </Link>
      </p>
    </div>
  )
}
