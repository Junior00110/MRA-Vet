"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  RotateCcw,
  Save,
  X,
} from "lucide-react";

import {
  adicionarRetornoPaciente,
  type EstadoAtendimento,
} from "@/app/actions/paciente-atendimentos";

import type {
  PatologiaReferencia,
} from "@/components/pacientes/PacientePatologiaObrigatoria";

type PacienteRetornoFormProps = {
  pacienteId: number;
  pacienteNome: string;
  atendimentoOrigemId: number;
  motivoConsulta?:
    | string
    | null;
  diagnosticoSuspeita?:
    | string
    | null;
  patologiasReferencia?: PatologiaReferencia[];
};

const estadoInicial: EstadoAtendimento = {
  ok: false,
  mensagem: "",
};

const campoClass =
  "w-full resize-y rounded-2xl border border-[#D7E1DD] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#354340] outline-none transition placeholder:text-[#A5AFAC] focus:border-[#7FA89A] focus:ring-4 focus:ring-[#7FA89A]/15 disabled:cursor-not-allowed disabled:bg-[#F2F5F4] disabled:text-[#82908D]";

export default function PacienteRetornoForm({
  pacienteId,
  pacienteNome,
  atendimentoOrigemId,
  motivoConsulta,
  diagnosticoSuspeita,
}: PacienteRetornoFormProps) {
  const [
    aberto,
    setAberto,
  ] = useState(false);

  const formRef =
    useRef<HTMLFormElement>(
      null,
    );

  const painelRef =
    useRef<HTMLDivElement>(
      null,
    );

  const botaoAbrirRef =
    useRef<HTMLButtonElement>(
      null,
    );

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    adicionarRetornoPaciente,
    estadoInicial,
  );

  useEffect(() => {
    if (
      !estado.ok ||
      !estado.requerPatologia ||
      !estado.atendimentoId
    ) {
      return;
    }

    // A página do paciente é a única responsável por abrir
    // a etapa obrigatória de patologia.
    formRef.current?.reset();

    setAberto(false);

    requestAnimationFrame(
      () =>
        botaoAbrirRef.current?.focus(),
    );
  }, [
    estado.atendimentoId,
    estado.ok,
    estado.requerPatologia,
  ]);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function fecharComEscape(
      evento: KeyboardEvent,
    ) {
      if (
        evento.key === "Escape" &&
        !pending
      ) {
        setAberto(false);

        requestAnimationFrame(
          () =>
            botaoAbrirRef.current?.focus(),
        );
      }
    }

    window.addEventListener(
      "keydown",
      fecharComEscape,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        fecharComEscape,
      );
  }, [
    aberto,
    pending,
  ]);

  function abrirRetorno() {
    setAberto(true);

    setTimeout(
      () =>
        painelRef.current?.scrollIntoView(
          {
            behavior:
              "smooth",
            block:
              "nearest",
          },
        ),
      100,
    );
  }

  function fecharRetorno() {
    if (pending) {
      return;
    }

    setAberto(false);

    requestAnimationFrame(
      () =>
        botaoAbrirRef.current?.focus(),
    );
  }

  return (
    <>
      <div>
      <button
        ref={
          botaoAbrirRef
        }
        type="button"
        onClick={
          aberto
            ? fecharRetorno
            : abrirRetorno
        }
        aria-expanded={
          aberto
        }
        aria-controls={`retorno-atendimento-${atendimentoOrigemId}`}
        className="inline-flex items-center gap-2 rounded-xl border border-[#BFD4CC] bg-[#F1F7F4] px-4 py-2.5 text-xs font-black text-[#4F7468] transition hover:border-[#93B3A8] hover:bg-[#EAF3EF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7FA89A]/25 focus-visible:ring-offset-2"
      >
        <RotateCcw
          size={15}
        />

        {aberto
          ? "Fechar retorno"
          : "Registrar retorno"}
      </button>

      {aberto && (
        <div
          id={`retorno-atendimento-${atendimentoOrigemId}`}
          ref={
            painelRef
          }
          role="region"
          aria-labelledby={`titulo-retorno-${atendimentoOrigemId}`}
          className="mt-4 overflow-hidden rounded-[22px] border border-[#CFE0DA] bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE8E4] bg-[#F3F8F6] px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7FA89A] text-white">
                <ClipboardCheck
                  size={18}
                />
              </span>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#648579]">
                  Consulta de retorno
                </p>

                <h4
                  id={`titulo-retorno-${atendimentoOrigemId}`}
                  className="mt-1 text-base font-black text-[#2F3D39]"
                >
                  Retorno da consulta #
                  {
                    atendimentoOrigemId
                  }
                </h4>

                <p className="mt-1 text-xs font-semibold text-[#7A8884]">
                  Paciente:{" "}
                  <span className="text-[#52615E]">
                    {
                      pacienteNome
                    }
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                fecharRetorno
              }
              disabled={
                pending
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D5E1DD] bg-white text-[#657572] transition hover:bg-[#EEF4F1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7FA89A]/20 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Fechar formulário de retorno"
            >
              <X
                size={16}
              />
            </button>
          </div>

          {(motivoConsulta ||
            diagnosticoSuspeita) && (
            <div className="border-b border-[#E5ECE9] bg-[#FBFCFB] px-4 py-4 sm:px-5">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#84938F]">
                Referência da consulta inicial
              </p>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {motivoConsulta && (
                  <div className="rounded-xl border border-[#E1E8E5] bg-white px-3 py-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8A9794]">
                      Motivo
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#46534F]">
                      {
                        motivoConsulta
                      }
                    </p>
                  </div>
                )}

                {diagnosticoSuspeita && (
                  <div className="rounded-xl border border-[#E1E8E5] bg-white px-3 py-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8A9794]">
                      Suspeita anterior
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm font-bold text-[#46534F]">
                      {
                        diagnosticoSuspeita
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form
            ref={
              formRef
            }
            action={
              formAction
            }
            aria-busy={
              pending
            }
            className="p-4 sm:p-5"
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
              name="atendimentoOrigemId"
              value={
                atendimentoOrigemId
              }
            />

            <div className="grid gap-4">
              <CampoRetorno
                label="Evolução desde a consulta"
                name="evolucao"
                placeholder="Ex.: melhorou, piorou, sintomas persistem, resposta ao tratamento..."
                linhas={4}
                disabled={
                  pending
                }
              />

              <CampoRetorno
                label="Exame clínico no retorno"
                name="exameClinico"
                placeholder="Registre os achados clínicos relevantes deste retorno..."
                linhas={4}
                disabled={
                  pending
                }
              />

              <CampoRetorno
                label="Diagnóstico / suspeita atual"
                name="diagnosticoSuspeita"
                placeholder="Atualize a suspeita ou registre o diagnóstico quando houver..."
                linhas={4}
                disabled={
                  pending
                }
              />

              <CampoRetorno
                label="Conduta"
                name="conduta"
                placeholder="Tratamento, ajustes, orientações, novos exames ou próximo retorno..."
                linhas={4}
                disabled={
                  pending
                }
              />

              <CampoRetorno
                label="Observações"
                name="observacoes"
                placeholder="Informações complementares deste retorno..."
                linhas={3}
                disabled={
                  pending
                }
              />
            </div>

            {estado.mensagem && (
              <div
                role={
                  estado.ok
                    ? "status"
                    : "alert"
                }
                aria-live={
                  estado.ok
                    ? "polite"
                    : "assertive"
                }
                aria-atomic="true"
                className={`mt-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
                  estado.ok
                    ? "border-[#B9DDCA] bg-[#EFF8F3] text-[#347158]"
                    : "border-[#EDC7C0] bg-[#FFF4F1] text-[#A45143]"
                }`}
              >
                {estado.ok && (
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <span>
                  {
                    estado.mensagem
                  }
                </span>
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E4EAE8] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-[#85928F]">
                Depois de finalizar o retorno, a etapa obrigatória de patologia será aberta automaticamente.
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={
                    fecharRetorno
                  }
                  disabled={
                    pending
                  }
                  className="rounded-xl border border-[#D6DFDC] bg-white px-4 py-2.5 text-sm font-bold text-[#5C6B67] transition hover:bg-[#F6F8F7] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7FA89A]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    pending
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#5F8579] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#4E7468] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7FA89A]/30 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                >
                  {pending ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={16}
                    />
                  )}

                  {pending
                    ? "Finalizando..."
                    : "Finalizar retorno"}

                  {!pending && (
                    <ArrowRight
                      size={15}
                    />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      </div>

    </>
  );
}

function CampoRetorno({
  label,
  name,
  placeholder,
  linhas,
  disabled,
}: {
  label: string;
  name: string;
  placeholder: string;
  linhas: number;
  disabled: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-[#52615E]">
        {label}
      </span>

      <textarea
        name={
          name
        }
        rows={
          linhas
        }
        disabled={
          disabled
        }
        placeholder={
          placeholder
        }
        className={
          campoClass
        }
      />
    </label>
  );
}
