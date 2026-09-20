"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronUp,
  ClipboardPlus,
  Save,
  Stethoscope,
  X,
} from "lucide-react";

import {
  adicionarAtendimentoPaciente,
  type EstadoAtendimento,
} from "@/app/actions/paciente-atendimentos";

type PacienteAtendimentoFormProps = {
  pacienteId: number;
  pacienteNome: string;
};

type DadosAnamnese = {
  estadoGeral: string;

  pesoEstado: string;
  pesoDetalhe: string;

  apetite: string;
  apetiteDetalhe: string;

  ingestaoHidrica: string;
  ingestaoHidricaOutro: string;

  vomito: string;
  tipoVomito: string;

  fezes: string;
  fezesCaracteristica: string;

  vacinas: string[];
  outraVacina: string;
  vacinacaoStatus: string;
  vacinacaoDetalhe: string;

  vermifugacao: string;
  vermifugacaoDetalhe: string;

  ectoparasitas: string[];
  ectoparasitasOutro: string;
  prevencaoEctoparasitas: string;
  prevencaoEmDia: string;
  prevencaoProduto: string;

  contactante: string;
  contactanteDetalhe: string;

  moradia: string;

  comportamento: string;
  comportamentoDetalhe: string;

  miccao: string;
  coloracaoUrina: string;
  coloracaoUrinaDetalhe: string;

  castracao: string;
  castracaoDetalhe: string;

  secrecaoGenital: string;
  secrecaoGenitalDetalhe: string;

  pele: string;
  ouvidos: string;

  neurologico: string;
  neurologicoDetalhe: string;

  musculoEsqueletico: string;
  musculoEsqueleticoDetalhe: string;

  oftalmico: string;
  oftalmicoDetalhe: string;
};

type DadosExame = {
  hidratacao: string;
  mucosas: string;
  tpc: string;
  temperatura: string;
  fr: string;
  fc: string;
  ecc: string;
  linfonodos: string;
  cavidadeOral: string;
  palpacaoAbdominal: string;
  auscultaCardiopulmonar: string;
  peleAnexos: string;
  marcha: string;
  aprumos: string;
};

const estadoInicial: EstadoAtendimento = {
  ok: false,
  mensagem: "",
};

const anamneseInicial: DadosAnamnese = {
  estadoGeral: "",

  pesoEstado: "",
  pesoDetalhe: "",

  apetite: "",
  apetiteDetalhe: "",

  ingestaoHidrica: "",
  ingestaoHidricaOutro: "",

  vomito: "",
  tipoVomito: "",

  fezes: "",
  fezesCaracteristica: "",

  vacinas: [],
  outraVacina: "",
  vacinacaoStatus: "",
  vacinacaoDetalhe: "",

  vermifugacao: "",
  vermifugacaoDetalhe: "",

  ectoparasitas: [],
  ectoparasitasOutro: "",
  prevencaoEctoparasitas: "",
  prevencaoEmDia: "",
  prevencaoProduto: "",

  contactante: "",
  contactanteDetalhe: "",

  moradia: "",

  comportamento: "",
  comportamentoDetalhe: "",

  miccao: "",
  coloracaoUrina: "",
  coloracaoUrinaDetalhe: "",

  castracao: "",
  castracaoDetalhe: "",

  secrecaoGenital: "",
  secrecaoGenitalDetalhe: "",

  pele: "",
  ouvidos: "",

  neurologico: "",
  neurologicoDetalhe: "",

  musculoEsqueletico: "",
  musculoEsqueleticoDetalhe: "",

  oftalmico: "",
  oftalmicoDetalhe: "",
};

const exameInicial: DadosExame = {
  hidratacao: "",
  mucosas: "",
  tpc: "",
  temperatura: "",
  fr: "",
  fc: "",
  ecc: "",
  linfonodos: "",
  cavidadeOral: "",
  palpacaoAbdominal: "",
  auscultaCardiopulmonar: "",
  peleAnexos: "",
  marcha: "",
  aprumos: "",
};

export default function PacienteAtendimentoForm({
  pacienteId,
  pacienteNome,
}: PacienteAtendimentoFormProps) {
  const [aberto, setAberto] =
    useState(false);

  const [anamnese, setAnamnese] =
    useState<DadosAnamnese>(
      anamneseInicial,
    );

  const [exame, setExame] =
    useState<DadosExame>(
      exameInicial,
    );

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
    adicionarAtendimentoPaciente,
    estadoInicial,
  );

  const textoAnamnese =
    useMemo(
      () =>
        montarTextoAnamnese(
          anamnese,
        ),
      [anamnese],
    );

  const textoExame =
    useMemo(
      () =>
        montarTextoExame(
          exame,
        ),
      [exame],
    );

  useEffect(() => {
    if (
      !estado.ok ||
      !estado.requerPatologia ||
      !estado.atendimentoId
    ) {
      return;
    }

    // A patologia obrigatória é renderizada somente pela página
    // do paciente. Isso evita duas janelas idênticas sobrepostas.
    formRef.current?.reset();

    setAnamnese(
      anamneseInicial,
    );

    setExame(
      exameInicial,
    );

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
    if (!aberto) return;

    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !pending) {
        setAberto(false);
        requestAnimationFrame(() => botaoAbrirRef.current?.focus());
      }
    }

    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aberto, pending]);

  function atualizarAnamnese<
    K extends keyof DadosAnamnese,
  >(
    campo: K,
    valor: DadosAnamnese[K],
  ) {
    setAnamnese(
      (atual) => ({
        ...atual,
        [campo]: valor,
      }),
    );
  }

  function atualizarExame<
    K extends keyof DadosExame,
  >(
    campo: K,
    valor: DadosExame[K],
  ) {
    setExame(
      (atual) => ({
        ...atual,
        [campo]: valor,
      }),
    );
  }

  function alternarLista(
    campo:
      | "vacinas"
      | "ectoparasitas",
    valor: string,
  ) {
    setAnamnese(
      (atual) => {
        const lista =
          atual[campo];

        const existe =
          lista.includes(valor);

        return {
          ...atual,
          [campo]: existe
            ? lista.filter(
                (item) =>
                  item !== valor,
              )
            : [
                ...lista,
                valor,
              ],
        };
      },
    );
  }

  function abrirAtendimento() {
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
        ref={botaoAbrirRef}
        type="button"
        aria-expanded={aberto}
        aria-controls="painel-novo-atendimento"
        onClick={
          aberto
            ? () =>
                setAberto(false)
            : abrirAtendimento
        }
        className="group relative flex min-h-[96px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#3A8DDA] bg-[#3A8DDA] px-3 py-4 text-center text-white shadow-sm transition hover:bg-[#2F7FC8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3A8DDA]/30 focus-visible:ring-offset-2"
      >
        <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10" />

        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-sm">
          {aberto ? (
            <ChevronUp
              size={24}
            />
          ) : (
            <ClipboardPlus
              size={24}
            />
          )}
        </span>

        <span className="relative mt-2 text-xs font-bold">
          {aberto
            ? "Fechar atendimento"
            : "Atendimento"}
        </span>
      </button>

      {aberto && (
        <div
          id="painel-novo-atendimento"
          ref={painelRef}
          role="region"
          aria-labelledby="titulo-novo-atendimento"
          className="order-last col-span-full mt-2 scroll-mt-24 overflow-hidden rounded-[24px] border border-[#C9DCE5] bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DFE8E5] bg-gradient-to-r from-[#F1F7FA] to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3A8DDA] text-white shadow-sm">
                <Stethoscope
                  size={21}
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3A8DDA]">
                  Prontuário
                </p>

                <h2 id="titulo-novo-atendimento" className="text-xl font-black text-[#24343A]">
                  Novo atendimento
                </h2>

                <p className="mt-0.5 text-xs font-semibold text-[#82908D]">
                  Paciente:{" "}
                  <span className="text-[#52615E]">
                    {pacienteNome}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setAberto(false)
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-[#D7E1DE] bg-white px-3 text-xs font-bold text-[#657572] transition hover:bg-[#F4F7F5]"
            >
              <X size={16} />
              Fechar
            </button>
          </div>

          <form
            ref={formRef}
            action={formAction}
            className="p-4 sm:p-6"
          >
            <input
              type="hidden"
              name="pacienteId"
              value={pacienteId}
            />

            <input
              type="hidden"
              name="anamnese"
              value={textoAnamnese}
            />

            <input
              type="hidden"
              name="exameClinico"
              value={textoExame}
            />

            <div className="space-y-7">
              <CampoTextoLivre
                label="Motivo da consulta"
                name="motivoConsulta"
                placeholder="Ex.: vacinação, retorno, avaliação de rotina, vômito..."
                linhas={3}
              />

              <Secao
                numero="1"
                titulo="Anamnese"
              >
                <CampoTexto
                  label="Estado geral"
                  value={
                    anamnese.estadoGeral
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "estadoGeral",
                      valor,
                    )
                  }
                  placeholder="Descreva o estado geral do paciente..."
                />

                <GrupoOpcao
                  titulo="Peso"
                  valor={
                    anamnese.pesoEstado
                  }
                  opcoes={[
                    "Estável",
                    "Perda de peso",
                    "Ganho de peso",
                    "Não sabe",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "pesoEstado",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe do peso"
                  value={
                    anamnese.pesoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "pesoDetalhe",
                      valor,
                    )
                  }
                  placeholder="Peso atual, período da alteração ou outras informações..."
                />

                <GrupoOpcao
                  titulo="Apetite"
                  valor={
                    anamnese.apetite
                  }
                  opcoes={[
                    "Normal",
                    "Não sabe",
                    "Aumentado",
                    "Diminuído",
                    "Seletivo",
                    "Anorexia",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "apetite",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe da alimentação"
                  value={
                    anamnese.apetiteDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "apetiteDetalhe",
                      valor,
                    )
                  }
                  placeholder="Marca da ração, petiscos, frutas, alimentação natural..."
                />

                <GrupoOpcao
                  titulo="Ingestão hídrica"
                  valor={
                    anamnese.ingestaoHidrica
                  }
                  opcoes={[
                    "Normal",
                    "Não sabe",
                    "Aumentada",
                    "Diminuída",
                    "Não bebe",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "ingestaoHidrica",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Outro / detalhe da ingestão hídrica"
                  value={
                    anamnese.ingestaoHidricaOutro
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "ingestaoHidricaOutro",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Vômito"
                  valor={
                    anamnese.vomito
                  }
                  opcoes={[
                    "Não",
                    "Sim",
                    "Esporádico",
                    "Frequente",
                    "Regurgitação",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "vomito",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Tipo de vômito"
                  value={
                    anamnese.tipoVomito
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "tipoVomito",
                      valor,
                    )
                  }
                  placeholder="Conteúdo, coloração, frequência, relação com alimentação..."
                />

                <GrupoOpcao
                  titulo="Fezes"
                  valor={
                    anamnese.fezes
                  }
                  opcoes={[
                    "Normal",
                    "Pastosa",
                    "Diarreia",
                    "Ressecada",
                    "Tenesmo",
                    "Em fita",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "fezes",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Características das fezes"
                  value={
                    anamnese.fezesCaracteristica
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "fezesCaracteristica",
                      valor,
                    )
                  }
                  placeholder="Muco, cor, sangue ou outras alterações..."
                />

                <Subtitulo titulo="Vacinação" />

                <GrupoMultiplo
                  titulo="Vacinas / produtos realizados"
                  valores={
                    anamnese.vacinas
                  }
                  opcoes={[
                    "Múltipla – Cães",
                    "Múltipla – Gatos",
                    "Antirrábica",
                    "Gripe",
                    "Giárdia",
                    "ProHeart",
                    "Outra",
                  ]}
                  onChange={(valor) =>
                    alternarLista(
                      "vacinas",
                      valor,
                    )
                  }
                />

                {anamnese.vacinas.includes(
                  "Outra",
                ) && (
                  <CampoTexto
                    label="Outra vacina / produto"
                    value={
                      anamnese.outraVacina
                    }
                    onChange={(valor) =>
                      atualizarAnamnese(
                        "outraVacina",
                        valor,
                      )
                    }
                    placeholder="Informe o nome da vacina ou produto..."
                  />
                )}

                <GrupoOpcao
                  titulo="Situação da vacinação"
                  valor={
                    anamnese.vacinacaoStatus
                  }
                  opcoes={[
                    "Em dia",
                    "Atrasada",
                    "Não faz",
                    "Não sabe",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "vacinacaoStatus",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe da vacinação"
                  value={
                    anamnese.vacinacaoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "vacinacaoDetalhe",
                      valor,
                    )
                  }
                  placeholder="Datas, fabricante, lote, observações ou outras informações..."
                />

                <GrupoOpcao
                  titulo="Vermifugação"
                  valor={
                    anamnese.vermifugacao
                  }
                  opcoes={[
                    "Em dia",
                    "Atrasada",
                    "Não faz",
                    "Não sabe",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "vermifugacao",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe da vermifugação"
                  value={
                    anamnese.vermifugacaoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "vermifugacaoDetalhe",
                      valor,
                    )
                  }
                  placeholder="Marca, produto e frequência..."
                />

                <GrupoMultiplo
                  titulo="Ectoparasitas"
                  valores={
                    anamnese.ectoparasitas
                  }
                  opcoes={[
                    "Não",
                    "Pulga",
                    "Carrapato",
                    "Outro",
                  ]}
                  onChange={(valor) =>
                    alternarLista(
                      "ectoparasitas",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Outro ectoparasita"
                  value={
                    anamnese.ectoparasitasOutro
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "ectoparasitasOutro",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Faz prevenção contra ectoparasitas?"
                  valor={
                    anamnese.prevencaoEctoparasitas
                  }
                  opcoes={[
                    "Sim",
                    "Não",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "prevencaoEctoparasitas",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Prevenção está em dia?"
                  valor={
                    anamnese.prevencaoEmDia
                  }
                  opcoes={[
                    "Sim",
                    "Não",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "prevencaoEmDia",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Produto utilizado"
                  value={
                    anamnese.prevencaoProduto
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "prevencaoProduto",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Possui contactante?"
                  valor={
                    anamnese.contactante
                  }
                  opcoes={[
                    "Não",
                    "Sim",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "contactante",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe dos contactantes"
                  value={
                    anamnese.contactanteDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "contactanteDetalhe",
                      valor,
                    )
                  }
                  placeholder="Espécie, quantidade, condições clínicas..."
                />

                <GrupoOpcao
                  titulo="Tipo de moradia"
                  valor={
                    anamnese.moradia
                  }
                  opcoes={[
                    "Casa",
                    "Apartamento",
                    "Sítio",
                    "Outro",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "moradia",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Comportamento"
                  valor={
                    anamnese.comportamento
                  }
                  opcoes={[
                    "Normal",
                    "Anormal",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "comportamento",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe do comportamento"
                  value={
                    anamnese.comportamentoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "comportamentoDetalhe",
                      valor,
                    )
                  }
                />

                <Subtitulo titulo="Sistema gênito-urinário" />

                <GrupoOpcao
                  titulo="Micção"
                  valor={
                    anamnese.miccao
                  }
                  opcoes={[
                    "Normal",
                    "Diminuída",
                    "Aumentada",
                    "Não sabe",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "miccao",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Coloração da urina"
                  valor={
                    anamnese.coloracaoUrina
                  }
                  opcoes={[
                    "Amarela",
                    "Transparente",
                    "Vermelha",
                    "Marrom",
                    "Não sabe",
                    "Outra",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "coloracaoUrina",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Outro / detalhe da urina"
                  value={
                    anamnese.coloracaoUrinaDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "coloracaoUrinaDetalhe",
                      valor,
                    )
                  }
                />

                <GrupoOpcao
                  titulo="Castração"
                  valor={
                    anamnese.castracao
                  }
                  opcoes={[
                    "Sim",
                    "Não",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "castracao",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe da castração"
                  value={
                    anamnese.castracaoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "castracaoDetalhe",
                      valor,
                    )
                  }
                  placeholder="Idade da castração, intercorrências..."
                />

                <GrupoOpcao
                  titulo="Secreção vaginal / peniana"
                  valor={
                    anamnese.secrecaoGenital
                  }
                  opcoes={[
                    "Sim",
                    "Não",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "secrecaoGenital",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe da secreção"
                  value={
                    anamnese.secrecaoGenitalDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "secrecaoGenitalDetalhe",
                      valor,
                    )
                  }
                />

                <Subtitulo titulo="Sistema tegumentar" />

                <CampoTexto
                  label="Pele"
                  value={
                    anamnese.pele
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "pele",
                      valor,
                    )
                  }
                  placeholder="Sem alteração ou descreva lesões, prurido, alopecia..."
                />

                <CampoTexto
                  label="Ouvidos"
                  value={
                    anamnese.ouvidos
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "ouvidos",
                      valor,
                    )
                  }
                />

                <Subtitulo titulo="Sistema neurológico" />

                <GrupoOpcao
                  titulo="Estado neurológico"
                  valor={
                    anamnese.neurologico
                  }
                  opcoes={[
                    "Alerta",
                    "Deprimido",
                    "Estupor",
                    "Convulsão",
                    "Outro",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "neurologico",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe neurológico"
                  value={
                    anamnese.neurologicoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "neurologicoDetalhe",
                      valor,
                    )
                  }
                />

                <Subtitulo titulo="Sistema músculo-esquelético" />

                <GrupoOpcao
                  titulo="Avaliação"
                  valor={
                    anamnese.musculoEsqueletico
                  }
                  opcoes={[
                    "Sem alteração",
                    "Alterado",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "musculoEsqueletico",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe músculo-esquelético"
                  value={
                    anamnese.musculoEsqueleticoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "musculoEsqueleticoDetalhe",
                      valor,
                    )
                  }
                />

                <Subtitulo titulo="Sistema oftálmico" />

                <GrupoOpcao
                  titulo="Avaliação oftálmica"
                  valor={
                    anamnese.oftalmico
                  }
                  opcoes={[
                    "Sem alteração",
                    "Alterado",
                  ]}
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "oftalmico",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Detalhe oftálmico"
                  value={
                    anamnese.oftalmicoDetalhe
                  }
                  onChange={(valor) =>
                    atualizarAnamnese(
                      "oftalmicoDetalhe",
                      valor,
                    )
                  }
                />
              </Secao>

              <Secao
                numero="2"
                titulo="Exame físico"
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <CampoCurto
                    label="Hidratação"
                    value={
                      exame.hidratacao
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "hidratacao",
                        valor,
                      )
                    }
                  />

                  <CampoCurto
                    label="Mucosas"
                    value={
                      exame.mucosas
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "mucosas",
                        valor,
                      )
                    }
                  />

                  <CampoCurto
                    label="TPC"
                    value={
                      exame.tpc
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "tpc",
                        valor,
                      )
                    }
                    placeholder="Ex.: 2 s"
                  />

                  <CampoCurto
                    label="Temperatura °C"
                    value={
                      exame.temperatura
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "temperatura",
                        valor,
                      )
                    }
                    placeholder="Ex.: 38,5"
                  />

                  <CampoCurto
                    label="FR mpm"
                    value={
                      exame.fr
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "fr",
                        valor,
                      )
                    }
                  />

                  <CampoCurto
                    label="FC bpm"
                    value={
                      exame.fc
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "fc",
                        valor,
                      )
                    }
                  />

                  <CampoCurto
                    label="ECC (1/9)"
                    value={
                      exame.ecc
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "ecc",
                        valor,
                      )
                    }
                    placeholder="Ex.: 5"
                  />

                  <CampoCurto
                    label="Linfonodos"
                    value={
                      exame.linfonodos
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "linfonodos",
                        valor,
                      )
                    }
                  />
                </div>

                <CampoTexto
                  label="Cavidade oral"
                  value={
                    exame.cavidadeOral
                  }
                  onChange={(valor) =>
                    atualizarExame(
                      "cavidadeOral",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Palpação abdominal"
                  value={
                    exame.palpacaoAbdominal
                  }
                  onChange={(valor) =>
                    atualizarExame(
                      "palpacaoAbdominal",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Ausculta cardiopulmonar"
                  value={
                    exame.auscultaCardiopulmonar
                  }
                  onChange={(valor) =>
                    atualizarExame(
                      "auscultaCardiopulmonar",
                      valor,
                    )
                  }
                />

                <CampoTexto
                  label="Pele e anexos"
                  value={
                    exame.peleAnexos
                  }
                  onChange={(valor) =>
                    atualizarExame(
                      "peleAnexos",
                      valor,
                    )
                  }
                />

                <Subtitulo titulo="Se filhote" />

                <div className="grid gap-4 md:grid-cols-2">
                  <CampoTexto
                    label="Marcha"
                    value={
                      exame.marcha
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "marcha",
                        valor,
                      )
                    }
                  />

                  <CampoTexto
                    label="Aprumos"
                    value={
                      exame.aprumos
                    }
                    onChange={(valor) =>
                      atualizarExame(
                        "aprumos",
                        valor,
                      )
                    }
                  />
                </div>
              </Secao>

              <Secao
                numero="3"
                titulo="Diagnóstico / suspeita"
              >
                <CampoTextoLivre
                  label="Diagnóstico ou principais suspeitas"
                  name="diagnosticoSuspeita"
                  placeholder="Registre diagnósticos confirmados ou suspeitas clínicas..."
                  linhas={5}
                />
              </Secao>

              <Secao
                numero="4"
                titulo="Conduta"
              >
                <CampoTextoLivre
                  label="Conduta clínica"
                  name="conduta"
                  placeholder="Tratamento, medicações, orientações, exames solicitados, retorno..."
                  linhas={6}
                />
              </Secao>

              <Secao
                numero="5"
                titulo="Observações"
              >
                <CampoTextoLivre
                  label="Observações adicionais"
                  name="observacoes"
                  placeholder="Informações complementares do atendimento..."
                  linhas={4}
                />
              </Secao>
            </div>

            {estado.mensagem && (
              <div
                role={estado.ok ? "status" : "alert"}
                aria-live={estado.ok ? "polite" : "assertive"}
                aria-atomic="true"
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  estado.ok
                    ? "border-[#B9DDCA] bg-[#EFF8F3] text-[#347158]"
                    : "border-[#EDC7C0] bg-[#FFF4F1] text-[#A45143]"
                }`}
              >
                {estado.mensagem}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-4 border-t border-[#E4EAE8] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[520px] text-xs font-medium text-[#8A9794]">
                Após finalizar o atendimento, o registro obrigatório de patologia / problema clínico será aberto automaticamente.
              </p>

              <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    setAberto(false)
                  }
                  disabled={pending}
                  className="w-full rounded-xl border border-[#D6DFDC] bg-white px-5 py-3 text-sm font-semibold text-[#52615E] transition hover:bg-[#F5F7F6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3A8DDA]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  aria-busy={pending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#174A5B] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#123D4B] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#174A5B]/25 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                >
                  <Save
                    size={17}
                  />

                  {pending
                    ? "Finalizando..."
                    : "Finalizar atendimento"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </>
  );
}

function Secao({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#DCE5E2] bg-[#FBFCFB]">
      <div className="flex items-center gap-3 border-b border-[#E0E7E4] bg-white px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#174A5B] text-xs font-black text-white">
          {numero}
        </span>

        <h3 className="text-lg font-black text-[#24343A]">
          {titulo}
        </h3>
      </div>

      <div className="space-y-5 p-5">
        {children}
      </div>
    </section>
  );
}

function Subtitulo({
  titulo,
}: {
  titulo: string;
}) {
  return (
    <div className="border-b border-[#DDE5E2] pb-2 pt-2">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#174A5B]">
        {titulo}
      </p>
    </div>
  );
}

function GrupoOpcao({
  titulo,
  valor,
  opcoes,
  onChange,
}: {
  titulo: string;
  valor: string;
  opcoes: string[];
  onChange: (
    valor: string,
  ) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-[#52615E]">
        {titulo}
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label={titulo}>
        {opcoes.map(
          (opcao) => {
            const ativo =
              valor === opcao;

            return (
              <button
                key={opcao}
                type="button"
                aria-pressed={ativo}
                onClick={() =>
                  onChange(
                    ativo
                      ? ""
                      : opcao,
                  )
                }
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#174A5B]/20 focus-visible:ring-offset-2 ${
                  ativo
                    ? "border-[#174A5B] bg-[#174A5B] text-white shadow-sm"
                    : "border-[#D7E1DD] bg-white text-[#657572] hover:border-[#9BB8AE] hover:bg-[#F4F8F6]"
                }`}
              >
                {opcao}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

function GrupoMultiplo({
  titulo,
  valores,
  opcoes,
  onChange,
}: {
  titulo: string;
  valores: string[];
  opcoes: string[];
  onChange: (
    valor: string,
  ) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-[#52615E]">
        {titulo}
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label={titulo}>
        {opcoes.map(
          (opcao) => {
            const ativo =
              valores.includes(
                opcao,
              );

            return (
              <button
                key={opcao}
                type="button"
                aria-pressed={ativo}
                onClick={() =>
                  onChange(opcao)
                }
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3A8DDA]/20 focus-visible:ring-offset-2 ${
                  ativo
                    ? "border-[#3A8DDA] bg-[#E7F2FB] text-[#266B9F]"
                    : "border-[#D7E1DD] bg-white text-[#657572] hover:border-[#9BB8AE] hover:bg-[#F4F8F6]"
                }`}
              >
                {ativo
                  ? "✓ "
                  : ""}
                {opcao}
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}

function CampoTexto({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (
    valor: string,
  ) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#52615E]">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(evento) =>
          onChange(
            evento.target.value,
          )
        }
        rows={3}
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-[#D7E1DD] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#354340] outline-none transition placeholder:text-[#A5AFAC] focus:border-[#3A8DDA] focus:ring-4 focus:ring-[#3A8DDA]/10"
      />
    </label>
  );
}

function CampoCurto({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (
    valor: string,
  ) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#52615E]">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(evento) =>
          onChange(
            evento.target.value,
          )
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D7E1DD] bg-white px-3 py-2.5 text-sm font-semibold text-[#354340] outline-none transition placeholder:text-[#B0B9B6] focus:border-[#3A8DDA] focus:ring-4 focus:ring-[#3A8DDA]/10"
      />
    </label>
  );
}

function CampoTextoLivre({
  label,
  name,
  placeholder,
  linhas,
}: {
  label: string;
  name: string;
  placeholder: string;
  linhas: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#52615E]">
        {label}
      </span>

      <textarea
        name={name}
        rows={linhas}
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-[#D7E1DD] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#354340] outline-none transition placeholder:text-[#A5AFAC] focus:border-[#3A8DDA] focus:ring-4 focus:ring-[#3A8DDA]/10"
      />
    </label>
  );
}

function montarTextoAnamnese(
  dados: DadosAnamnese,
) {
  const temConteudo = Object.values(
    dados,
  ).some((valor) =>
    Array.isArray(valor)
      ? valor.length > 0
      : valor.trim().length > 0,
  );

  if (!temConteudo) {
    return "";
  }

  const linhas: string[] = [
    "1. ANAMNESE",
  ];

  adicionarLinha(
    linhas,
    "ESTADO GERAL",
    dados.estadoGeral,
  );

  adicionarLinha(
    linhas,
    "PESO",
    dados.pesoEstado,
  );

  adicionarLinha(
    linhas,
    "DETALHE DO PESO",
    dados.pesoDetalhe,
  );

  adicionarLinha(
    linhas,
    "APETITE",
    dados.apetite,
  );

  adicionarLinha(
    linhas,
    "DETALHE DA ALIMENTAÇÃO",
    dados.apetiteDetalhe,
  );

  adicionarLinha(
    linhas,
    "INGESTÃO HÍDRICA",
    dados.ingestaoHidrica,
  );

  adicionarLinha(
    linhas,
    "DETALHE DA INGESTÃO HÍDRICA",
    dados.ingestaoHidricaOutro,
  );

  adicionarLinha(
    linhas,
    "VÔMITO",
    dados.vomito,
  );

  adicionarLinha(
    linhas,
    "TIPO DE VÔMITO",
    dados.tipoVomito,
  );

  adicionarLinha(
    linhas,
    "FEZES",
    dados.fezes,
  );

  adicionarLinha(
    linhas,
    "CARACTERÍSTICAS DAS FEZES",
    dados.fezesCaracteristica,
  );

  const vacinasSelecionadas =
    dados.vacinas.filter(
      (vacina) =>
        vacina !== "Outra",
    );

  if (
    dados.vacinas.includes(
      "Outra",
    ) &&
    dados.outraVacina.trim()
  ) {
    vacinasSelecionadas.push(
      dados.outraVacina.trim(),
    );
  }

  if (
    vacinasSelecionadas.length > 0 ||
    dados.vacinacaoStatus.trim() ||
    dados.vacinacaoDetalhe.trim()
  ) {
    linhas.push(
      "",
      "VACINAÇÃO",
    );

    adicionarLinha(
      linhas,
      "VACINAS / PRODUTOS",
      vacinasSelecionadas.join(
        ", ",
      ),
    );

    adicionarLinha(
      linhas,
      "SITUAÇÃO DA VACINAÇÃO",
      dados.vacinacaoStatus,
    );

    adicionarLinha(
      linhas,
      "DETALHE DA VACINAÇÃO",
      dados.vacinacaoDetalhe,
    );
  }

  adicionarLinha(
    linhas,
    "VERMIFUGAÇÃO",
    dados.vermifugacao,
  );

  adicionarLinha(
    linhas,
    "DETALHE DA VERMIFUGAÇÃO",
    dados.vermifugacaoDetalhe,
  );

  adicionarLinha(
    linhas,
    "ECTOPARASITAS",
    dados.ectoparasitas.join(
      ", ",
    ),
  );

  adicionarLinha(
    linhas,
    "OUTRO ECTOPARASITA",
    dados.ectoparasitasOutro,
  );

  adicionarLinha(
    linhas,
    "FAZ PREVENÇÃO CONTRA ECTOPARASITAS",
    dados.prevencaoEctoparasitas,
  );

  adicionarLinha(
    linhas,
    "PREVENÇÃO EM DIA",
    dados.prevencaoEmDia,
  );

  adicionarLinha(
    linhas,
    "PRODUTO DE PREVENÇÃO",
    dados.prevencaoProduto,
  );

  adicionarLinha(
    linhas,
    "CONTACTANTE",
    dados.contactante,
  );

  adicionarLinha(
    linhas,
    "DETALHE DOS CONTACTANTES",
    dados.contactanteDetalhe,
  );

  adicionarLinha(
    linhas,
    "TIPO DE MORADIA",
    dados.moradia,
  );

  adicionarLinha(
    linhas,
    "COMPORTAMENTO",
    dados.comportamento,
  );

  adicionarLinha(
    linhas,
    "DETALHE DO COMPORTAMENTO",
    dados.comportamentoDetalhe,
  );

  if (
    dados.miccao.trim() ||
    dados.coloracaoUrina.trim() ||
    dados.coloracaoUrinaDetalhe.trim() ||
    dados.castracao.trim() ||
    dados.castracaoDetalhe.trim() ||
    dados.secrecaoGenital.trim() ||
    dados.secrecaoGenitalDetalhe.trim()
  ) {
    linhas.push(
      "",
      "SISTEMA GÊNITO-URINÁRIO",
    );
  }

  adicionarLinha(
    linhas,
    "MICÇÃO",
    dados.miccao,
  );

  adicionarLinha(
    linhas,
    "COLORAÇÃO DA URINA",
    dados.coloracaoUrina,
  );

  adicionarLinha(
    linhas,
    "DETALHE DA URINA",
    dados.coloracaoUrinaDetalhe,
  );

  adicionarLinha(
    linhas,
    "CASTRAÇÃO",
    dados.castracao,
  );

  adicionarLinha(
    linhas,
    "DETALHE DA CASTRAÇÃO",
    dados.castracaoDetalhe,
  );

  adicionarLinha(
    linhas,
    "SECREÇÃO VAGINAL / PENIANA",
    dados.secrecaoGenital,
  );

  adicionarLinha(
    linhas,
    "DETALHE DA SECREÇÃO",
    dados.secrecaoGenitalDetalhe,
  );

  if (
    dados.pele.trim() ||
    dados.ouvidos.trim()
  ) {
    linhas.push(
      "",
      "SISTEMA TEGUMENTAR",
    );
  }

  adicionarLinha(
    linhas,
    "PELE",
    dados.pele,
  );

  adicionarLinha(
    linhas,
    "OUVIDOS",
    dados.ouvidos,
  );

  if (
    dados.neurologico.trim() ||
    dados.neurologicoDetalhe.trim()
  ) {
    linhas.push(
      "",
      "SISTEMA NEUROLÓGICO",
    );
  }

  adicionarLinha(
    linhas,
    "ESTADO NEUROLÓGICO",
    dados.neurologico,
  );

  adicionarLinha(
    linhas,
    "DETALHE NEUROLÓGICO",
    dados.neurologicoDetalhe,
  );

  if (
    dados.musculoEsqueletico.trim() ||
    dados.musculoEsqueleticoDetalhe.trim()
  ) {
    linhas.push(
      "",
      "SISTEMA MÚSCULO-ESQUELÉTICO",
    );
  }

  adicionarLinha(
    linhas,
    "AVALIAÇÃO",
    dados.musculoEsqueletico,
  );

  adicionarLinha(
    linhas,
    "DETALHE",
    dados.musculoEsqueleticoDetalhe,
  );

  if (
    dados.oftalmico.trim() ||
    dados.oftalmicoDetalhe.trim()
  ) {
    linhas.push(
      "",
      "SISTEMA OFTÁLMICO",
    );
  }

  adicionarLinha(
    linhas,
    "AVALIAÇÃO",
    dados.oftalmico,
  );

  adicionarLinha(
    linhas,
    "DETALHE",
    dados.oftalmicoDetalhe,
  );

  return linhas
    .join("\n")
    .trim();
}

function montarTextoExame(
  dados: DadosExame,
) {
  const temConteudo = Object.values(
    dados,
  ).some(
    (valor) =>
      valor.trim().length > 0,
  );

  if (!temConteudo) {
    return "";
  }

  const linhas: string[] = [
    "2. EXAME FÍSICO",
  ];

  adicionarLinha(
    linhas,
    "HIDRATAÇÃO",
    dados.hidratacao,
  );

  adicionarLinha(
    linhas,
    "MUCOSAS",
    dados.mucosas,
  );

  adicionarLinha(
    linhas,
    "TPC",
    dados.tpc,
  );

  adicionarLinha(
    linhas,
    "TEMPERATURA",
    dados.temperatura
      ? `${dados.temperatura} °C`
      : "",
  );

  adicionarLinha(
    linhas,
    "FR",
    dados.fr
      ? `${dados.fr} mpm`
      : "",
  );

  adicionarLinha(
    linhas,
    "FC",
    dados.fc
      ? `${dados.fc} bpm`
      : "",
  );

  adicionarLinha(
    linhas,
    "ECC",
    dados.ecc
      ? `${dados.ecc}/9`
      : "",
  );

  adicionarLinha(
    linhas,
    "LINFONODOS",
    dados.linfonodos,
  );

  adicionarLinha(
    linhas,
    "CAVIDADE ORAL",
    dados.cavidadeOral,
  );

  adicionarLinha(
    linhas,
    "PALPAÇÃO ABDOMINAL",
    dados.palpacaoAbdominal,
  );

  adicionarLinha(
    linhas,
    "AUSCULTA CARDIOPULMONAR",
    dados.auscultaCardiopulmonar,
  );

  adicionarLinha(
    linhas,
    "PELE E ANEXOS",
    dados.peleAnexos,
  );

  if (
    dados.marcha ||
    dados.aprumos
  ) {
    linhas.push(
      "",
      "SE FILHOTE",
    );
  }

  adicionarLinha(
    linhas,
    "MARCHA",
    dados.marcha,
  );

  adicionarLinha(
    linhas,
    "APRUMOS",
    dados.aprumos,
  );

  return linhas
    .join("\n")
    .trim();
}

function adicionarLinha(
  linhas: string[],
  titulo: string,
  valor: string,
) {
  if (!valor.trim()) {
    return;
  }

  linhas.push(
    `${titulo}: ${valor.trim()}`,
  );
}
