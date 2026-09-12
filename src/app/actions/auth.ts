"use server";

import { redirect } from "next/navigation";

import { db } from "@/prisma/db";

import {
  criarSessao,
  excluirSessao,
  lerSessao,
} from "@/lib/auth/session";

import {
  verificarSenha,
} from "@/lib/auth/password";


export async function loginAction(
  formData: FormData,
) {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const senha = String(
    formData.get("senha") ?? "",
  );

  if (!email || !senha) {
    redirect(
      "/login?erro=Preencha o e-mail e a senha",
    );
  }

  const usuario =
    await db.orm.public.Usuario
      .where({
        email,
        ativo: true,
      })
      .first();

  if (
    !usuario ||
    !verificarSenha(
      senha,
      usuario.senhaHash,
    )
  ) {
    redirect(
      "/login?erro=E-mail ou senha incorretos",
    );
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
    redirect(
      "/login?erro=Usuário sem setor ativo",
    );
  }

  const unidades =
    await db.orm.public.UsuarioUnidade
      .where({
        usuarioId: usuario.id,
      })
      .include("unidade")
      .all();

  const unidadeAtiva =
    unidades.find(
      (item) => item.unidade.ativo,
    );

  if (!unidadeAtiva) {
    redirect(
      "/login?erro=Usuário sem unidade ativa",
    );
  }

  if (setoresAtivos.length === 1) {
    await criarSessao({
      usuarioId: usuario.id,
      setorId: setoresAtivos[0].setorId,
      unidadeId:
        unidadeAtiva.unidadeId,
    });

    redirect("/");
  }

  await criarSessao({
    usuarioId: usuario.id,
    unidadeId:
      unidadeAtiva.unidadeId,
  });

  redirect("/selecionar-setor");
}


export async function selecionarSetorAction(
  formData: FormData,
) {
  const session = await lerSessao();

  if (!session) {
    redirect("/login");
  }

  const setorId = Number(
    formData.get("setorId"),
  );

  if (
    !Number.isInteger(setorId) ||
    setorId <= 0
  ) {
    redirect("/selecionar-setor");
  }

  const vinculo =
    await db.orm.public.UsuarioSetor
      .where({
        usuarioId: session.usuarioId,
        setorId,
        ativo: true,
      })
      .include("setor")
      .first();

  if (
    !vinculo ||
    !vinculo.setor.ativo
  ) {
    redirect("/selecionar-setor");
  }

  await criarSessao({
    usuarioId: session.usuarioId,
    setorId,
    unidadeId: session.unidadeId,
  });

  redirect("/");
}


export async function trocarSetorAction() {
  const session = await lerSessao();

  if (!session) {
    redirect("/login");
  }

  await criarSessao({
    usuarioId: session.usuarioId,
    unidadeId: session.unidadeId,
  });

  redirect("/selecionar-setor");
}


export async function logoutAction() {
  await excluirSessao();

  redirect("/login");
}
