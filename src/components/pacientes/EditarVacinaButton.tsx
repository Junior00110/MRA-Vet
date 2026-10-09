"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Edit3,
  Save,
  Syringe,
  X,
} from "lucide-react";

import {
  atualizarVacinaPaciente,
  type EstadoVacina,
} from "@/app/actions/paciente-vacinas";

type EditarVacinaButtonProps = {
  vacinaId: number;
  pacienteId: number;
  especie?: string | null;
  nome: string;
  dose?: string | null;
  lote?: string | null;
  fabricante?: string | null;
  observacoes?: string | null;
  dataAplicacao: string;
  validade?: string | null;
  proximaDose?: string | null;
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

function dataInput(
  valor?: string | null,
) {
  if (!valor) {
    return "";
  }

  return String(valor).slice(0, 10);
}

export default function EditarVacinaButton({
  vacinaId,
  pacienteId,
  especie,
  nome,
  dose,
  lote,
  fabricante,
  observacoes,
  dataAplicacao,
  validade,
  proximaDose,
}: EditarVacinaButtonProps) {
  const [aberto, setAberto] =
    useState(false);

  const [
    vacinaSelecionada,
    setVacinaSelecionada,
  ] = useState("");

  const [
    outraVacina,
    setOutraVacina,
  ] = useState("");

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    atualizarVacinaPaciente,
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

  const estavaEnviandoRef =
    useRef(false);

  const opcoesVacina =
    useMemo(() => {
      const especieNormalizada =
        String(especie ?? "")
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

  function prepararValores() {
    if (opcoesVacina.includes(nome)) {
      setVacinaSelecionada(nome);
      setOutraVacina("");
      return;
    }

    setVacinaSelecionada("Outra");
    setOutraVacina(nome);
  }

  function abrirModal() {
    prepararValores();
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
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CFE0D9] bg-white text-[#4F806D] transition hover:border-[#9EBFAF] hover:bg-[#EFF7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9A89] focus-visible:ring-offset-2"
        aria-label={`Editar vacinação ${nome}`}
        title="Editar vacinação"
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
            aria-labelledby={`editar-vacina-titulo-${vacinaId}`}
            aria-describedby={`editar-vacina-descricao-${vacinaId}`}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-[#CFE0D9] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE8E3] bg-gradient-to-r from-[#EFF7F4] to-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#608777]">
                  Prontuário clínico
                </p>

                <h2
                  ref={tituloRef}
                  id={`editar-vacina-titulo-${vacinaId}`}
                  tabIndex={-1}
                  className="mt-1 text-xl font-black text-[#24343A] outline-none"
                >
                  Editar vacinação
                </h2>

                <p
                  id={`editar-vacina-descricao-${vacinaId}`}
                  className="mt-1 text-sm font-medium text-[#71807C]"
                >
                  Atualize os dados desta vacinação.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={pending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D7E0DD] bg-white text-[#64736F] transition hover:bg-[#F4F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9A89] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fechar edição da vacinação"
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
                name="vacinaId"
                value={vacinaId}
              />

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

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#CFE0D9] bg-[#F4FAF7] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6F9A89] text-white">
                  <Syringe size={19} />
                </span>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#608777]">
                    Vacinação registrada
                  </p>

                  <p className="mt-0.5 text-sm font-black text-[#34423F]">
                    {nome}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.1em] text-[#5F706B]">
                    Vacina aplicada *
                  </p>

                  <div
                    className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
                    role="group"
                    aria-label="Vacina aplicada"
                  >
                    {opcoesVacina.map(
                      (vacina) => {
                        const selecionada =
                          vacinaSelecionada ===
                          vacina;

                        return (
                          <button
                            key={vacina}
                            type="button"
                            aria-pressed={
                              selecionada
                            }
                            onClick={() => {
                              setVacinaSelecionada(
                                vacina,
                              );
                              setOutraVacina(
                                "",
                              );
                            }}
                            className={`rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9A89] focus-visible:ring-offset-2 ${
                              selecionada
                                ? "border-[#6F9A89] bg-[#EAF3EF] text-[#315F4F]"
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
                      aria-pressed={
                        vacinaSelecionada ===
                        "Outra"
                      }
                      onClick={() =>
                        setVacinaSelecionada(
                          "Outra",
                        )
                      }
                      className={`rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9A89] focus-visible:ring-offset-2 ${
                        vacinaSelecionada ===
                        "Outra"
                          ? "border-[#6F9A89] bg-[#EAF3EF] text-[#315F4F]"
                          : "border-[#DDE5E2] bg-white text-[#53625F] hover:border-[#AFC9BF]"
                      }`}
                    >
                      Outra
                    </button>
                  </div>

                  {vacinaSelecionada ===
                    "Outra" && (
                    <label className="mt-3 block">
                      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#5F706B]">
                        Nome da vacina *
                      </span>

                      <input
                        value={outraVacina}
                        onChange={(event) =>
                          setOutraVacina(
                            event.target.value,
                          )
                        }
                        maxLength={120}
                        placeholder="Informe o nome da vacina"
                        className="w-full rounded-xl border border-[#D7E1DE] bg-[#F9FBFA] px-3 py-2.5 text-sm font-semibold text-[#34423F] outline-none focus:border-[#6F9A89] focus:bg-white focus:ring-2 focus:ring-[#6F9A89]/20"
                      />
                    </label>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Campo
                    label="Data da aplicação *"
                    id={`editar-vacina-data-${vacinaId}`}
                  >
                    <input
                      id={`editar-vacina-data-${vacinaId}`}
                      type="date"
                      name="dataAplicacao"
                      required
                      defaultValue={dataInput(
                        dataAplicacao,
                      )}
                      className={inputClass}
                    />
                  </Campo>

                  <Campo
                    label="Dose"
                    id={`editar-vacina-dose-${vacinaId}`}
                  >
                    <input
                      id={`editar-vacina-dose-${vacinaId}`}
                      name="dose"
                      maxLength={80}
                      defaultValue={dose ?? ""}
                      placeholder="Ex.: 1ª dose, reforço, 1 mL"
                      className={inputClass}
                    />
                  </Campo>

                  <Campo
                    label="Fabricante"
                    id={`editar-vacina-fabricante-${vacinaId}`}
                  >
                    <input
                      id={`editar-vacina-fabricante-${vacinaId}`}
                      name="fabricante"
                      maxLength={120}
                      defaultValue={
                        fabricante ?? ""
                      }
                      className={inputClass}
                    />
                  </Campo>

                  <Campo
                    label="Lote"
                    id={`editar-vacina-lote-${vacinaId}`}
                  >
                    <input
                      id={`editar-vacina-lote-${vacinaId}`}
                      name="lote"
                      maxLength={100}
                      defaultValue={lote ?? ""}
                      className={inputClass}
                    />
                  </Campo>

                  <Campo
                    label="Validade"
                    id={`editar-vacina-validade-${vacinaId}`}
                  >
                    <input
                      id={`editar-vacina-validade-${vacinaId}`}
                      type="date"
                      name="validade"
                      defaultValue={dataInput(
                        validade,
                      )}
                      className={inputClass}
                    />
                  </Campo>

                  <Campo
                    label="Próxima dose"
                    id={`editar-vacina-proxima-${vacinaId}`}
                  >
                    <input
                      id={`editar-vacina-proxima-${vacinaId}`}
                      type="date"
                      name="proximaDose"
                      defaultValue={dataInput(
                        proximaDose,
                      )}
                      className={inputClass}
                    />
                  </Campo>
                </div>

                <Campo
                  label="Observações"
                  id={`editar-vacina-observacoes-${vacinaId}`}
                >
                  <textarea
                    id={`editar-vacina-observacoes-${vacinaId}`}
                    name="observacoes"
                    rows={4}
                    maxLength={1500}
                    defaultValue={
                      observacoes ?? ""
                    }
                    className={`${inputClass} resize-y`}
                  />
                </Campo>
              </div>

              {!nomeFinal && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-[#F0CDCF] bg-[#FFF1F2] px-4 py-3 text-sm font-bold text-[#A8444D]"
                >
                  Informe o nome da vacina.
                </div>
              )}

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
                  className="rounded-xl border border-[#DCE4E1] bg-white px-5 py-2.5 text-sm font-bold text-[#5C6B67] transition hover:bg-[#F6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9A89] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    pending ||
                    !nomeFinal
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#6F9A89] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#5D8878] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9A89] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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

const inputClass =
  "w-full rounded-xl border border-[#D7E1DE] bg-[#F9FBFA] px-3 py-2.5 text-sm font-semibold text-[#34423F] outline-none transition hover:border-[#C7D4D0] focus:border-[#6F9A89] focus:bg-white focus:ring-2 focus:ring-[#6F9A89]/20";

function Campo({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#5F706B]"
      >
        {label}
      </label>

      {children}
    </div>
  );
}
