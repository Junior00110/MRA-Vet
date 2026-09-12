import { redirect } from "next/navigation";

import DashboardHome from "@/components/dashboard/DashboardHome";

import { db } from "@/prisma/db";

import {
  lerSessao,
} from "@/lib/auth/session";

import {
  logoutAction,
  trocarSetorAction,
} from "@/app/actions/auth";


export default async function Home() {
  const session = await lerSessao();

  if (!session) {
    redirect("/login");
  }

  if (!session.setorId) {
    redirect("/selecionar-setor");
  }

  const usuario =
    await db.orm.public.Usuario
      .where({
        id: session.usuarioId,
        ativo: true,
      })
      .first();

  if (!usuario) {
    redirect("/login");
  }

  const vinculo =
    await db.orm.public.UsuarioSetor
      .where({
        usuarioId: usuario.id,
        setorId: session.setorId,
        ativo: true,
      })
      .include("setor")
      .include("perfil")
      .first();

  if (
    !vinculo ||
    !vinculo.setor.ativo ||
    !vinculo.perfil.ativo
  ) {
    redirect("/selecionar-setor");
  }

  return (
    <>
      <DashboardHome />

      <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
        <div className="px-3">
          <p className="text-xs text-slate-400">
            Setor ativo
          </p>

          <p className="text-sm font-bold text-slate-800">
            {vinculo.setor.nome}
          </p>
        </div>

        <form
          action={trocarSetorAction}
        >
          <button
            type="submit"
            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            Trocar setor
          </button>
        </form>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
          >
            Sair
          </button>
        </form>
      </div>
    </>
  );
}
