"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronUp,
  Save,
  Scale,
  X,
} from "lucide-react";

import {
  adicionarPesoPaciente,
  type EstadoPeso,
} from "@/app/actions/paciente-pesos";

type PacientePesoFormProps = {
  pacienteId: number;
  pacienteNome: string;
};

const estadoInicial: EstadoPeso = {
  ok: false,
  mensagem: "",
};

export default function PacientePesoForm({
  pacienteId,
  pacienteNome,
}: PacientePesoFormProps) {
  const [aberto, setAberto] =
    useState(false);

  const formRef =
    useRef<HTMLFormElement>(
      null,
    );

  const painelRef =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    adicionarPesoPaciente,
    estadoInicial,
  );

  useEffect(() => {
    if (estado.ok) {
      formRef.current?.reset();
      setAberto(false);
    }
  }, [estado.ok]);

  function abrir() {
    setAberto(true);

    setTimeout(() => {
      painelRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
        },
      );
    }, 100);
  }

  return (
    <>
      <button
        type="button"
        onClick={
          aberto
            ? () =>
                setAberto(false)
            : abrir
        }
        className="group relative flex min-h-[96px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#D38A2B] bg-[#D38A2B] px-3 py-4 text-center text-white shadow-sm transition hover:bg-[#BD7721]"
      >
        <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10" />

        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-sm">
          {aberto ? (
            <ChevronUp
              size={24}
            />
          ) : (
            <Scale
              size={24}
            />
          )}
        </span>

        <span className="relative mt-2 text-xs font-bold">
          {aberto
            ? "Fechar peso"
            : "Peso"}
        </span>
      </button>

      {aberto && (
        <div
          ref={painelRef}
          className="order-last col-span-full mt-2 scroll-mt-24 overflow-hidden rounded-[24px] border border-[#E6D1AE] bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E0D2] bg-gradient-to-r from-[#FFF7EA] to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D38A2B] text-white">
                <Scale
                  size={21}
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#B17124]">
                  Prontuário
                </p>

                <h2 className="text-xl font-black text-[#24343A]">
                  Registrar peso
                </h2>

                <p className="text-xs font-semibold text-[#82908D]">
                  Paciente:{" "}
                  {pacienteNome}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setAberto(false)
              }
              disabled={pending}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDD7CC] bg-white px-3 text-xs font-bold text-[#657572]"
            >
              <X size={16} />
              Fechar
            </button>
          </div>

          <form
            ref={formRef}
            action={formAction}
            className="p-6"
          >
            <input
              type="hidden"
              name="pacienteId"
              value={pacienteId}
            />

            <div className="mx-auto max-w-[620px] space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#52615E]">
                  Peso atual *
                </span>

                <div className="relative">
                  <input
                    name="peso"
                    required
                    inputMode="decimal"
                    placeholder="Ex.: 12,4"
                    className="w-full rounded-2xl border border-[#DCCFBA] bg-white px-4 py-3 pr-14 text-lg font-black text-[#354340] outline-none focus:border-[#D38A2B] focus:ring-4 focus:ring-[#D38A2B]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8B7C65]">
                    kg
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#52615E]">
                  Observações
                </span>

                <textarea
                  name="observacoes"
                  rows={3}
                  placeholder="Ex.: perda de peso recente, paciente em dieta..."
                  className="w-full resize-y rounded-2xl border border-[#DCCFBA] bg-white px-4 py-3 text-sm font-medium text-[#354340] outline-none focus:border-[#D38A2B] focus:ring-4 focus:ring-[#D38A2B]/10"
                />
              </label>

              {estado.mensagem && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    estado.ok
                      ? "border-[#B9DDCA] bg-[#EFF8F3] text-[#347158]"
                      : "border-[#EDC7C0] bg-[#FFF4F1] text-[#A45143]"
                  }`}
                >
                  {estado.mensagem}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-[#E5E0D7] pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setAberto(false)
                  }
                  disabled={pending}
                  className="rounded-xl border border-[#D6DFDC] bg-white px-5 py-3 text-sm font-semibold text-[#63716E]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="flex items-center gap-2 rounded-xl bg-[#D38A2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#BD7721] disabled:opacity-60"
                >
                  <Save
                    size={17}
                  />

                  {pending
                    ? "Salvando..."
                    : "Salvar peso"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
