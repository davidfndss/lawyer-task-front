import RedirectButton from "../Button/RedirectButton";
interface ErrorProps {
    errorMessage?: string;
    button?: boolean;
    buttonInnerText?: string;
    buttonRedirectRoute?: string;
}

export default function ErrorComponent({ errorMessage, button, buttonInnerText, buttonRedirectRoute }: ErrorProps){

  console.error("Erro detectado:", errorMessage);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-b1">
      <h1 className="text-4xl font-bold text-c1">Ocorreu um erro</h1>
      <p className="mt-1 text-lg text-zinc-500">Algo deu errado ao carregar a página.</p>

      <img src="/img/error/error.png" className="w-[300px] my-4"></img>
      
      <div className="flex gap-2">
        <RedirectButton className="mt-6 rounded-lg text-zinc-500 px-4 py-2 transition cursor-pointer hover:bg-zinc-900">
            <i className="bi bi-chevron-left"></i> Voltar
        </RedirectButton>
        {
          button ? (
            <RedirectButton className="mt-6 rounded-lg bg-c1 px-6 py-2 text-white transition cursor-pointer hover:bg-c2" route={buttonRedirectRoute}>
              {buttonInnerText}
            </RedirectButton>
          ) : null
        }
        
      </div>
    </div>
  );
}