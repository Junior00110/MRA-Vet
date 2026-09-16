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
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Search,
  Save,
  X,
} from "lucide-react";

import {
  adicionarExamePaciente,
  type EstadoExame,
} from "@/app/actions/paciente-exames";

type PacienteExameFormProps = {
  pacienteId: number;
  pacienteNome: string;
};

const estadoInicial: EstadoExame = {
  ok: false,
  mensagem: "",
};

type ExameOpcao = {
  nome: string;
  categoria: string;
};

const EXAMES: ExameOpcao[] = [
  {
    nome: "Hemograma completo",
    categoria: "Hematologia",
  },
  {
    nome: "Hematócrito",
    categoria: "Hematologia",
  },
  {
    nome: "Contagem de plaquetas",
    categoria: "Hematologia",
  },
  {
    nome: "Reticulócitos",
    categoria: "Hematologia",
  },
  {
    nome: "Esfregaço sanguíneo",
    categoria: "Hematologia",
  },

  {
    nome: "Perfil bioquímico completo",
    categoria: "Bioquímica",
  },
  {
    nome: "Glicemia",
    categoria: "Bioquímica",
  },
  {
    nome: "Ureia",
    categoria: "Bioquímica",
  },
  {
    nome: "Creatinina",
    categoria: "Bioquímica",
  },
  {
    nome: "ALT (TGP)",
    categoria: "Bioquímica",
  },
  {
    nome: "AST (TGO)",
    categoria: "Bioquímica",
  },
  {
    nome: "Fosfatase alcalina",
    categoria: "Bioquímica",
  },
  {
    nome: "GGT",
    categoria: "Bioquímica",
  },
  {
    nome: "Bilirrubina total",
    categoria: "Bioquímica",
  },
  {
    nome: "Bilirrubina direta e indireta",
    categoria: "Bioquímica",
  },
  {
    nome: "Proteínas totais",
    categoria: "Bioquímica",
  },
  {
    nome: "Albumina",
    categoria: "Bioquímica",
  },
  {
    nome: "Globulinas",
    categoria: "Bioquímica",
  },
  {
    nome: "Colesterol",
    categoria: "Bioquímica",
  },
  {
    nome: "Triglicerídeos",
    categoria: "Bioquímica",
  },
  {
    nome: "Amilase",
    categoria: "Bioquímica",
  },
  {
    nome: "Lipase",
    categoria: "Bioquímica",
  },
  {
    nome: "Fósforo",
    categoria: "Bioquímica",
  },
  {
    nome: "Cálcio total",
    categoria: "Bioquímica",
  },
  {
    nome: "Cálcio ionizado",
    categoria: "Bioquímica",
  },
  {
    nome: "Sódio",
    categoria: "Bioquímica",
  },
  {
    nome: "Potássio",
    categoria: "Bioquímica",
  },
  {
    nome: "Cloro",
    categoria: "Bioquímica",
  },

  {
    nome: "Urinálise",
    categoria: "Urinálise",
  },
  {
    nome: "Urina tipo I",
    categoria: "Urinálise",
  },
  {
    nome: "Relação proteína/creatinina urinária (RPCU)",
    categoria: "Urinálise",
  },
  {
    nome: "Urocultura",
    categoria: "Urinálise",
  },
  {
    nome: "Antibiograma urinário",
    categoria: "Urinálise",
  },

  {
    nome: "Exame parasitológico de fezes",
    categoria: "Parasitologia",
  },
  {
    nome: "Coproparasitológico",
    categoria: "Parasitologia",
  },
  {
    nome: "Pesquisa de Giardia",
    categoria: "Parasitologia",
  },
  {
    nome: "Pesquisa de hemoparasitas",
    categoria: "Parasitologia",
  },

  {
    nome: "Teste rápido FIV/FeLV",
    categoria: "Infectologia",
  },
  {
    nome: "PCR para FIV",
    categoria: "Infectologia",
  },
  {
    nome: "PCR para FeLV",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para cinomose",
    categoria: "Infectologia",
  },
  {
    nome: "PCR para cinomose",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para parvovirose",
    categoria: "Infectologia",
  },
  {
    nome: "PCR para parvovirose",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para erliquiose",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para anaplasmose",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para leishmaniose",
    categoria: "Infectologia",
  },
  {
    nome: "Sorologia para leishmaniose",
    categoria: "Infectologia",
  },
  {
    nome: "PCR para leishmaniose",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para dirofilariose",
    categoria: "Infectologia",
  },
  {
    nome: "Teste para toxoplasmose",
    categoria: "Infectologia",
  },

  {
    nome: "Ultrassonografia abdominal",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Ultrassonografia gestacional",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Ultrassonografia cervical",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia de tórax",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia abdominal",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia de coluna",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia de membro torácico",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia de membro pélvico",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia de pelve",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia de crânio",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Radiografia odontológica",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Tomografia computadorizada",
    categoria: "Diagnóstico por imagem",
  },
  {
    nome: "Ressonância magnética",
    categoria: "Diagnóstico por imagem",
  },

  {
    nome: "Ecocardiograma",
    categoria: "Cardiologia",
  },
  {
    nome: "Ecocardiograma com Doppler",
    categoria: "Cardiologia",
  },
  {
    nome: "Eletrocardiograma",
    categoria: "Cardiologia",
  },
  {
    nome: "Holter",
    categoria: "Cardiologia",
  },
  {
    nome: "Aferição de pressão arterial",
    categoria: "Cardiologia",
  },
  {
    nome: "Troponina cardíaca",
    categoria: "Cardiologia",
  },

  {
    nome: "T4 total",
    categoria: "Endocrinologia",
  },
  {
    nome: "T4 livre",
    categoria: "Endocrinologia",
  },
  {
    nome: "TSH",
    categoria: "Endocrinologia",
  },
  {
    nome: "Cortisol",
    categoria: "Endocrinologia",
  },
  {
    nome: "Teste de estimulação com ACTH",
    categoria: "Endocrinologia",
  },
  {
    nome: "Teste de supressão com dexametasona",
    categoria: "Endocrinologia",
  },
  {
    nome: "Frutosamina",
    categoria: "Endocrinologia",
  },
  {
    nome: "Insulina",
    categoria: "Endocrinologia",
  },

  {
    nome: "Lipase pancreática específica canina (cPL)",
    categoria: "Gastroenterologia",
  },
  {
    nome: "Lipase pancreática específica felina (fPL)",
    categoria: "Gastroenterologia",
  },
  {
    nome: "TLI",
    categoria: "Gastroenterologia",
  },
  {
    nome: "Vitamina B12",
    categoria: "Gastroenterologia",
  },
  {
    nome: "Ácido fólico",
    categoria: "Gastroenterologia",
  },

  {
    nome: "Tempo de protrombina (TP)",
    categoria: "Coagulação",
  },
  {
    nome: "Tempo de tromboplastina parcial ativada (TTPA)",
    categoria: "Coagulação",
  },
  {
    nome: "Coagulograma",
    categoria: "Coagulação",
  },
  {
    nome: "D-dímero",
    categoria: "Coagulação",
  },

  {
    nome: "Citologia aspirativa",
    categoria: "Citologia",
  },
  {
    nome: "Citologia de pele",
    categoria: "Citologia",
  },
  {
    nome: "Citologia de ouvido",
    categoria: "Citologia",
  },
  {
    nome: "Citologia vaginal",
    categoria: "Citologia",
  },
  {
    nome: "Histopatológico",
    categoria: "Patologia",
  },
  {
    nome: "Biópsia",
    categoria: "Patologia",
  },
  {
    nome: "Imuno-histoquímica",
    categoria: "Patologia",
  },

  {
    nome: "Cultura bacteriana",
    categoria: "Microbiologia",
  },
  {
    nome: "Cultura fúngica",
    categoria: "Microbiologia",
  },
  {
    nome: "Antibiograma",
    categoria: "Microbiologia",
  },

  {
    nome: "Raspado de pele",
    categoria: "Dermatologia",
  },
  {
    nome: "Tricograma",
    categoria: "Dermatologia",
  },
  {
    nome: "Lâmpada de Wood",
    categoria: "Dermatologia",
  },
  {
    nome: "Teste intradérmico",
    categoria: "Dermatologia",
  },

  {
    nome: "Teste de Schirmer",
    categoria: "Oftalmologia",
  },
  {
    nome: "Teste de fluoresceína",
    categoria: "Oftalmologia",
  },
  {
    nome: "Tonometria",
    categoria: "Oftalmologia",
  },
  {
    nome: "Fundoscopia",
    categoria: "Oftalmologia",
  },
  {
    nome: "Ultrassonografia ocular",
    categoria: "Oftalmologia",
  },
  {
    nome: "Eletrorretinografia",
    categoria: "Oftalmologia",
  },

  {
    nome: "Análise de líquido cefalorraquidiano",
    categoria: "Neurologia",
  },
  {
    nome: "Eletromiografia",
    categoria: "Neurologia",
  },

  {
    nome: "Espermograma",
    categoria: "Reprodução",
  },
  {
    nome: "Dosagem de progesterona",
    categoria: "Reprodução",
  },
  {
    nome: "Citologia vaginal para ciclo estral",
    categoria: "Reprodução",
  },

  {
    nome: "Gasometria",
    categoria: "Outros",
  },
  {
    nome: "Lactato",
    categoria: "Outros",
  },
  {
    nome: "Proteína C reativa",
    categoria: "Outros",
  },
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

export default function PacienteExameForm({
  pacienteId,
  pacienteNome,
}: PacienteExameFormProps) {
  const [aberto, setAberto] =
    useState(false);

  const [status, setStatus] =
    useState("SOLICITADO");

  const [nomeExame, setNomeExame] =
    useState("");

  const [
    listaAberta,
    setListaAberta,
  ] = useState(false);

  const formRef =
    useRef<HTMLFormElement>(
      null,
    );

  const painelRef =
    useRef<HTMLDivElement>(
      null,
    );

  const campoExameRef =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    adicionarExamePaciente,
    estadoInicial,
  );

  const examesFiltrados =
    useMemo(() => {
      const busca =
        nomeExame
          .trim()
          .toLocaleLowerCase(
            "pt-BR",
          );

      if (!busca) {
        return EXAMES;
      }

      return EXAMES.filter(
        (exame) =>
          exame.nome
            .toLocaleLowerCase(
              "pt-BR",
            )
            .includes(busca) ||
          exame.categoria
            .toLocaleLowerCase(
              "pt-BR",
            )
            .includes(busca),
      );
    }, [nomeExame]);

  const examesAgrupados =
    useMemo(() => {
      const grupos =
        new Map<
          string,
          ExameOpcao[]
        >();

      for (
        const exame of
        examesFiltrados
      ) {
        const existente =
          grupos.get(
            exame.categoria,
          ) ?? [];

        existente.push(exame);

        grupos.set(
          exame.categoria,
          existente,
        );
      }

      return Array.from(
        grupos.entries(),
      );
    }, [examesFiltrados]);

  useEffect(() => {
    if (estado.ok) {
      formRef.current?.reset();

      setStatus(
        "SOLICITADO",
      );

      setNomeExame("");

      setListaAberta(false);

      setAberto(false);
    }
  }, [estado.ok]);

  useEffect(() => {
    function fecharLista(
      event: MouseEvent,
    ) {
      if (
        campoExameRef.current &&
        !campoExameRef.current.contains(
          event.target as Node,
        )
      ) {
        setListaAberta(false);
      }
    }

    document.addEventListener(
      "mousedown",
      fecharLista,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        fecharLista,
      );
    };
  }, []);

  function abrirFormulario() {
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

  function selecionarExame(
    exame: ExameOpcao,
  ) {
    setNomeExame(
      exame.nome,
    );

    setListaAberta(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={
          aberto
            ? () =>
                setAberto(false)
            : abrirFormulario
        }
        className="group relative flex min-h-[96px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#EB5965] bg-[#EB5965] px-3 py-4 text-center text-white shadow-sm transition hover:bg-[#DA4E5A]"
      >
        <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10" />

        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-sm">
          {aberto ? (
            <ChevronUp
              size={24}
            />
          ) : (
            <FlaskConical
              size={24}
            />
          )}
        </span>

        <span className="relative mt-2 text-xs font-bold">
          {aberto
            ? "Fechar exame"
            : "Exame"}
        </span>
      </button>

      {aberto && (
        <div
          ref={painelRef}
          className="col-span-full scroll-mt-6 rounded-[24px] border border-[#E4D8D9] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-3 border-b border-[#ECE5E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B64C57]">
                Prontuário clínico
              </p>

              <h3 className="mt-1 text-lg font-black text-[#24343A]">
                Registrar exame
              </h3>

              <p className="mt-1 text-sm font-medium text-[#7D8A87]">
                Paciente:{" "}
                <span className="font-bold text-[#495754]">
                  {pacienteNome}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setAberto(false)
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E1E7E5] bg-[#F7F9F8] text-[#64736F] transition hover:bg-[#EEF2F0]"
              aria-label="Fechar formulário de exame"
            >
              <X size={17} />
            </button>
          </div>

          <form
            ref={formRef}
            action={formAction}
            className="mt-5"
          >
            <input
              type="hidden"
              name="pacienteId"
              value={pacienteId}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Campo>
                <Label
                  htmlFor="exame-nome"
                  obrigatorio
                >
                  Nome do exame
                </Label>

                <div
                  ref={campoExameRef}
                  className="relative"
                >
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9895]"
                    />

                    <input
                      id="exame-nome"
                      name="nome"
                      type="text"
                      required
                      maxLength={200}
                      autoComplete="off"
                      value={nomeExame}
                      onFocus={() =>
                        setListaAberta(
                          true,
                        )
                      }
                      onChange={(
                        event,
                      ) => {
                        setNomeExame(
                          event.target
                            .value,
                        );

                        setListaAberta(
                          true,
                        );
                      }}
                      placeholder="Pesquisar exame..."
                      className={`${inputClass} pl-10 pr-10`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setListaAberta(
                          (
                            atual,
                          ) =>
                            !atual,
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#758480] hover:bg-[#EDF1EF]"
                      aria-label="Abrir lista de exames"
                    >
                      <ChevronDown
                        size={16}
                      />
                    </button>
                  </div>

                  {listaAberta && (
                    <div className="absolute left-0 right-0 z-50 mt-2 max-h-[360px] overflow-y-auto rounded-2xl border border-[#DCE4E1] bg-white p-2 shadow-xl">
                      <div className="border-b border-[#EEF2F0] px-3 py-2">
                        <p className="text-sm font-bold text-[#5F6E6A]">
                          {
                            examesFiltrados.length
                          }{" "}
                          exames encontrados
                        </p>
                      </div>

                      {examesAgrupados.length >
                      0 ? (
                        examesAgrupados.map(
                          ([
                            categoria,
                            exames,
                          ]) => (
                            <div
                              key={
                                categoria
                              }
                              className="py-2"
                            >
                              <p className="px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#A04D56]">
                                {
                                  categoria
                                }
                              </p>

                              <div className="mt-1 space-y-1">
                                {exames.map(
                                  (
                                    exame,
                                  ) => (
                                    <button
                                      key={`${exame.categoria}-${exame.nome}`}
                                      type="button"
                                      onClick={() =>
                                        selecionarExame(
                                          exame,
                                        )
                                      }
                                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FFF1F2]"
                                    >
                                      <span className="text-sm font-bold text-[#34423F]">
                                        {
                                          exame.nome
                                        }
                                      </span>

                                      <span className="ml-3 hidden shrink-0 rounded-full bg-[#F1F4F3] px-3 py-1.5 text-xs font-black text-[#667773] sm:inline">
                                        {
                                          exame.categoria
                                        }
                                      </span>
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <FlaskConical
                            size={24}
                            className="mx-auto text-[#A4AFAC]"
                          />

                          <p className="mt-2 text-sm font-bold text-[#586763]">
                            Exame não encontrado
                          </p>

                          <p className="mt-1 text-xs font-medium text-[#8B9894]">
                            Você ainda pode usar o nome digitado.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-[11px] font-medium text-[#8D9996]">
                  Pesquise pelo nome ou pela categoria. Se o exame não existir na lista, você pode digitá-lo normalmente.
                </p>
              </Campo>

              <Campo>
                <Label htmlFor="exame-tipo">
                  Tipo / categoria
                </Label>

                <input
                  id="exame-tipo"
                  name="tipo"
                  type="text"
                  maxLength={150}
                  placeholder="Ex.: Laboratorial, imagem..."
                  className={inputClass}
                />
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-status"
                  obrigatorio
                >
                  Status
                </Label>

                <select
                  id="exame-status"
                  name="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value,
                    )
                  }
                  required
                  className={inputClass}
                >
                  <option value="SOLICITADO">
                    Solicitado
                  </option>

                  <option value="REALIZADO">
                    Realizado
                  </option>

                  <option value="RESULTADO_DISPONIVEL">
                    Resultado disponível
                  </option>

                  <option value="CANCELADO">
                    Cancelado
                  </option>
                </select>
              </Campo>

              <Campo>
                <Label htmlFor="exame-laboratorio">
                  Laboratório
                </Label>

                <input
                  id="exame-laboratorio"
                  name="laboratorio"
                  type="text"
                  maxLength={200}
                  placeholder="Nome do laboratório"
                  className={inputClass}
                />
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-data-solicitacao"
                  obrigatorio
                >
                  Data da solicitação
                </Label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9895]"
                  />

                  <input
                    id="exame-data-solicitacao"
                    name="dataSolicitacao"
                    type="date"
                    defaultValue={
                      dataHoje()
                    }
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Campo>

              <Campo>
                <Label htmlFor="exame-data-realizacao">
                  Data da realização
                </Label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9895]"
                  />

                  <input
                    id="exame-data-realizacao"
                    name="dataRealizacao"
                    type="date"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Campo>

              <Campo>
                <Label htmlFor="exame-data-resultado">
                  Data do resultado
                </Label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9895]"
                  />

                  <input
                    id="exame-data-resultado"
                    name="dataResultado"
                    type="date"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Campo>

              <Campo>
                <Label htmlFor="exame-atendimento">
                  Atendimento relacionado
                </Label>

                <input
                  id="exame-atendimento"
                  name="atendimentoId"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Opcional"
                  className={inputClass}
                />

                <p className="mt-1 text-[11px] font-medium text-[#8D9996]">
                  Pode ficar vazio quando o exame não estiver ligado diretamente a um atendimento.
                </p>
              </Campo>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Campo>
                <Label htmlFor="exame-resultado">
                  Resultado
                </Label>

                <textarea
                  id="exame-resultado"
                  name="resultado"
                  rows={6}
                  maxLength={10000}
                  placeholder="Digite o resultado ou laudo do exame..."
                  className={`${inputClass} min-h-[150px] resize-y`}
                />
              </Campo>

              <Campo>
                <Label htmlFor="exame-observacoes">
                  Observações
                </Label>

                <textarea
                  id="exame-observacoes"
                  name="observacoes"
                  rows={6}
                  maxLength={5000}
                  placeholder="Observações adicionais..."
                  className={`${inputClass} min-h-[150px] resize-y`}
                />
              </Campo>
            </div>

            {estado.mensagem && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                  estado.ok
                    ? "border-[#CDE4D7] bg-[#EDF7F1] text-[#397057]"
                    : "border-[#F0CDCF] bg-[#FFF1F2] text-[#A8444D]"
                }`}
              >
                {estado.mensagem}
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setAberto(false)
                }
                disabled={pending}
                className="rounded-xl border border-[#DCE4E1] bg-white px-5 py-2.5 text-sm font-bold text-[#5C6B67] transition hover:bg-[#F6F8F7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={pending}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#EB5965] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#DA4E5A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />

                {pending
                  ? "Salvando..."
                  : "Salvar exame"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#DCE4E1] bg-[#F9FBFA] px-3 py-2.5 text-sm font-semibold text-[#34423F] outline-none transition placeholder:font-medium placeholder:text-[#A0AAA7] focus:border-[#EB5965] focus:bg-white focus:ring-2 focus:ring-[#EB5965]/10";

function Campo({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      {children}
    </div>
  );
}

function Label({
  htmlFor,
  children,
  obrigatorio = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  obrigatorio?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#667773]"
    >
      {children}

      {obrigatorio && (
        <span className="ml-1 text-[#D8505B]">
          *
        </span>
      )}
    </label>
  );
}