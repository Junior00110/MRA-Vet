import Link from "next/link";

import {
  ShieldX,
} from "lucide-react";

export default function AcessoNegadoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldX size={34} />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
          Acesso não permitido
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Seu usuário não possui permissão para acessar esta funcionalidade no setor atual.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
