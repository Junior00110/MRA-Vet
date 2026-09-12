import { redirect } from "next/navigation";

import {
  Building2,
  Stethoscope,
} from "lucide-react";

import { db } from "@/prisma/db";

import {
  selecionarSetorAction,
} from "@/app/actions/auth";

import {
  lerSessao,
} from "@/lib/auth/session";


export default async function SelecionarSetorPage() {
  const session = await lerSessao();

  if (!session) {
    redirect("/login");
  }

  if (session.setorId) {
    redirect("/");
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

  const setores =
    await db.orm.public.UsuarioSetor
      .where({
        usuarioId: usuario.id,
        ativo: true,
      })
      .include("setor")
      .include("perfil")
      .all();

  const setoresAtivos =
    setores.filter(
      (item) => item.setor.ativo,
    );

  if (setoresAtivos.length === 0) {
    redirect("/login");
  }

  if (setoresAtivos.length === 1) {
    const formData = new FormData();

    formData.set(
      "setorId",
      String(setoresAtivos[0].setorId),
    );

    await selecionarSetorAction(
      formData,
    );

    return null;
  }

  const unidade =
    session.unidadeId
      ? await db.orm.public.Unidade
          .where({
            id: session.unidadeId,
            ativo: true,
          })
          .first()
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg">
            <Stethoscope size={32} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Olá, {usuario.nome}
          </h1>

          <p className="mt-2 text-slate-500">
            Onde você deseja trabalhar agora?
          </p>

          {unidade && (
            <p className="mt-2 text-sm font-semibold text-blue-700">
              {unidade.nome}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {setoresAtivos.map(
            (vinculo) => (
              <form
                key={vinculo.id}
                action={
                  selecionarSetorAction
                }
              >
                <input
                  type="hidden"
                  name="setorId"
                  value={vinculo.setorId}
                />

                <button
                  type="submit"
                  className="group w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Building2 />
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        {vinculo.setor.nome}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {vinculo.perfil.nome}
                      </p>

                      {unidade && (
                        <p className="mt-3 text-xs text-slate-400">
                          Unidade:{" "}
                          {unidade.nome}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </form>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
