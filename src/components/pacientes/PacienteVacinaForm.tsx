"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronUp,
  Save,
  ShieldCheck,
  Syringe,
  X,
} from "lucide-react";

import {
  adicionarVacinaPaciente,
  type EstadoVacina,
} from "@/app/actions/paciente-vacinas";

type PacienteVacinaFormProps = {
  pacienteId: number;
  pacienteNome: string;
  especie?: string | null;
};

const estadoInicial: EstadoVacina = {
  ok: false,
  mensagem: "",
};

const VACINAS_CAES = [
  "Múltipla – Cães",
  "Antirrábica",
  "Gripe",
  "Giárdia",
  "ProHeart",
];

const VACINAS_GATOS = [
  "Múltipla – Gatos",
  "Antirrábica",
];

const VACINAS_GERAIS = [
  "Múltipla – Cães",
  "Múltipla – Gatos",
  "Antirrábica",
  "Gripe",
  "Giárdia",
  "ProHeart",
];

function dataHoje() {
  const hoje = new Date();

  const ano =
    hoje.getFullYear();

  const mes = String(
    hoje.getMonth() + 1,
  ).padStart(2, "0");

  const dia = String(
    hoje.getDate(),
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function PacienteVacinaForm({
  pacienteId,
  pacienteNome,
  especie,
}: PacienteVacinaFormProps) {
  const [aberto, setAberto] =
    useState(false);

  const [vacinaSelecionada, setVacinaSelecionada] =
    useState("");

  const [outraVacina, setOutraVacina] =
    useState("");

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
    adicionarVacinaPaciente,
    estadoInicial,
  );

  const opcoesVacina =
    useMemo(() => {
      const especieNormalizada =
        String(
          especie ?? "",
        )
          .trim()
          .toLowerCase();

      if (
        especieNormalizada.includes(
          "cão",
        ) ||
        especieNormalizada.includes(
          "cao",
        ) ||
        especieNormalizada.includes(
          "canin",
        )
      ) {
        return VACINAS_CAES;
      }

      if (
        especieNormalizada.includes(
          "gato",
        ) ||
        especieNormalizada.includes(
          "felin",
        )
      ) {
        return VACINAS_GATOS;
      }

      return VACINAS_GERAIS;
    }, [especie]);

  const nomeFinal =
    vacinaSelecionada === "Outra"
      ? outraVacina.trim()
      : vacinaSelecionada;

  useEffect(() => {
    if (estado.ok) {
      formRef.current?.reset();

      setVacinaSelecionada(
        "",
      );

      setOutraVacina(
        "",
      );

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
        className="group relative flex min-h-[96px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#6F9A89] bg-[#6F9A89] px-3 py-4 text-center text-white shadow-sm transition hover:bg-[#5D8878]"
      >
        <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10" />

        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-sm">
          {aberto ? (
            <ChevronUp
              size={24}
            />
          ) : (
            <Syringe
              size={24}
            />
          )}
        </span>

        <span className="relative mt-2 text-xs font-bold">
          {aberto
            ? "Fechar vacina"
            : "Vacina"}
        </span>
      </button>

      {aberto && (
        <div
          ref={painelRef}
          className="order-last col-span-full mt-2 scroll-mt-24 overflow-hidden rounded-[24px] border border-[#CFE0D9] bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE8E3] bg-gradient-to-r from-[#EFF7F4] to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6F9A89] text-white">
                <Syringe
                  size={21}
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#608777]">
                  Prontuário
                </p>

                <h2 className="text-xl font-black text-[#24343A]">
                  Registrar vacinação
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
              className="flex h-10 items-center gap-2 rounded-xl border border-[#D7E0DD] bg-white px-3 text-xs font-bold text-[#657572]"
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

            <input
              type="hidden"
              name="nome"
              value={nomeFinal}
            />

            <div className="mx-auto max-w-[900px] space-y-6">
              <section className="rounded-2xl border border-[#E2E8E5] bg-[#FBFCFA] p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4F0EB] text-[#4F806D]">
                    <ShieldCheck
                      size={18}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#354340]">
                      Vacina aplicada
                    </h3>

                    <p className="text-xs font-medium text-[#879592]">
                      Selecione o imunizante registrado.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {opcoesVacina.map(
                    (vacina) => {
                      const selecionada =
                        vacinaSelecionada ===
                        vacina;

                      return (
                        <button
                          key={vacina}
                          type="button"
                          onClick={() => {
                            setVacinaSelecionada(
                              vacina,
                            );

                            setOutraVacina(
                              "",
                            );
                          }}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                            selecionada
                              ? "border-[#6F9A89] bg-[#EAF3EF] text-[#315F4F] ring-2 ring-[#6F9A89]/15"
                              : "border-[#DDE5E2] bg-white text-[#53625F] hover:border-[#AFC9BF]"
                          }`}
                        >
                          {vacina}
                        </button>
                      );
                    },
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setVacinaSelecionada(
                        "Outra",
                      )
                    }
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                      vacinaSelecionada ===
                      "Outra"
                        ? "border-[#6F9A89] bg-[#EAF3EF] text-[#315F4F] ring-2 ring-[#6F9A89]/15"
                        : "border-[#DDE5E2] bg-white text-[#53625F] hover:border-[#AFC9BF]"
                    }`}
                  >
                    Outra
                  </button>
                </div>

                {vacinaSelecionada ===
                  "Outra" && (
                  <label className="mt-4 block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Nome da vacina *
                    </span>

                    <input
                      value={
                        outraVacina
                      }
                      onChange={(
                        event,
                      ) =>
                        setOutraVacina(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Informe o nome da vacina"
                      maxLength={120}
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>
                )}
              </section>

              <section className="rounded-2xl border border-[#E2E8E5] bg-white p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF3F5] text-[#174A5B]">
                    <CalendarDays
                      size={18}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#354340]">
                      Dados da aplicação
                    </h3>

                    <p className="text-xs font-medium text-[#879592]">
                      Informações do produto e da dose aplicada.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Data da aplicação *
                    </span>

                    <input
                      type="date"
                      name="dataAplicacao"
                      defaultValue={
                        dataHoje()
                      }
                      required
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Dose
                    </span>

                    <input
                      name="dose"
                      placeholder="Ex.: 1ª dose, reforço, 1 mL"
                      maxLength={80}
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Fabricante
                    </span>

                    <input
                      name="fabricante"
                      placeholder="Fabricante do produto"
                      maxLength={120}
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Lote
                    </span>

                    <input
                      name="lote"
                      placeholder="Número do lote"
                      maxLength={100}
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Validade
                    </span>

                    <input
                      type="date"
                      name="validade"
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#52615E]">
                      Próxima dose
                    </span>

                    <input
                      type="date"
                      name="proximaDose"
                      className="w-full rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-semibold text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[#E2E8E5] bg-white p-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-[#52615E]">
                    Observações
                  </span>

                  <textarea
                    name="observacoes"
                    rows={4}
                    maxLength={1500}
                    placeholder="Ex.: aplicação sem intercorrências, orientação ao tutor, reação anterior..."
                    className="w-full resize-y rounded-2xl border border-[#D7E0DD] bg-white px-4 py-3 text-sm font-medium text-[#354340] outline-none focus:border-[#6F9A89] focus:ring-4 focus:ring-[#6F9A89]/10"
                  />
                </label>
              </section>

              {!nomeFinal &&
                vacinaSelecionada !==
                  "" && (
                  <div className="rounded-2xl border border-[#E7C7C0] bg-[#FFF5F2] px-4 py-3 text-sm font-semibold text-[#A35A4B]">
                    Informe o nome da vacina.
                  </div>
                )}

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

              <div className="flex flex-wrap justify-end gap-3 border-t border-[#E5E0D7] pt-5">
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
                  disabled={
                    pending ||
                    !nomeFinal
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#6F9A89] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5D8878] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save
                    size={17}
                  />

                  {pending
                    ? "Salvando..."
                    : "Salvar vacinação"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
