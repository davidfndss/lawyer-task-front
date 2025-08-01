import RedirectButton from "../components/Button/RedirectButton";

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-b1">
      <header className="w-full z-20 sticky top-0 transition backdrop-blur-xs">
          <div className="w-[90vw] mx-auto h-[10vh] max-h-[80px] flex items-center justify-between ">
            <div className="flex items-center text-2xl text-blue-700">
              <h2>Logo aqui</h2>
            </div>

             <div className="flex gap-4 items-center">
                <RedirectButton route="/login" className="rounded lg py-2 px-10 border text-c4 border-c4 transition cursor-pointer hover:border-c5 hover:bg-c5 hover:text-zinc-100">
                  Entrar
                </RedirectButton> 

                <RedirectButton route="/signup" className="rounded lg py-2 px-10 border bg-c1 border-c1 text-white transition cursor-pointer hover:border-c5 hover:bg-c5">
                  Criar conta
                </RedirectButton>
              </div>  
          </div>
        </header>
      <section className="w-full h-full max-h-screen flex justify-around px-[10vh] gap-4 overflow-hidden">
        <article className="flex flex-col w-full items-start justify-center gap-4 max-w-[600px]">
          <h1 className="text-6xl font-bold text-zinc-200">LawyerTask</h1>
          <h2 className="text-2xl font-semibold text-zinc-200">The best task management tool for lawyers</h2>

          <RedirectButton route="/login" className="bg-white text-b1 py-2 px-8 rounded-xl mt-4 font-bold text-2xl">
            Entrar
          </RedirectButton>
        </article>
        
        <img src="/img/statue.png" className="h-full w-full max-w-[500px] mt-[200px]" alt="statue"></img>
      </section>
    </main>
  );
}
