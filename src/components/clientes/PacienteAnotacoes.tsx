"use client";

import {
  CheckCircle2,
  ClipboardPen,
  MessageSquareQuote,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  adicionarAnotacaoPaciente,
  removerAnotacaoPaciente,
  type EstadoAnotacao,
} from "@/app/actions/paciente-anotacoes";

type Anotacao = {
  id: number;
  texto: string;
  criadoPorNome:
    | string
    | null;
  createdAt: string;
};

type PacienteAnotacoesProps = {
  pacienteId: number;
  clienteId: number;
  nomePaciente: string;
  anotacoes: Anotacao[];
  observacaoAntiga?:
    | string
    | null;
  podeAdicionar: boolean;
};

const estadoInicial: EstadoAnotacao = {
  ok: false,
  mensagem: "",
};

function formatarDataHora(
  data: string,
) {
  const valor =
    new Date(data);

  if (
    Number.isNaN(
      valor.getTime(),
    )
  ) {
    return data;
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function resumoAnotacao(
  texto: string,
) {
  const textoLimpo =
    texto.trim();

  if (
    textoLimpo.length <=
    100
  ) {
    return textoLimpo;
  }

  return `${textoLimpo.slice(
    0,
    100,
  )}...`;
}

export default function PacienteAnotacoes({
  pacienteId,
  clienteId,
  nomePaciente,
  anotacoes,
  observacaoAntiga,
  podeAdicionar,
}: PacienteAnotacoesProps) {
  const router =
    useRouter();

  const [
    formularioAberto,
    setFormularioAberto,
  ] = useState(false);

  const [
    anotacaoParaExcluir,
    setAnotacaoParaExcluir,
  ] =
    useState<Anotacao | null>(
      null,
    );

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  const [
    erroExclusao,
    setErroExclusao,
  ] = useState("");

  const [
    estado,
    formAction,
    pendente,
  ] = useActionState(
    adicionarAnotacaoPaciente,
    estadoInicial,
  );

  useEffect(() => {
    if (estado.ok) {
      setFormularioAberto(
        false,
      );

      router.refresh();
    }
  }, [
    estado.ok,
    router,
  ]);

  function abrirExclusao(
    anotacao: Anotacao,
  ) {
    setErroExclusao("");

    setAnotacaoParaExcluir(
      anotacao,
    );
  }

  function fecharExclusao() {
    if (excluindo) {
      return;
    }

    setAnotacaoParaExcluir(
      null,
    );

    setErroExclusao("");
  }

  async function confirmarExclusao() {
    if (
      !anotacaoParaExcluir ||
      excluindo
    ) {
      return;
    }

    try {
      setExcluindo(true);
      setErroExclusao("");

      const formData =
        new FormData();

      formData.set(
        "anotacaoId",
        String(
          anotacaoParaExcluir.id,
        ),
      );

      formData.set(
        "pacienteId",
        String(
          pacienteId,
        ),
      );

      formData.set(
        "clienteId",
        String(
          clienteId,
        ),
      );

      await removerAnotacaoPaciente(
        formData,
      );

      setAnotacaoParaExcluir(
        null,
      );

      router.refresh();
    } catch {
      setErroExclusao(
        "Não foi possível remover a anotação. Tente novamente.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[26px] border border-[#E6D8BA] bg-[#FFFBF3] shadow-sm">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D7B78A]/15" />

        {/* CABEÇALHO */}
        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-[#EADFCB] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3A75F] text-white shadow-sm">
              <ClipboardPen
                size={23}
              />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#A88B5C]">
                Anotações
              </p>

              <h2 className="text-xl font-black text-[#353A38]">
                {nomePaciente}
              </h2>

              <p className="mt-1 text-xs font-medium text-[#998A73]">
                Informações importantes e histórico do paciente.
              </p>
            </div>
          </div>

          {podeAdicionar && (
            <button
              type="button"
              onClick={() =>
                setFormularioAberto(
                  true,
                )
              }
              className="flex items-center gap-2 rounded-xl bg-[#D3A75F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#BD914A]"
            >
              <Plus size={15} />
              Nova anotação
            </button>
          )}
        </div>

        <div className="relative p-6">
          {/* OBSERVAÇÃO ANTIGA */}
          {observacaoAntiga && (
            <div className="mb-4 rounded-2xl border border-[#E9D9BA] bg-white p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#A88B5C]">
                Observação antiga do cadastro
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-[#625D54]">
                {
                  observacaoAntiga
                }
              </p>
            </div>
          )}

          {/* HISTÓRICO */}
          {anotacoes.length ===
            0 &&
          !observacaoAntiga ? (
            <div className="rounded-2xl border border-dashed border-[#E4D5B8] bg-white/70 px-5 py-8 text-center">
              <MessageSquareQuote
                size={26}
                className="mx-auto text-[#C5A566]"
              />

              <p className="mt-3 text-sm font-medium text-[#8D816D]">
                Nenhuma anotação cadastrada para este paciente.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {anotacoes.map(
                (
                  anotacao,
                  index,
                ) => (
                  <article
                    key={
                      anotacao.id
                    }
                    className={`relative rounded-2xl border bg-white p-4 shadow-sm ${
                      index === 0
                        ? "border-[#DDBB70]"
                        : "border-[#ECE1CB]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7E7BF] text-[#B7831D]">
                          <MessageSquareQuote
                            size={
                              18
                            }
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          {index ===
                            0 && (
                            <span className="mb-2 inline-flex rounded-full bg-[#FFF1CF] px-2.5 py-1 text-[9px] font-semibold text-[#9B6C19]">
                              Última anotação
                            </span>
                          )}

                          <p className="whitespace-pre-wrap text-[15px] font-medium leading-6 text-[#56534D]">
                            {
                              anotacao.texto
                            }
                          </p>
                        </div>
                      </div>

                      {podeAdicionar && (
                        <button
                          type="button"
                          onClick={() =>
                            abrirExclusao(
                              anotacao,
                            )
                          }
                          title="Remover anotação"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#B58A7B] transition hover:bg-[#FDECEA] hover:text-[#C65E4A]"
                        >
                          <Trash2
                            size={
                              15
                            }
                          />
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F0E9DA] pt-3">
                      {anotacao.criadoPorNome && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F4ED] px-2.5 py-1 text-[10px] font-medium text-[#776F62]">
                          <UserRound
                            size={
                              12
                            }
                          />

                          {
                            anotacao.criadoPorNome
                          }
                        </span>
                      )}

                      <span className="rounded-full bg-[#F7F4ED] px-2.5 py-1 text-[10px] font-medium text-[#776F62]">
                        {formatarDataHora(
                          anotacao.createdAt,
                        )}
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}

          {/* SUCESSO */}
          {estado.ok &&
            estado.mensagem && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#E8F4EC] px-3 py-2.5 text-xs font-medium text-[#41725A]">
                <CheckCircle2
                  size={15}
                />

                {estado.mensagem}
              </div>
            )}

          {erroExclusao && (
            <div className="mt-4 rounded-xl bg-[#FDEDEA] px-3 py-2.5 text-xs font-medium text-[#A64D3D]">
              {erroExclusao}
            </div>
          )}

          {/* FORMULÁRIO */}
          {formularioAberto && (
            <form
              action={formAction}
              className="mt-5 rounded-2xl border border-[#DFC99B] bg-white p-5 shadow-sm"
            >
              <input
                type="hidden"
                name="pacienteId"
                value={
                  pacienteId
                }
              />

              <input
                type="hidden"
                name="clienteId"
                value={
                  clienteId
                }
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#665D4F]">
                    Nova anotação para{" "}
                    {
                      nomePaciente
                    }
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#A2947D]">
                    A informação ficará registrada no histórico.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormularioAberto(
                      false,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9D8F77] transition hover:bg-[#F4EBDD]"
                  aria-label="Fechar"
                >
                  <X
                    size={
                      16
                    }
                  />
                </button>
              </div>

              <textarea
                name="texto"
                required
                maxLength={
                  2000
                }
                rows={4}
                placeholder="Digite uma informação importante sobre o paciente..."
                className="mt-4 w-full resize-none rounded-xl border border-[#E7DCC8] bg-[#FFFCF7] px-4 py-3 text-sm font-medium leading-6 text-[#49453F] outline-none transition placeholder:text-[#B7AA95] focus:border-[#D3A75F] focus:ring-4 focus:ring-[#D3A75F]/10"
              />

              {!estado.ok &&
                estado.mensagem && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {
                      estado.mensagem
                    }
                  </p>
                )}

              <button
                type="submit"
                disabled={
                  pendente
                }
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D3A75F] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#BD914A] disabled:cursor-wait disabled:opacity-60"
              >
                <ClipboardPen
                  size={
                    15
                  }
                />

                {pendente
                  ? "Salvando..."
                  : "Salvar anotação"}
              </button>
            </form>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={
          anotacaoParaExcluir !==
          null
        }
        title="Remover anotação?"
        description={`A anotação será removida da ficha de ${nomePaciente}.`}
        itemLabel="Anotação selecionada"
        itemName={
          anotacaoParaExcluir
            ? resumoAnotacao(
                anotacaoParaExcluir.texto,
              )
            : null
        }
        confirmLabel="Remover anotação"
        loadingLabel="Removendo..."
        loading={excluindo}
        onCancel={
          fecharExclusao
        }
        onConfirm={
          confirmarExclusao
        }
      />
    </>
  );
}