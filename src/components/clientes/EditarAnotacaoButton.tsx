"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Edit3,
  Save,
  X,
} from "lucide-react";

import {
  atualizarAnotacaoPaciente,
  type EstadoAnotacao,
} from "@/app/actions/paciente-anotacoes";

type EditarAnotacaoButtonProps = {
  anotacaoId: number;
  pacienteId: number;
  clienteId: number;
  texto: string;
};

const estadoInicial: EstadoAnotacao = {
  ok: false,
  mensagem: "",
};

export default function EditarAnotacaoButton({
  anotacaoId,
  pacienteId,
  clienteId,
  texto,
}: EditarAnotacaoButtonProps) {
  const [aberto, setAberto] =
    useState(false);

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    atualizarAnotacaoPaciente,
    estadoInicial,
  );

  const botaoRef =
    useRef<HTMLButtonElement>(
      null,
    );

  const campoRef =
    useRef<HTMLTextAreaElement>(
      null,
    );

  const estavaEnviandoRef =
    useRef(false);

  function abrirModal() {
    setAberto(true);
  }

  function fecharModal() {
    if (pending) {
      return;
    }

    setAberto(false);

    window.setTimeout(() => {
      botaoRef.current?.focus();
    }, 50);
  }

  useEffect(() => {
    if (!aberto) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        campoRef.current?.focus();
      }, 50);

    function tratarTeclado(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !pending
      ) {
        fecharModal();
      }
    }

    document.addEventListener(
      "keydown",
      tratarTeclado,
    );

    return () => {
      window.clearTimeout(timer);

      document.removeEventListener(
        "keydown",
        tratarTeclado,
      );
    };
  }, [aberto, pending]);

  useEffect(() => {
    if (pending) {
      estavaEnviandoRef.current = true;
      return;
    }

    if (
      estavaEnviandoRef.current &&
      estado.ok
    ) {
      estavaEnviandoRef.current = false;
      setAberto(false);

      window.setTimeout(() => {
        botaoRef.current?.focus();
      }, 50);

      return;
    }

    estavaEnviandoRef.current = false;
  }, [pending, estado.ok]);

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        onClick={abrirModal}
        title="Editar anotação"
        aria-label="Editar anotação"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#A68145] transition hover:bg-[#FFF1CF] hover:text-[#8B651F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D3A75F] focus-visible:ring-offset-2"
      >
        <Edit3 size={15} />
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17282D]/45 p-3 backdrop-blur-[2px] sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !pending
            ) {
              fecharModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`editar-anotacao-titulo-${anotacaoId}`}
            aria-describedby={`editar-anotacao-descricao-${anotacaoId}`}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-[#E6D8BA] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#EADFCB] bg-gradient-to-r from-[#FFF8E9] to-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#A88B5C]">
                  Prontuário clínico
                </p>

                <h2
                  id={`editar-anotacao-titulo-${anotacaoId}`}
                  className="mt-1 text-xl font-black text-[#353A38]"
                >
                  Editar anotação
                </h2>

                <p
                  id={`editar-anotacao-descricao-${anotacaoId}`}
                  className="mt-1 text-sm font-medium text-[#857966]"
                >
                  Atualize a informação registrada no histórico.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={pending}
                aria-label="Fechar edição da anotação"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2D8C6] bg-white text-[#7A7060] transition hover:bg-[#FFF8E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D3A75F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            <form
              action={formAction}
              aria-busy={pending}
              className="p-4 sm:p-6"
            >
              <input
                type="hidden"
                name="anotacaoId"
                value={anotacaoId}
              />

              <input
                type="hidden"
                name="pacienteId"
                value={pacienteId}
              />

              <input
                type="hidden"
                name="clienteId"
                value={clienteId}
              />

              <label
                htmlFor={`editar-anotacao-texto-${anotacaoId}`}
                className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#665D4F]"
              >
                Anotação
                <span className="ml-1 text-[#D8505B]">
                  *
                </span>
              </label>

              <textarea
                ref={campoRef}
                id={`editar-anotacao-texto-${anotacaoId}`}
                name="texto"
                required
                rows={7}
                maxLength={2000}
                defaultValue={texto}
                placeholder="Digite a anotação..."
                className="w-full resize-y rounded-xl border border-[#E7DCC8] bg-[#FFFCF7] px-4 py-3 text-sm font-medium leading-6 text-[#49453F] outline-none transition placeholder:text-[#B7AA95] hover:border-[#D8C7AA] focus:border-[#D3A75F] focus:bg-white focus:ring-4 focus:ring-[#D3A75F]/10"
              />

              <p className="mt-1.5 text-xs font-medium text-[#9A8D78]">
                Máximo de 2000 caracteres.
              </p>

              {estado.mensagem && (
                <div
                  role={
                    estado.ok
                      ? "status"
                      : "alert"
                  }
                  aria-live="polite"
                  aria-atomic="true"
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm font-bold ${
                    estado.ok
                      ? "border-[#CDE4D7] bg-[#EDF7F1] text-[#397057]"
                      : "border-[#F0CDCF] bg-[#FFF1F2] text-[#A8444D]"
                  }`}
                >
                  {estado.mensagem}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#EEE5D6] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={pending}
                  className="rounded-xl border border-[#E2D8C6] bg-white px-5 py-2.5 text-sm font-bold text-[#746957] transition hover:bg-[#FFF9EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D3A75F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#D3A75F] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#BD914A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D3A75F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {pending
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
