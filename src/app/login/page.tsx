import { PawPrint } from "lucide-react";

import {
  loginAction,
} from "@/app/actions/auth";

type LoginPageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-blue-700 px-8 py-8 text-white">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <PawPrint size={30} />
          </div>

          <h1 className="text-3xl font-extrabold">
            MRA Vet
          </h1>

          <p className="mt-2 text-sm text-blue-100">
            Sistema de Gestão Veterinária
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Entrar
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Acesse sua conta para continuar.
          </p>

          {params.erro && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {params.erro}
            </div>
          )}

          <form
            action={loginAction}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Senha
              </label>

              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Entrar no MRA Vet
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
