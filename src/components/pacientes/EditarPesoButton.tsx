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
  Scale,
  X,
} from "lucide-react";

import {
  atualizarPesoPaciente,
  type EstadoPeso,
} from "@/app/actions/paciente-pesos";

type EditarPesoButtonProps = {
  pesoId: number;
  pacienteId: number;
  peso: number;
  observacoes?: string | null;
};

const estadoInicial: EstadoPeso = {
  ok: false,
  mensagem: "",
};

export default function EditarPesoButton({
  pesoId,
  pacienteId,
  peso,
  observacoes,
}: EditarPesoButtonProps) {
  const [aberto, setAberto] =
    useState(false);

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    atualizarPesoPaciente,
    estadoInicial,
  );

  const botaoRef =
    useRef<HTMLButtonElement>(
      null,
    );

  const tituloRef =
    useRef<HTMLHeadingElement>(
      null,
    );

  useEffect(() => {
    if (!aberto) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        tituloRef.current?.focus();
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
      window.clearTimeout(
        timer,
      );

      document.removeEventListener(
        "keydown",
        tratarTeclado,
      );
    };
  }, [aberto, pending]);

  const estavaEnviandoRef =
    useRef(false);

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

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        onClick={abrirModal}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2D3BB] bg-white text-[#9B6725] transition hover:border-[#D3B887] hover:bg-[#FFF8EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D38A2B] focus-visible:ring-offset-2"
        aria-label={`Editar pesagem de ${peso} kg`}
        title="Editar peso"
        aria-haspopup="dialog"
        aria-expanded={aberto}
      >
        <Edit3 size={14} />
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
            aria-labelledby={`editar-peso-titulo-${pesoId}`}
            aria-describedby={`editar-peso-descricao-${pesoId}`}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[26px] border border-[#E8DDCA] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E8E0D2] bg-gradient-to-r from-[#FFF7EA] to-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#B17124]">
                  Prontuário clínico
                </p>

                <h2
                  ref={tituloRef}
                  id={`editar-peso-titulo-${pesoId}`}
                  tabIndex={-1}
                  className="mt-1 text-xl font-black text-[#24343A] outline-none"
                >
                  Editar peso
                </h2>

                <p
                  id={`editar-peso-descricao-${pesoId}`}
                  className="mt-1 text-sm font-medium text-[#71807C]"
                >
                  Atualize a pesagem e as observações deste registro.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={pending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDD7CC] bg-white text-[#64736F] transition hover:bg-[#FFF9F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D38A2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fechar edição do peso"
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
                name="pesoId"
                value={pesoId}
              />

              <input
                type="hidden"
                name="pacienteId"
                value={pacienteId}
              />

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#EAD9BC] bg-[#FFFAF1] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D38A2B] text-white">
                  <Scale size={19} />
                </span>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#A66D25]">
                    Pesagem registrada
                  </p>

                  <p className="mt-0.5 text-sm font-black text-[#34423F]">
                    {peso} kg
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor={`editar-peso-${pesoId}`}
                    className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#5F706B]"
                  >
                    Peso atual
                    <span className="ml-1 text-[#D8505B]">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      id={`editar-peso-${pesoId}`}
                      name="peso"
                      required
                      inputMode="decimal"
                      defaultValue={String(
                        peso,
                      ).replace(".", ",")}
                      placeholder="Ex.: 12,4"
                      className="w-full rounded-xl border border-[#D7E1DE] bg-[#F9FBFA] px-3 py-2.5 pr-12 text-base font-black text-[#34423F] outline-none transition hover:border-[#C7D4D0] focus:border-[#D38A2B] focus:bg-white focus:ring-2 focus:ring-[#D38A2B]/20"
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#786A55]">
                      kg
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`editar-peso-observacoes-${pesoId}`}
                    className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#5F706B]"
                  >
                    Observações
                  </label>

                  <textarea
                    id={`editar-peso-observacoes-${pesoId}`}
                    name="observacoes"
                    rows={4}
                    maxLength={1500}
                    defaultValue={
                      observacoes ?? ""
                    }
                    placeholder="Observações sobre esta pesagem..."
                    className="w-full resize-y rounded-xl border border-[#D7E1DE] bg-[#F9FBFA] px-3 py-2.5 text-sm font-semibold text-[#34423F] outline-none transition placeholder:font-medium placeholder:text-[#96A39F] hover:border-[#C7D4D0] focus:border-[#D38A2B] focus:bg-white focus:ring-2 focus:ring-[#D38A2B]/20"
                  />
                </div>
              </div>

              {estado.mensagem && (
                <div
                  role={
                    estado.ok
                      ? "status"
                      : "alert"
                  }
                  aria-live="polite"
                  aria-atomic="true"
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm font-bold ${
                    estado.ok
                      ? "border-[#CDE4D7] bg-[#EDF7F1] text-[#397057]"
                      : "border-[#F0CDCF] bg-[#FFF1F2] text-[#A8444D]"
                  }`}
                >
                  {estado.mensagem}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E7ECEA] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={pending}
                  className="rounded-xl border border-[#DCE4E1] bg-white px-5 py-2.5 text-sm font-bold text-[#5C6B67] transition hover:bg-[#F6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D38A2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#D38A2B] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#BD7721] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D38A2B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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