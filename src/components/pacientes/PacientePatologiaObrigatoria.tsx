"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  HeartPulse,
  Loader2,
  Search,
  ShieldAlert,
} from "lucide-react";

import type {
  EstadoPatologia,
} from "@/app/actions/paciente-patologias";

import {
  buscarDoencasVeterinarias,
  type DoencaVeterinariaBusca,
} from "@/app/actions/catalogo-doencas";

export type PatologiaReferencia = {
  id: number;
  nome: string | null;
  doencaId:
    | number
    | null;
  status:
    | "SUSPEITA"
    | "EM_ACOMPANHAMENTO"
    | "TRATADA"
    | "SEM_PROBLEMA_CLINICO";
};

type StatusPatologia =
  | "SUSPEITA"
  | "EM_ACOMPANHAMENTO"
  | "TRATADA"
  | "SEM_PROBLEMA_CLINICO";

type PacientePatologiaObrigatoriaProps = {
  pacienteId: number;
  pacienteNome: string;
  atendimentoId: number;
  tipoAtendimento:
    | "CONSULTA"
    | "RETORNO";
  patologiasReferencia?: PatologiaReferencia[];
  onConcluido?: () => void;
};

const estadoInicial: EstadoPatologia = {
  ok: false,
  mensagem: "",
};

const OPCOES_STATUS: Array<{
  valor: StatusPatologia;
  titulo: string;
  descricao: string;
}> = [
  {
    valor: "SUSPEITA",
    titulo: "Suspeita",
    descricao:
      "Hipótese clínica em avaliação neste atendimento.",
  },
  {
    valor:
      "EM_ACOMPANHAMENTO",
    titulo:
      "Em acompanhamento",
    descricao:
      "O problema clínico permanece em acompanhamento.",
  },
  {
    valor: "TRATADA",
    titulo: "Tratada",
    descricao:
      "O tratamento foi conduzido ou encerrado; isso não declara cura.",
  },
  {
    valor:
      "SEM_PROBLEMA_CLINICO",
    titulo:
      "Sem problema clínico identificado",
    descricao:
      "Use em vacinação, check-up saudável ou atendimento sem alteração clínica.",
  },
];

export default function PacientePatologiaObrigatoria({
  pacienteId,
  pacienteNome,
  atendimentoId,
  tipoAtendimento,
  patologiasReferencia = [],
  onConcluido,
}: PacientePatologiaObrigatoriaProps) {
  const [
    status,
    setStatus,
  ] =
    useState<StatusPatologia>(
      "SUSPEITA",
    );

  const [
    concluidoLocalmente,
    setConcluidoLocalmente,
  ] =
    useState(false);

  const [
    buscaDoenca,
    setBuscaDoenca,
  ] =
    useState("");

  const [
    nomeSelecionado,
    setNomeSelecionado,
  ] =
    useState("");

  const [
    doencaId,
    setDoencaId,
  ] =
    useState("");

  const [
    resultadosDoenca,
    setResultadosDoenca,
  ] =
    useState<
      DoencaVeterinariaBusca[]
    >([]);

  const [
    buscandoDoenca,
    setBuscandoDoenca,
  ] =
    useState(false);

  const [
    erroBuscaDoenca,
    setErroBuscaDoenca,
  ] =
    useState("");

  const [
    patologiaOrigemId,
    setPatologiaOrigemId,
  ] =
    useState("");

  const [
    estado,
    setEstado,
  ] =
    useState<EstadoPatologia>(
      estadoInicial,
    );

  const [
    pending,
    setPending,
  ] =
    useState(false);

  const semProblemaClinico =
    status ===
    "SEM_PROBLEMA_CLINICO";

  const referenciasValidas =
    useMemo(
      () =>
        patologiasReferencia.filter(
          (item) =>
            (
              item.status ===
                "SUSPEITA" ||
              item.status ===
                "EM_ACOMPANHAMENTO"
            ) &&
            item.nome,
        ),
      [patologiasReferencia],
    );

  const referenciaSelecionada =
    useMemo(
      () =>
        referenciasValidas.find(
          (item) =>
            String(
              item.id,
            ) ===
            patologiaOrigemId,
        ),
      [
        patologiaOrigemId,
        referenciasValidas,
      ],
    );

  const doencaBloqueada =
    Boolean(
      referenciaSelecionada?.doencaId,
    );

  useEffect(() => {
    if (
      tipoAtendimento !==
        "RETORNO" ||
      referenciasValidas.length !==
        1 ||
      patologiaOrigemId ||
      semProblemaClinico
    ) {
      return;
    }

    selecionarReferencia(
      String(
        referenciasValidas[0]
          .id,
      ),
    );
    // A seleção automática só deve
    // acontecer uma vez quando existe
    // um único problema ativo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tipoAtendimento,
    referenciasValidas,
    patologiaOrigemId,
    semProblemaClinico,
  ]);

  useEffect(() => {
    if (
      semProblemaClinico ||
      doencaBloqueada
    ) {
      setResultadosDoenca(
        [],
      );
      setErroBuscaDoenca(
        "",
      );
      return;
    }

    if (
      doencaId &&
      buscaDoenca ===
        nomeSelecionado
    ) {
      setResultadosDoenca(
        [],
      );
      return;
    }

    let cancelado =
      false;

    const temporizador =
      window.setTimeout(
        async () => {
          setBuscandoDoenca(
            true,
          );
          setErroBuscaDoenca(
            "",
          );

          try {
            const resultados =
              await buscarDoencasVeterinarias(
                pacienteId,
                buscaDoenca,
              );

            if (
              cancelado
            ) {
              return;
            }

            setResultadosDoenca(
              resultados,
            );
          } catch {
            if (
              cancelado
            ) {
              return;
            }

            setResultadosDoenca(
              [],
            );

            setErroBuscaDoenca(
              "Não foi possível pesquisar o catálogo agora.",
            );
          } finally {
            if (
              !cancelado
            ) {
              setBuscandoDoenca(
                false,
              );
            }
          }
        },
        250,
      );

    return () => {
      cancelado =
        true;

      window.clearTimeout(
        temporizador,
      );
    };
  }, [
    buscaDoenca,
    doencaBloqueada,
    doencaId,
    nomeSelecionado,
    pacienteId,
    semProblemaClinico,
  ]);

  function statusParaRetorno(
    statusAtual:
      PatologiaReferencia["status"],
  ): StatusPatologia {
    if (
      statusAtual ===
        "SUSPEITA" ||
      statusAtual ===
        "EM_ACOMPANHAMENTO"
    ) {
      return "EM_ACOMPANHAMENTO";
    }

    return "SUSPEITA";
  }

  function selecionarReferencia(
    valor: string,
  ) {
    setPatologiaOrigemId(
      valor,
    );

    if (!valor) {
      setStatus(
        "SUSPEITA",
      );
      setBuscaDoenca(
        "",
      );
      setNomeSelecionado(
        "",
      );
      setDoencaId(
        "",
      );
      return;
    }

    const id =
      Number(valor);

    const referencia =
      referenciasValidas.find(
        (item) =>
          item.id === id,
      );

    if (!referencia) {
      return;
    }

    setStatus(
      statusParaRetorno(
        referencia.status,
      ),
    );

    setBuscaDoenca(
      referencia.nome ?? "",
    );

    setNomeSelecionado(
      referencia.nome ?? "",
    );

    setDoencaId(
      referencia.doencaId
        ? String(
            referencia.doencaId,
          )
        : "",
    );
  }

  function alterarStatus(
    valor: StatusPatologia,
  ) {
    setStatus(
      valor,
    );

    if (
      valor ===
      "SEM_PROBLEMA_CLINICO"
    ) {
      setBuscaDoenca("");
      setNomeSelecionado(
        "",
      );
      setDoencaId("");
      setPatologiaOrigemId(
        "",
      );
      setResultadosDoenca(
        [],
      );
    }
  }

  function alterarBuscaDoenca(
    valor: string,
  ) {
    setBuscaDoenca(
      valor,
    );

    if (
      valor !==
      nomeSelecionado
    ) {
      setNomeSelecionado(
        "",
      );
      setDoencaId(
        "",
      );
    }
  }

  function selecionarDoenca(
    doenca:
      DoencaVeterinariaBusca,
  ) {
    setDoencaId(
      String(
        doenca.id,
      ),
    );

    setNomeSelecionado(
      doenca.nome,
    );

    setBuscaDoenca(
      doenca.nome,
    );

    setResultadosDoenca(
      [],
    );

    setErroBuscaDoenca(
      "",
    );
  }

  async function enviarPatologia(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setEstado(
      estadoInicial,
    );

    try {
      const formData =
        new FormData(
          event.currentTarget,
        );

      const resposta =
        await fetch(
          "/api/paciente-patologias/finalizar",
          {
            method: "POST",
            body: formData,
          },
        );

      const resultado =
        (await resposta.json()) as EstadoPatologia;

      setEstado(
        resultado,
      );

      if (
        !resposta.ok ||
        !resultado.ok
      ) {
        return;
      }

      // O banco já confirmou a finalização.
      // Fechamos apenas no estado local e NÃO forçamos
      // router.refresh aqui, porque esse refresh estava
      // remontando o modal com os dados antigos da página.
      setConcluidoLocalmente(
        true,
      );

      onConcluido?.();
    } catch {
      setEstado({
        ok: false,
        mensagem:
          "Não foi possível finalizar a patologia. Tente novamente.",
      });
    } finally {
      setPending(false);
    }
  }

  const podeSalvar =
    !pending &&
    (
      semProblemaClinico ||
      Boolean(
        Number(
          doencaId,
        ) > 0,
      )
    );

  if (
    concluidoLocalmente
  ) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-[#122B33]/70 px-3 py-6 backdrop-blur-[2px] sm:px-5 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`titulo-patologia-obrigatoria-${atendimentoId}`}
      aria-describedby={`descricao-patologia-obrigatoria-${atendimentoId}`}
    >
      <div className="w-full max-w-[760px] overflow-hidden rounded-[28px] border border-[#D6E2DE] bg-white shadow-[0_28px_80px_rgba(10,36,43,0.32)]">
        <div className="border-b border-[#E0E8E5] bg-gradient-to-r from-[#F4EFF8] via-white to-[#F3F8F6] px-5 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#725A89] text-white shadow-sm">
              <HeartPulse
                size={22}
              />
            </span>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F0E8F5] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#725A89]">
                  Etapa obrigatória
                </span>

                <span className="rounded-full bg-[#EAF3EF] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#54786C]">
                  {tipoAtendimento ===
                  "RETORNO"
                    ? "Retorno"
                    : "Consulta"}
                </span>
              </div>

              <h2
                id={`titulo-patologia-obrigatoria-${atendimentoId}`}
                className="text-xl font-black text-[#273B3D] sm:text-2xl"
              >
                Patologia / problema clínico
              </h2>

              <p
                id={`descricao-patologia-obrigatoria-${atendimentoId}`}
                className="mt-1 text-sm font-semibold leading-5 text-[#788783]"
              >
                O atendimento de{" "}
                <span className="font-black text-[#52615E]">
                  {pacienteNome}
                </span>{" "}
                só será finalizado após esta etapa.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={
            enviarPatologia
          }
          aria-busy={
            pending
          }
          className="space-y-6 p-5 sm:p-7"
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
            name="atendimentoId"
            value={
              atendimentoId
            }
          />

          <input
            type="hidden"
            name="status"
            value={
              status
            }
          />

          <input
            type="hidden"
            name="doencaId"
            value={
              semProblemaClinico
                ? ""
                : doencaId
            }
          />

          <input
            type="hidden"
            name="patologiaOrigemId"
            value={
              semProblemaClinico
                ? ""
                : patologiaOrigemId
            }
          />

          {tipoAtendimento ===
            "RETORNO" &&
            referenciasValidas.length >
              0 && (
              <section className="rounded-2xl border border-[#DFE7E4] bg-[#FBFCFB] p-4 sm:p-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-black text-[#4F605C]">
                    Problema clínico anterior
                  </span>

                  <select
                    value={
                      patologiaOrigemId
                    }
                    onChange={(
                      event,
                    ) =>
                      selecionarReferencia(
                        event.target
                          .value,
                      )
                    }
                    disabled={
                      pending ||
                      semProblemaClinico
                    }
                    className="w-full rounded-2xl border border-[#D5DFDC] bg-white px-4 py-3 text-sm font-bold text-[#3F4F4B] outline-none transition focus:border-[#725A89] focus:ring-4 focus:ring-[#725A89]/10 disabled:cursor-not-allowed disabled:bg-[#F0F3F2]"
                  >
                    <option value="">
                      Novo problema clínico
                    </option>

                    {referenciasValidas.map(
                      (item) => (
                        <option
                          key={
                            item.id
                          }
                          value={
                            item.id
                          }
                        >
                          {
                            item.nome
                          }{" "}
                          —{" "}
                          {rotuloStatus(
                            item.status,
                          )}
                        </option>
                      ),
                    )}
                  </select>

                  <p className="mt-2 text-xs font-medium text-[#87938F]">
                    Se este retorno acompanha um problema já registrado, selecione-o para manter toda a evolução ligada ao caso original.
                  </p>
                </label>
              </section>
            )}

          <section>
            <div className="mb-3">
              <p className="text-xs font-black text-[#4F605C]">
                Situação clínica *
              </p>

              <p className="mt-1 text-xs font-medium text-[#87938F]">
                Escolha a opção que melhor representa o atendimento neste momento.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {OPCOES_STATUS.map(
                (opcao) => {
                  const selecionado =
                    status ===
                    opcao.valor;

                  return (
                    <button
                      key={
                        opcao.valor
                      }
                      type="button"
                      aria-pressed={
                        selecionado
                      }
                      disabled={
                        pending
                      }
                      onClick={() =>
                        alterarStatus(
                          opcao.valor,
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#725A89]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        selecionado
                          ? "border-[#725A89] bg-[#F4EFF8] ring-2 ring-[#725A89]/10"
                          : "border-[#DCE4E1] bg-white hover:border-[#B8C9C3] hover:bg-[#FBFCFB]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            selecionado
                              ? "bg-[#725A89] text-white"
                              : "bg-[#EEF2F0] text-[#788783]"
                          }`}
                        >
                          {selecionado ? (
                            <CheckCircle2
                              size={16}
                            />
                          ) : (
                            <ClipboardCheck
                              size={15}
                            />
                          )}
                        </span>

                        <span>
                          <span className="block text-sm font-black text-[#354340]">
                            {
                              opcao.titulo
                            }
                          </span>

                          <span className="mt-1 block text-xs font-medium leading-5 text-[#7C8A86]">
                            {
                              opcao.descricao
                            }
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </section>

          {!semProblemaClinico && (
            <section>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-black text-[#4F605C]">
                    Doença / problema clínico *
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#87938F]">
                    Pesquise no catálogo veterinário de cães e gatos.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF4F2] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#5F7C73]">
                  <Database
                    size={12}
                  />
                  Catálogo
                </span>
              </div>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-3.5 text-[#82908D]"
                />

                <input
                  value={
                    buscaDoenca
                  }
                  onChange={(
                    event,
                  ) =>
                    alterarBuscaDoenca(
                      event.target
                        .value,
                    )
                  }
                  disabled={
                    pending ||
                    doencaBloqueada
                  }
                  placeholder="Digite o nome da doença..."
                  autoFocus={
                    tipoAtendimento ===
                    "CONSULTA"
                  }
                  autoComplete="off"
                  aria-label="Pesquisar doença veterinária"
                  className="w-full rounded-2xl border border-[#D5DFDC] bg-white py-3 pl-11 pr-11 text-sm font-semibold text-[#354340] outline-none transition focus:border-[#725A89] focus:ring-4 focus:ring-[#725A89]/10 disabled:cursor-not-allowed disabled:bg-[#F0F3F2]"
                />

                {buscandoDoenca && (
                  <Loader2
                    size={17}
                    className="absolute right-4 top-3.5 animate-spin text-[#725A89]"
                    aria-label="Pesquisando doenças"
                  />
                )}

                {!buscandoDoenca &&
                  doencaId && (
                  <CheckCircle2
                    size={17}
                    className="absolute right-4 top-3.5 text-[#4F8B72]"
                    aria-label="Doença selecionada"
                  />
                )}

                {!doencaBloqueada &&
                  resultadosDoenca.length >
                    0 && (
                  <div
                    role="listbox"
                    aria-label="Resultados da pesquisa de doenças"
                    className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#D5DFDC] bg-white p-2 shadow-[0_18px_45px_rgba(26,54,57,0.18)]"
                  >
                    {resultadosDoenca.map(
                      (
                        doenca,
                      ) => (
                        <button
                          key={
                            doenca.id
                          }
                          type="button"
                          role="option"
                          aria-selected={
                            String(
                              doenca.id,
                            ) ===
                            doencaId
                          }
                          onClick={() =>
                            selecionarDoenca(
                              doenca,
                            )
                          }
                          className="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#F3F7F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#725A89]/25"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-black text-[#34433F]">
                              {
                                doenca.nome
                              }
                            </span>

                            {doenca.categoria && (
                              <span className="mt-0.5 block text-xs font-medium text-[#84918E]">
                                {
                                  doenca.categoria
                                }
                              </span>
                            )}
                          </span>

                          <span className="shrink-0 rounded-full bg-[#EEF4F2] px-2 py-1 text-[9px] font-black uppercase tracking-[0.06em] text-[#617E75]">
                            {rotuloEspecie(
                              doenca.especie,
                            )}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {doencaBloqueada && (
                <p className="mt-2 text-xs font-semibold text-[#6D7E79]">
                  Este retorno está vinculado ao problema clínico selecionado acima.
                </p>
              )}

              {!doencaBloqueada &&
                !doencaId &&
                buscaDoenca.trim() &&
                !buscandoDoenca &&
                resultadosDoenca.length ===
                  0 &&
                !erroBuscaDoenca && (
                <p className="mt-2 text-xs font-semibold text-[#9A6F56]">
                  Nenhuma doença encontrada com esse termo. Tente outro nome ou sinônimo.
                </p>
              )}

              {erroBuscaDoenca && (
                <p
                  role="alert"
                  className="mt-2 text-xs font-semibold text-[#A45143]"
                >
                  {
                    erroBuscaDoenca
                  }
                </p>
              )}

              {doencaId &&
                nomeSelecionado && (
                <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#CDE0D7] bg-[#F2F8F5] px-4 py-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#4F8B72]"
                  />

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#6C817A]">
                      Selecionada
                    </p>

                    <p className="mt-0.5 text-sm font-black text-[#3F5E53]">
                      {
                        nomeSelecionado
                      }
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {semProblemaClinico && (
            <div className="flex items-start gap-3 rounded-2xl border border-[#CFE1D9] bg-[#F3F9F6] px-4 py-4 text-sm font-semibold text-[#4D6E62]">
              <ShieldAlert
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p>
                Nenhuma doença será vinculada. O atendimento ficará registrado como sem problema clínico identificado.
              </p>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-black text-[#4F605C]">
              Observação clínica
            </span>

            <textarea
              name="observacoes"
              rows={4}
              disabled={
                pending
              }
              placeholder="Informações complementares, justificativa clínica ou observações sobre a evolução..."
              maxLength={
                1800
              }
              className="w-full resize-y rounded-2xl border border-[#D5DFDC] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#354340] outline-none transition focus:border-[#725A89] focus:ring-4 focus:ring-[#725A89]/10 disabled:cursor-not-allowed disabled:bg-[#F0F3F2]"
            />
          </label>

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
              className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                estado.ok
                  ? "border-[#B9DDCA] bg-[#EFF8F3] text-[#347158]"
                  : "border-[#EDC7C0] bg-[#FFF4F1] text-[#A45143]"
              }`}
            >
              {estado.ok ? (
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <AlertCircle
                  size={18}
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

          <div className="flex flex-col gap-3 border-t border-[#E2E8E5] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-[#85928F]">
              Esta janela não pode ser ignorada enquanto o atendimento estiver aguardando patologia.
            </p>

            <button
              type="submit"
              disabled={
                !podeSalvar
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#725A89] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#634D79] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#725A89]/25 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <HeartPulse
                  size={17}
                />
              )}

              {pending
                ? "Finalizando..."
                : "Salvar e finalizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function rotuloStatus(
  status: StatusPatologia,
) {
  switch (status) {
    case "SUSPEITA":
      return "Suspeita";

    case "EM_ACOMPANHAMENTO":
      return "Em acompanhamento";

    case "TRATADA":
      return "Tratada";

    case "SEM_PROBLEMA_CLINICO":
      return "Sem problema clínico";
  }
}

function rotuloEspecie(
  especie:
    DoencaVeterinariaBusca["especie"],
) {
  switch (especie) {
    case "CANINO":
      return "Cães";

    case "FELINO":
      return "Gatos";

    case "AMBOS":
      return "Cães e gatos";
  }
}
