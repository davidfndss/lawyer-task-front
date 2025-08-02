import RedirectButton from "../components/Button/RedirectButton";

export default function Error404Component() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-b1">
      <h1 className="text-4xl font-bold text-c1">
        {"Recurso não encontrado."}
      </h1>
      <p className="mt-1 text-lg text-zinc-500">A página solicitada não existe.</p>

      <img src="/img/error/404.png" className="w-[300px] my-4" />

      <div className="flex gap-2">
        <RedirectButton className="mt-6 rounded-lg text-zinc-500 px-4 py-2 transition cursor-pointer hover:bg-zinc-900">
          <i className="bi bi-chevron-left"></i> Voltar
        </RedirectButton>
      </div>
    </div>
  );
}
