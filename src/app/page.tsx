import RedirectButton from "../components/Button/RedirectButton";
import { showSuccess } from "./utils/toast";

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen flex items-center justify-center bg-b1">
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
