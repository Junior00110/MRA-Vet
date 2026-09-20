"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileImage,
  FileText,
  FlaskConical,
  Loader2,
  Paperclip,
  Search,
  Save,
  Upload,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  adicionarExamePaciente,
  type EstadoExame,
} from "@/app/actions/paciente-exames";

type PacienteExameFormProps = {
  pacienteId: number;
  pacienteNome: string;
};

type ExameOpcao = {
  nome: string;
  categoria: string;
};

type ArquivoNovoExame = {
  id: string;
  arquivo: File;
  erro?: string;
};

const estadoInicial: EstadoExame = {
  ok: false,
  mensagem: "",
};

const TAMANHO_MAXIMO =
  25 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const EXAMES: ExameOpcao[] = [
  { nome: "Hemograma completo", categoria: "Hematologia" },
  { nome: "Hematócrito", categoria: "Hematologia" },
  { nome: "Contagem de plaquetas", categoria: "Hematologia" },
  { nome: "Reticulócitos", categoria: "Hematologia" },
  { nome: "Esfregaço sanguíneo", categoria: "Hematologia" },

  { nome: "Perfil bioquímico completo", categoria: "Bioquímica" },
  { nome: "Glicemia", categoria: "Bioquímica" },
  { nome: "Ureia", categoria: "Bioquímica" },
  { nome: "Creatinina", categoria: "Bioquímica" },
  { nome: "ALT (TGP)", categoria: "Bioquímica" },
  { nome: "AST (TGO)", categoria: "Bioquímica" },
  { nome: "Fosfatase alcalina", categoria: "Bioquímica" },
  { nome: "GGT", categoria: "Bioquímica" },
  { nome: "Bilirrubina total", categoria: "Bioquímica" },
  { nome: "Bilirrubina direta e indireta", categoria: "Bioquímica" },
  { nome: "Proteínas totais", categoria: "Bioquímica" },
  { nome: "Albumina", categoria: "Bioquímica" },
  { nome: "Globulinas", categoria: "Bioquímica" },
  { nome: "Colesterol", categoria: "Bioquímica" },
  { nome: "Triglicerídeos", categoria: "Bioquímica" },
  { nome: "Amilase", categoria: "Bioquímica" },
  { nome: "Lipase", categoria: "Bioquímica" },
  { nome: "Fósforo", categoria: "Bioquímica" },
  { nome: "Cálcio total", categoria: "Bioquímica" },
  { nome: "Cálcio ionizado", categoria: "Bioquímica" },
  { nome: "Sódio", categoria: "Bioquímica" },
  { nome: "Potássio", categoria: "Bioquímica" },
  { nome: "Cloro", categoria: "Bioquímica" },

  { nome: "Urinálise", categoria: "Urinálise" },
  { nome: "Urina tipo I", categoria: "Urinálise" },
  { nome: "Relação proteína/creatinina urinária (RPCU)", categoria: "Urinálise" },
  { nome: "Urocultura", categoria: "Urinálise" },
  { nome: "Antibiograma urinário", categoria: "Urinálise" },

  { nome: "Exame parasitológico de fezes", categoria: "Parasitologia" },
  { nome: "Coproparasitológico", categoria: "Parasitologia" },
  { nome: "Pesquisa de Giardia", categoria: "Parasitologia" },
  { nome: "Pesquisa de hemoparasitas", categoria: "Parasitologia" },

  { nome: "Teste rápido FIV/FeLV", categoria: "Infectologia" },
  { nome: "PCR para FIV", categoria: "Infectologia" },
  { nome: "PCR para FeLV", categoria: "Infectologia" },
  { nome: "Teste para cinomose", categoria: "Infectologia" },
  { nome: "PCR para cinomose", categoria: "Infectologia" },
  { nome: "Teste para parvovirose", categoria: "Infectologia" },
  { nome: "PCR para parvovirose", categoria: "Infectologia" },
  { nome: "Teste para erliquiose", categoria: "Infectologia" },
  { nome: "Teste para anaplasmose", categoria: "Infectologia" },
  { nome: "Teste para leishmaniose", categoria: "Infectologia" },
  { nome: "Sorologia para leishmaniose", categoria: "Infectologia" },
  { nome: "PCR para leishmaniose", categoria: "Infectologia" },
  { nome: "Teste para dirofilariose", categoria: "Infectologia" },
  { nome: "Teste para toxoplasmose", categoria: "Infectologia" },

  { nome: "Ultrassonografia abdominal", categoria: "Diagnóstico por imagem" },
  { nome: "Ultrassonografia gestacional", categoria: "Diagnóstico por imagem" },
  { nome: "Ultrassonografia cervical", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia de tórax", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia abdominal", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia de coluna", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia de membro torácico", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia de membro pélvico", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia de pelve", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia de crânio", categoria: "Diagnóstico por imagem" },
  { nome: "Radiografia odontológica", categoria: "Diagnóstico por imagem" },
  { nome: "Tomografia computadorizada", categoria: "Diagnóstico por imagem" },
  { nome: "Ressonância magnética", categoria: "Diagnóstico por imagem" },

  { nome: "Ecocardiograma", categoria: "Cardiologia" },
  { nome: "Ecocardiograma com Doppler", categoria: "Cardiologia" },
  { nome: "Eletrocardiograma", categoria: "Cardiologia" },
  { nome: "Holter", categoria: "Cardiologia" },
  { nome: "Aferição de pressão arterial", categoria: "Cardiologia" },
  { nome: "Troponina cardíaca", categoria: "Cardiologia" },

  { nome: "T4 total", categoria: "Endocrinologia" },
  { nome: "T4 livre", categoria: "Endocrinologia" },
  { nome: "TSH", categoria: "Endocrinologia" },
  { nome: "Cortisol", categoria: "Endocrinologia" },
  { nome: "Teste de estimulação com ACTH", categoria: "Endocrinologia" },
  { nome: "Teste de supressão com dexametasona", categoria: "Endocrinologia" },
  { nome: "Frutosamina", categoria: "Endocrinologia" },
  { nome: "Insulina", categoria: "Endocrinologia" },

  { nome: "Lipase pancreática específica canina (cPL)", categoria: "Gastroenterologia" },
  { nome: "Lipase pancreática específica felina (fPL)", categoria: "Gastroenterologia" },
  { nome: "TLI", categoria: "Gastroenterologia" },
  { nome: "Vitamina B12", categoria: "Gastroenterologia" },
  { nome: "Ácido fólico", categoria: "Gastroenterologia" },

  { nome: "Tempo de protrombina (TP)", categoria: "Coagulação" },
  { nome: "Tempo de tromboplastina parcial ativada (TTPA)", categoria: "Coagulação" },
  { nome: "Coagulograma", categoria: "Coagulação" },
  { nome: "D-dímero", categoria: "Coagulação" },

  { nome: "Citologia aspirativa", categoria: "Citologia" },
  { nome: "Citologia de pele", categoria: "Citologia" },
  { nome: "Citologia de ouvido", categoria: "Citologia" },
  { nome: "Citologia vaginal", categoria: "Citologia" },
  { nome: "Histopatológico", categoria: "Patologia" },
  { nome: "Biópsia", categoria: "Patologia" },
  { nome: "Imuno-histoquímica", categoria: "Patologia" },

  { nome: "Cultura bacteriana", categoria: "Microbiologia" },
  { nome: "Cultura fúngica", categoria: "Microbiologia" },
  { nome: "Antibiograma", categoria: "Microbiologia" },

  { nome: "Raspado de pele", categoria: "Dermatologia" },
  { nome: "Tricograma", categoria: "Dermatologia" },
  { nome: "Lâmpada de Wood", categoria: "Dermatologia" },
  { nome: "Teste intradérmico", categoria: "Dermatologia" },

  { nome: "Teste de Schirmer", categoria: "Oftalmologia" },
  { nome: "Teste de fluoresceína", categoria: "Oftalmologia" },
  { nome: "Tonometria", categoria: "Oftalmologia" },
  { nome: "Fundoscopia", categoria: "Oftalmologia" },
  { nome: "Ultrassonografia ocular", categoria: "Oftalmologia" },
  { nome: "Eletrorretinografia", categoria: "Oftalmologia" },

  { nome: "Análise de líquido cefalorraquidiano", categoria: "Neurologia" },
  { nome: "Eletromiografia", categoria: "Neurologia" },

  { nome: "Espermograma", categoria: "Reprodução" },
  { nome: "Dosagem de progesterona", categoria: "Reprodução" },
  { nome: "Citologia vaginal para ciclo estral", categoria: "Reprodução" },

  { nome: "Gasometria", categoria: "Outros" },
  { nome: "Lactato", categoria: "Outros" },
  { nome: "Proteína C reativa", categoria: "Outros" },
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

function formatarTamanho(
  bytes: number,
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb =
    bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(
      1,
    )} KB`;
  }

  return `${(
    kb / 1024
  ).toFixed(1)} MB`;
}

function validarArquivo(
  arquivo: File,
) {
  if (
    arquivo.size <= 0
  ) {
    return "Arquivo vazio.";
  }

  if (
    arquivo.size >
    TAMANHO_MAXIMO
  ) {
    return "O arquivo ultrapassa 25 MB.";
  }

  if (
    arquivo.type &&
    !TIPOS_PERMITIDOS.includes(
      arquivo.type,
    )
  ) {
    return "Formato não permitido.";
  }

  return null;
}

export default function PacienteExameForm({
  pacienteId,
  pacienteNome,
}: PacienteExameFormProps) {
  const router =
    useRouter();

  const [aberto, setAberto] =
    useState(false);

  const [status, setStatus] =
    useState("SOLICITADO");

  const [nomeExame, setNomeExame] =
    useState("");

  const [tipoExame, setTipoExame] =
    useState("");

  const [
    listaAberta,
    setListaAberta,
  ] = useState(false);

  const [
    anexosSelecionados,
    setAnexosSelecionados,
  ] = useState<
    ArquivoNovoExame[]
  >([]);

  const [
    arrastando,
    setArrastando,
  ] = useState(false);

  const [
    enviandoAnexos,
    setEnviandoAnexos,
  ] = useState(false);

  const [
    falhasAnexos,
    setFalhasAnexos,
  ] = useState<string[]>(
    [],
  );

  const [
    exameSalvoId,
    setExameSalvoId,
  ] = useState<
    number | null
  >(null);

  const botaoAbrirRef =
    useRef<HTMLButtonElement>(
      null,
    );

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

  const campoExameInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const inputAnexosRef =
    useRef<HTMLInputElement>(
      null,
    );

  const ultimoExameProcessadoRef =
    useRef<number | null>(
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

  const temAnexoInvalido =
    anexosSelecionados.some(
      (item) =>
        Boolean(
          item.erro,
        ),
    );

  const bloqueado =
    pending ||
    enviandoAnexos ||
    exameSalvoId !== null;

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

  function resetarFormulario() {
    formRef.current?.reset();

    setStatus(
      "SOLICITADO",
    );

    setNomeExame("");

    setTipoExame("");

    setListaAberta(false);

    setAnexosSelecionados(
      [],
    );

    setFalhasAnexos(
      [],
    );

    setExameSalvoId(
      null,
    );
  }

  function fecharFormulario() {
    if (
      pending ||
      enviandoAnexos
    ) {
      return;
    }

    resetarFormulario();
    setAberto(false);

    requestAnimationFrame(() => {
      botaoAbrirRef.current?.focus();
    });
  }

  async function enviarAnexosDoExame(
    exameId: number,
  ) {
    const anexosValidos =
      anexosSelecionados.filter(
        (item) =>
          !item.erro,
      );

    if (
      anexosValidos.length ===
      0
    ) {
      resetarFormulario();
      setAberto(false);
      router.refresh();
      return;
    }

    setExameSalvoId(
      exameId,
    );

    setEnviandoAnexos(
      true,
    );

    setFalhasAnexos(
      [],
    );

    const falhas:
      string[] = [];

    for (
      const item of
      anexosValidos
    ) {
      const formData =
        new FormData();

      formData.set(
        "pacienteId",
        String(
          pacienteId,
        ),
      );

      formData.set(
        "arquivo",
        item.arquivo,
      );

      try {
        const resposta =
          await fetch(
            `/api/paciente-exames/${exameId}/anexos`,
            {
              method:
                "POST",
              body:
                formData,
            },
          );

        const dados =
          (await resposta.json()) as {
            ok?: boolean;
            mensagem?: string;
          };

        if (
          !resposta.ok ||
          !dados.ok
        ) {
          falhas.push(
            `${item.arquivo.name}: ${
              dados.mensagem ||
              "falha no envio"
            }`,
          );
        }
      } catch {
        falhas.push(
          `${item.arquivo.name}: falha de comunicação`,
        );
      }
    }

    setEnviandoAnexos(
      false,
    );

    router.refresh();

    if (
      falhas.length >
      0
    ) {
      setFalhasAnexos(
        falhas,
      );

      return;
    }

    resetarFormulario();
    setAberto(false);
  }

  useEffect(() => {
    if (
      !estado.ok ||
      !estado.exameId
    ) {
      return;
    }

    if (
      ultimoExameProcessadoRef.current ===
      estado.exameId
    ) {
      return;
    }

    ultimoExameProcessadoRef.current =
      estado.exameId;

    void enviarAnexosDoExame(
      estado.exameId,
    );
  }, [
    estado,
  ]);

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

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function tratarEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (listaAberta) {
        event.preventDefault();
        setListaAberta(false);
        return;
      }

      if (pending || enviandoAnexos) {
        return;
      }

      event.preventDefault();
      fecharFormulario();
    }

    document.addEventListener("keydown", tratarEscape);

    return () => {
      document.removeEventListener("keydown", tratarEscape);
    };
  }, [
    aberto,
    listaAberta,
    pending,
    enviandoAnexos,
  ]);

  function abrirFormulario() {
    setAberto(true);

    requestAnimationFrame(() => {
      campoExameInputRef.current?.focus();
    });

    setTimeout(() => {
      painelRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",
          block:
            "start",
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

    setTipoExame(
      exame.categoria,
    );

    setListaAberta(false);
  }

  function adicionarArquivos(
    lista:
      | FileList
      | File[],
  ) {
    const novos =
      Array.from(
        lista,
      ).map(
        (
          arquivo,
          indice,
        ): ArquivoNovoExame => ({
          id: [
            arquivo.name,
            arquivo.size,
            arquivo.lastModified,
            indice,
            crypto.randomUUID(),
          ].join("-"),

          arquivo,

          erro:
            validarArquivo(
              arquivo,
            ) ??
            undefined,
        }),
      );

    setAnexosSelecionados(
      (atuais) => [
        ...atuais,
        ...novos,
      ],
    );
  }

  function selecionarArquivos(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    if (
      !event.target.files
    ) {
      return;
    }

    adicionarArquivos(
      event.target.files,
    );

    event.target.value =
      "";
  }

  function soltarArquivos(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setArrastando(
      false,
    );

    if (
      bloqueado ||
      event.dataTransfer.files
        .length === 0
    ) {
      return;
    }

    adicionarArquivos(
      event.dataTransfer.files,
    );
  }

  function removerArquivo(
    id: string,
  ) {
    if (bloqueado) {
      return;
    }

    setAnexosSelecionados(
      (atuais) =>
        atuais.filter(
          (item) =>
            item.id !== id,
        ),
    );
  }

  return (
    <>
      <button
        ref={botaoAbrirRef}
        type="button"
        onClick={
          aberto
            ? fecharFormulario
            : abrirFormulario
        }
        className="group relative flex min-h-[96px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#EB5965] bg-[#EB5965] px-3 py-4 text-center text-white shadow-sm transition hover:bg-[#DA4E5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5965] focus-visible:ring-offset-2"
        aria-expanded={
          aberto
        }
        aria-controls={`formulario-exame-${pacienteId}`}
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
          id={`formulario-exame-${pacienteId}`}
          ref={
            painelRef
          }
          role="region"
          aria-labelledby={`titulo-formulario-exame-${pacienteId}`}
          className="col-span-full scroll-mt-6 rounded-[24px] border border-[#E4D8D9] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-3 border-b border-[#ECE5E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B64C57]">
                Prontuário clínico
              </p>

              <h3
                id={`titulo-formulario-exame-${pacienteId}`}
                className="mt-1 text-lg font-black text-[#24343A]"
              >
                Registrar exame
              </h3>

              <p className="mt-1 text-sm font-medium text-[#7D8A87]">
                Paciente:{" "}
                <span className="font-bold text-[#495754]">
                  {
                    pacienteNome
                  }
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={
                fecharFormulario
              }
              disabled={
                pending ||
                enviandoAnexos
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E1E7E5] bg-[#F7F9F8] text-[#64736F] transition hover:bg-[#EEF2F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Fechar formulário de exame"
            >
              <X
                size={17}
              />
            </button>
          </div>

          <form
            ref={
              formRef
            }
            action={
              formAction
            }
            aria-busy={
              pending ||
              enviandoAnexos
            }
            className="mt-5"
          >
            <input
              type="hidden"
              name="pacienteId"
              value={
                pacienteId
              }
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
                  ref={
                    campoExameRef
                  }
                  className="relative"
                >
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9895]"
                    />

                    <input
                      ref={campoExameInputRef}
                      id="exame-nome"
                      name="nome"
                      type="text"
                      required
                      maxLength={200}
                      autoComplete="off"
                      disabled={
                        bloqueado
                      }
                      value={
                        nomeExame
                      }
                      onFocus={() =>
                        setListaAberta(
                          true,
                        )
                      }
                      onChange={(
                        event,
                      ) => {
                        setNomeExame(
                          event
                            .target
                            .value,
                        );

                        setListaAberta(
                          true,
                        );
                      }}
                      placeholder="Pesquisar exame..."
                      role="combobox"
                      aria-expanded={listaAberta && !bloqueado}
                      aria-controls={`lista-exames-${pacienteId}`}
                      aria-autocomplete="list"
                      aria-describedby={`ajuda-exame-${pacienteId}`}
                      className={`${inputClass} pl-10 pr-10`}
                    />

                    <button
                      type="button"
                      disabled={
                        bloqueado
                      }
                      onClick={() =>
                        setListaAberta(
                          (
                            atual,
                          ) =>
                            !atual,
                        )
                      }
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#758480] hover:bg-[#EDF1EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] disabled:opacity-50"
                      aria-label={
                        listaAberta
                          ? "Fechar lista de exames"
                          : "Abrir lista de exames"
                      }
                      aria-expanded={listaAberta && !bloqueado}
                      aria-controls={`lista-exames-${pacienteId}`}
                    >
                      <ChevronDown
                        size={16}
                      />
                    </button>
                  </div>

                  {listaAberta &&
                    !bloqueado && (
                    <div
                      id={`lista-exames-${pacienteId}`}
                      role="listbox"
                      aria-label="Exames encontrados"
                      className="absolute left-0 right-0 z-50 mt-2 max-h-[360px] overflow-y-auto rounded-2xl border border-[#DCE4E1] bg-white p-2 shadow-xl"
                    >
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
                                      role="option"
                                      aria-selected={nomeExame === exame.nome}
                                      onClick={() =>
                                        selecionarExame(
                                          exame,
                                        )
                                      }
                                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FFF1F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5965]/30"
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

                <p
                  id={`ajuda-exame-${pacienteId}`}
                  className="mt-1 text-[11px] font-medium text-[#8D9996]"
                >
                  Pesquise pelo nome ou pela categoria. Se o exame não existir na lista, você pode digitá-lo normalmente.
                </p>
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-tipo"
                >
                  Tipo / categoria
                </Label>

                <input
                  id="exame-tipo"
                  name="tipo"
                  type="text"
                  maxLength={150}
                  disabled={
                    bloqueado
                  }
                  value={
                    tipoExame
                  }
                  onChange={(
                    event,
                  ) =>
                    setTipoExame(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Ex.: Laboratorial, imagem..."
                  className={
                    inputClass
                  }
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
                  value={
                    status
                  }
                  disabled={
                    bloqueado
                  }
                  onChange={(
                    event,
                  ) =>
                    setStatus(
                      event
                        .target
                        .value,
                    )
                  }
                  required
                  className={
                    inputClass
                  }
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
                <Label
                  htmlFor="exame-laboratorio"
                >
                  Laboratório
                </Label>

                <input
                  id="exame-laboratorio"
                  name="laboratorio"
                  type="text"
                  maxLength={200}
                  disabled={
                    bloqueado
                  }
                  placeholder="Nome do laboratório"
                  className={
                    inputClass
                  }
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
                    disabled={
                      bloqueado
                    }
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-data-realizacao"
                >
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
                    disabled={
                      bloqueado
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-data-resultado"
                >
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
                    disabled={
                      bloqueado
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-atendimento"
                >
                  Atendimento relacionado
                </Label>

                <input
                  id="exame-atendimento"
                  name="atendimentoId"
                  type="number"
                  min={1}
                  step={1}
                  disabled={
                    bloqueado
                  }
                  placeholder="Opcional"
                  className={
                    inputClass
                  }
                />

                <p className="mt-1 text-[11px] font-medium text-[#8D9996]">
                  Pode ficar vazio quando o exame não estiver ligado diretamente a um atendimento.
                </p>
              </Campo>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Campo>
                <Label
                  htmlFor="exame-resultado"
                >
                  Resultado
                </Label>

                <textarea
                  id="exame-resultado"
                  name="resultado"
                  rows={6}
                  maxLength={10000}
                  disabled={
                    bloqueado
                  }
                  placeholder="Digite o resultado ou laudo do exame..."
                  className={`${inputClass} min-h-[150px] resize-y`}
                />
              </Campo>

              <Campo>
                <Label
                  htmlFor="exame-observacoes"
                >
                  Observações
                </Label>

                <textarea
                  id="exame-observacoes"
                  name="observacoes"
                  rows={6}
                  maxLength={5000}
                  disabled={
                    bloqueado
                  }
                  placeholder="Observações adicionais..."
                  className={`${inputClass} min-h-[150px] resize-y`}
                />
              </Campo>
            </div>

            <section
              aria-labelledby={`titulo-anexos-novo-exame-${pacienteId}`}
              className="mt-4 rounded-2xl border border-[#DDE6E2] bg-[#FBFCFA] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F1] text-[#55786D]">
                  <Paperclip
                    size={19}
                  />
                </span>

                <div>
                  <h4
                    id={`titulo-anexos-novo-exame-${pacienteId}`}
                    className="text-sm font-black text-[#34423F]"
                  >
                    Anexos do exame
                  </h4>

                  <p className="mt-1 text-xs font-medium leading-relaxed text-[#71807C]">
                    Você pode selecionar os laudos, PDFs ou imagens agora. Os arquivos serão enviados logo após a criação do exame.
                  </p>
                </div>
              </div>

              <input
                ref={
                  inputAnexosRef
                }
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={
                  selecionarArquivos
                }
                disabled={
                  bloqueado
                }
                className="sr-only"
                aria-label="Selecionar anexos do exame"
              />

              <div
                role="button"
                tabIndex={
                  bloqueado
                    ? -1
                    : 0
                }
                aria-disabled={
                  bloqueado
                }
                onClick={() => {
                  if (
                    !bloqueado
                  ) {
                    inputAnexosRef.current?.click();
                  }
                }}
                onKeyDown={(
                  event,
                ) => {
                  if (
                    bloqueado
                  ) {
                    return;
                  }

                  if (
                    event.key ===
                      "Enter" ||
                    event.key ===
                      " "
                  ) {
                    event.preventDefault();

                    inputAnexosRef.current?.click();
                  }
                }}
                onDragEnter={(
                  event,
                ) => {
                  event.preventDefault();

                  if (
                    !bloqueado
                  ) {
                    setArrastando(
                      true,
                    );
                  }
                }}
                onDragOver={(
                  event,
                ) => {
                  event.preventDefault();

                  if (
                    !bloqueado
                  ) {
                    setArrastando(
                      true,
                    );
                  }
                }}
                onDragLeave={() =>
                  setArrastando(
                    false,
                  )
                }
                onDrop={
                  soltarArquivos
                }
                className={`mt-4 cursor-pointer rounded-2xl border-2 border-dashed px-4 py-6 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-[#7FA89A] focus-visible:ring-offset-2 ${
                  arrastando
                    ? "border-[#7FA89A] bg-[#EDF5F2]"
                    : "border-[#C9D7D2] bg-white hover:border-[#9BB7AE] hover:bg-[#F8FBF9]"
                } ${
                  bloqueado
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <Upload
                  size={25}
                  className="mx-auto text-[#6E9387]"
                />

                <p className="mt-2 text-sm font-black text-[#40514C]">
                  Adicionar arquivos
                </p>

                <p className="mt-1 text-xs font-medium text-[#778682]">
                  Arraste aqui ou clique para selecionar
                </p>

                <p className="mt-3 text-[11px] font-bold text-[#8A9692]">
                  PDF, JPG, PNG ou WEBP • máximo de 25 MB por arquivo
                </p>
              </div>

              {anexosSelecionados.length >
                0 && (
                <div className="mt-4 space-y-2">
                  {anexosSelecionados.map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item.id
                        }
                        className="flex items-start gap-3 rounded-xl border border-[#E0E7E4] bg-white p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F4F2] text-[#607C73]">
                          {item.arquivo.type.startsWith(
                            "image/",
                          ) ? (
                            <FileImage
                              size={18}
                            />
                          ) : (
                            <FileText
                              size={18}
                            />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#34423F]">
                            {
                              item
                                .arquivo
                                .name
                            }
                          </p>

                          <p className="mt-0.5 text-xs font-medium text-[#82908C]">
                            {formatarTamanho(
                              item
                                .arquivo
                                .size,
                            )}
                          </p>

                          {item.erro ? (
                            <p
                              role="alert"
                              className="mt-1 text-xs font-bold text-[#B44A54]"
                            >
                              {
                                item.erro
                              }
                            </p>
                          ) : (
                            <p className="mt-1 text-xs font-semibold text-[#397057]">
                              Pronto para enviar
                            </p>
                          )}
                        </div>

                        {!bloqueado && (
                          <button
                            type="button"
                            onClick={() =>
                              removerArquivo(
                                item.id,
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#71807C] transition hover:bg-[#F1F4F3] hover:text-[#B44A54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A]"
                            aria-label={`Remover ${item.arquivo.name}`}
                          >
                            <X
                              size={15}
                            />
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {temAnexoInvalido &&
                !exameSalvoId && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-xl border border-[#F0CDCF] bg-[#FFF1F2] px-4 py-3 text-sm font-bold text-[#A8444D]"
                >
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    Remova ou substitua os anexos inválidos antes de salvar o exame.
                  </span>
                </div>
              )}

              {enviandoAnexos && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-[#D5E6DF] bg-[#F0F7F4] px-4 py-3 text-sm font-bold text-[#496D62]"
                >
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Exame criado. Enviando anexos...
                </div>
              )}
            </section>

            {estado.mensagem &&
              !falhasAnexos.length && (
              <div
                role={
                  estado.ok
                    ? "status"
                    : "alert"
                }
                aria-live="polite"
                aria-atomic="true"
                className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                  estado.ok
                    ? "border-[#CDE4D7] bg-[#EDF7F1] text-[#397057]"
                    : "border-[#F0CDCF] bg-[#FFF1F2] text-[#A8444D]"
                }`}
              >
                {estado.ok && (
                  <CheckCircle2
                    size={17}
                    className="mr-2 inline"
                  />
                )}

                {
                  estado.mensagem
                }
              </div>
            )}

            {falhasAnexos.length >
              0 && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-[#F0CDCF] bg-[#FFF1F2] px-4 py-3 text-sm font-semibold text-[#A8444D]"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-black">
                      O exame foi salvo, mas alguns anexos não foram enviados.
                    </p>

                    <p className="mt-1 text-xs font-semibold">
                      Feche este formulário e adicione novamente esses arquivos pelo exame no histórico.
                    </p>

                    <ul className="mt-2 list-disc pl-5 text-xs">
                      {falhasAnexos.map(
                        (
                          falha,
                        ) => (
                          <li
                            key={
                              falha
                            }
                          >
                            {
                              falha
                            }
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  fecharFormulario
                }
                disabled={
                  pending ||
                  enviandoAnexos
                }
                className="rounded-xl border border-[#DCE4E1] bg-white px-5 py-2.5 text-sm font-bold text-[#5C6B67] transition hover:bg-[#F6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exameSalvoId
                  ? "Fechar"
                  : "Cancelar"}
              </button>

              {!exameSalvoId && (
                <button
                  type="submit"
                  disabled={
                    pending ||
                    enviandoAnexos ||
                    temAnexoInvalido
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#EB5965] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#DA4E5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5965] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ||
                  enviandoAnexos ? (
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
                    ? "Salvando exame..."
                    : enviandoAnexos
                      ? "Enviando anexos..."
                      : "Salvar exame"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#DCE4E1] bg-[#F9FBFA] px-3 py-2.5 text-sm font-semibold text-[#34423F] outline-none transition placeholder:font-medium placeholder:text-[#A0AAA7] hover:border-[#C7D4D0] focus:border-[#7FA89A] focus:bg-white focus:ring-2 focus:ring-[#7FA89A]/20 disabled:cursor-not-allowed disabled:bg-[#EEF2F0] disabled:text-[#84918D]";

function Campo({
  children,
}: {
  children:
    ReactNode;
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
  children:
    ReactNode;
  obrigatorio?: boolean;
}) {
  return (
    <label
      htmlFor={
        htmlFor
      }
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
