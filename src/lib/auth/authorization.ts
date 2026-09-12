import "server-only";

import { redirect } from "next/navigation";

import { db } from "@/prisma/db";
import { lerSessao } from "@/lib/auth/session";

export type EscopoAcesso = "OWN" | "UNIT" | "ALL";

export type ContextoAcesso = {
  usuario: {
    id: number;
    nome: string;
    email: string;
    isMaster: boolean;
  };

  setor: {
    id: number;
    nome: string;
    codigo: string;
  };

  perfil: {
    id: number;
    nome: string;
    tipo: string;
  };

  unidade: {
    id: number;
    nome: string;
    codigo: string;
  };

  permissoes: Map<string, EscopoAcesso | null>;
};

export async function obterContextoAcesso(): Promise<ContextoAcesso | null> {
  const session = await lerSessao();

  if (
    !session ||
    !session.usuarioId ||
    !session.setorId ||
    !session.unidadeId
  ) {
    return null;
  }

  const usuario =
    await db.orm.public.Usuario
      .where({
        id: session.usuarioId,
        ativo: true,
      })
      .first();

  if (!usuario) {
    return null;
  }

  const vinculoSetor =
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
    !vinculoSetor ||
    !vinculoSetor.setor.ativo ||
    !vinculoSetor.perfil.ativo
  ) {
    return null;
  }

  const vinculoUnidade =
    await db.orm.public.UsuarioUnidade
      .where({
        usuarioId: usuario.id,
        unidadeId: session.unidadeId,
      })
      .include("unidade")
      .first();

  if (
    !vinculoUnidade ||
    !vinculoUnidade.unidade.ativo
  ) {
    return null;
  }

  const vinculosPermissao =
    await db.orm.public.PerfilPermissao
      .where({
        perfilId: vinculoSetor.perfil.id,
      })
      .include("permissao")
      .all();

  const permissoes =
    new Map<string, EscopoAcesso | null>();

  for (const item of vinculosPermissao) {
    if (!item.permissao.ativo) {
      continue;
    }

    permissoes.set(
      item.permissao.codigo,
      (item.escopo as EscopoAcesso | null) ?? null,
    );
  }

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      isMaster: usuario.isMaster,
    },

    setor: {
      id: vinculoSetor.setor.id,
      nome: vinculoSetor.setor.nome,
      codigo: vinculoSetor.setor.codigo,
    },

    perfil: {
      id: vinculoSetor.perfil.id,
      nome: vinculoSetor.perfil.nome,
      tipo: vinculoSetor.perfil.tipo,
    },

    unidade: {
      id: vinculoUnidade.unidade.id,
      nome: vinculoUnidade.unidade.nome,
      codigo: vinculoUnidade.unidade.codigo,
    },

    permissoes,
  };
}


export async function exigirContextoAcesso() {
  const contexto =
    await obterContextoAcesso();

  if (!contexto) {
    redirect("/login");
  }

  return contexto;
}


export async function pode(
  codigoPermissao: string,
): Promise<boolean> {
  const contexto =
    await obterContextoAcesso();

  if (!contexto) {
    return false;
  }

  // Defesa extra:
  // o Master possui autoridade máxima.
  if (contexto.usuario.isMaster) {
    return true;
  }

  return contexto.permissoes.has(
    codigoPermissao,
  );
}


export async function obterEscopo(
  codigoPermissao: string,
): Promise<EscopoAcesso | null> {
  const contexto =
    await obterContextoAcesso();

  if (!contexto) {
    return null;
  }

  if (contexto.usuario.isMaster) {
    return "ALL";
  }

  if (
    !contexto.permissoes.has(
      codigoPermissao,
    )
  ) {
    return null;
  }

  return (
    contexto.permissoes.get(
      codigoPermissao,
    ) ?? null
  );
}


export async function exigirPermissao(
  codigoPermissao: string,
) {
  const contexto =
    await exigirContextoAcesso();

  if (contexto.usuario.isMaster) {
    return {
      ...contexto,
      escopo: "ALL" as EscopoAcesso,
    };
  }

  if (
    !contexto.permissoes.has(
      codigoPermissao,
    )
  ) {
    redirect("/acesso-negado");
  }

  return {
    ...contexto,

    escopo:
      contexto.permissoes.get(
        codigoPermissao,
      ) ?? null,
  };
}


export async function exigirMaster() {
  const contexto =
    await exigirContextoAcesso();

  if (!contexto.usuario.isMaster) {
    redirect("/acesso-negado");
  }

  return contexto;
}


/**
 * Proteção especial para operações administrativas.
 *
 * Gestores podem administrar outros usuários,
 * mas nunca podem desativar, rebaixar ou alterar
 * permissões da conta Master.
 */
export async function protegerUsuarioMaster(
  usuarioAlvoId: number,
) {
  const contexto =
    await exigirContextoAcesso();

  const alvo =
    await db.orm.public.Usuario
      .where({
        id: usuarioAlvoId,
      })
      .first();

  if (!alvo) {
    throw new Error(
      "Usuário não encontrado.",
    );
  }

  if (
    alvo.isMaster &&
    !contexto.usuario.isMaster
  ) {
    throw new Error(
      "A conta Master não pode ser alterada por outro usuário.",
    );
  }

  return {
    contexto,
    alvo,
  };
}
