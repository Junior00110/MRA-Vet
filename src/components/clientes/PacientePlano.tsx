"use client";

import {
  CheckCircle2,
  CreditCard,
  FileText,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  adicionarPlanoPaciente,
  removerPlanoPaciente,
  type EstadoPlano,
} from "@/app/actions/paciente-planos";

type Plano = {
  id: number;
  nome: string;
  numeroCarteirinha:
    | string
    | null;
  observacoes:
    | string
    | null;
  ativo: boolean;
};

type PacientePlanoProps = {
  pacienteId: number;
  clienteId: number;
  planos: Plano[];
  podeAdicionar: boolean;
};

const estadoInicial: EstadoPlano = {
  ok: false,
  mensagem: "",
};

export default function PacientePlano({
  pacienteId,
  clienteId,
  planos,
  podeAdicionar,
}: PacientePlanoProps) {
  const router = useRouter();

  const [
    formularioAberto,
    setFormularioAberto,
  ] = useState(false);

  const [
    modalExcluirAberto,
    setModalExcluirAberto,
  ] = useState(false);

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  const [
    erroExclusao,
    setErroExclusao,
  ] = useState("");

  const [
    estado,
    formAction,
    pendente,
  ] = useActionState(
    adicionarPlanoPaciente,
    estadoInicial,
  );

  useEffect(() => {
    if (estado.ok) {
      setFormularioAberto(false);
      router.refresh();
    }
  }, [
    estado.ok,
    router,
  ]);

  const planosAtivos =
    planos.filter(
      (plano) =>
        plano.ativo,
    );

  const planoAtual =
    planosAtivos[0];

  function abrirFormulario() {
    setFormularioAberto(true);
  }

  function fecharFormulario() {
    if (pendente) {
      return;
    }

    setFormularioAberto(false);
  }

  function abrirExclusao() {
    setErroExclusao("");
    setModalExcluirAberto(true);
  }

  function fecharExclusao() {
    if (excluindo) {
      return;
    }

    setModalExcluirAberto(false);
    setErroExclusao("");
  }

  async function confirmarExclusao() {
    if (
      !planoAtual ||
      excluindo
    ) {
      return;
    }

    try {
      setExcluindo(true);
      setErroExclusao("");

      const formData =
        new FormData();

      formData.set(
        "planoId",
        String(
          planoAtual.id,
        ),
      );

      formData.set(
        "pacienteId",
        String(
          pacienteId,
        ),
      );

      formData.set(
        "clienteId",
        String(
          clienteId,
        ),
      );

      await removerPlanoPaciente(
        formData,
      );

      setModalExcluirAberto(false);
      router.refresh();
    } catch {
      setErroExclusao(
        "Não foi possível remover o plano. Tente novamente.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <div className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[22px] border border-[#D9E6F4] bg-[#F7FAFE] px-5 py-5 shadow-sm">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#356EE8]/10" />

        {/* SEM FORMULÁRIO */}
        {!formularioAberto && (
          <>
            {/* CABEÇALHO CENTRALIZADO */}
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#356EE8] text-white shadow-sm">
                <ShieldCheck
                  size={22}
                />
              </div>

              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6681B3]">
                Plano de saúde
              </p>

              <div className="relative flex items-center justify-center gap-3">
                <h3 className="mt-1 text-lg font-black text-[#303A4A]">
                  {planoAtual
                    ? planoAtual.nome
                    : "Sem plano cadastrado"}
                </h3>
              </div>

              {!planoAtual && (
                <p className="mt-1 text-xs font-medium text-[#8190A5]">
                  Cadastre o plano de saúde deste paciente.
                </p>
              )}

              {planoAtual &&
                podeAdicionar && (
                  <button
                    type="button"
                    onClick={
                      abrirExclusao
                    }
                    title="Excluir plano"
                    className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl border border-[#F0D8D4] bg-white text-[#BD7166] transition hover:border-[#E8BEB7] hover:bg-[#FDEDEB] hover:text-[#B8493A]"
                  >
                    <Trash2
                      size={16}
                    />
                  </button>
                )}
            </div>

            {/* DADOS DO PLANO */}
            {planoAtual && (
              <div className="relative mt-5 grid gap-3 md:grid-cols-3">
                {/* STATUS */}
                <div className="flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border border-[#DFE8F8] bg-white px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3EB66D]" />
                  </div>

                  <div className="text-left">
                    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8595B4]">
                      Status
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-[#3C4657]">
                      Plano ativo
                    </p>
                  </div>
                </div>

                {/* CARTEIRINHA */}
                <div className="flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border border-[#DFE8F8] bg-white px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#356EE8]">
                    <CreditCard
                      size={17}
                    />
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8595B4]">
                      Carteirinha
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-[#3C4657]">
                      {planoAtual.numeroCarteirinha ||
                        "Não informada"}
                    </p>
                  </div>
                </div>

                {/* OBSERVAÇÕES */}
                <div className="flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border border-[#DFE8F8] bg-white px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#356EE8]">
                    <FileText
                      size={17}
                    />
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8595B4]">
                      Observações
                    </p>

                    <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-[#3C4657]">
                      {planoAtual.observacoes ||
                        "Nenhuma observação"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUCESSO */}
            {estado.ok &&
              estado.mensagem && (
                <div className="relative mx-auto mt-4 flex max-w-[520px] items-center justify-center gap-2 rounded-xl bg-[#E8F4EC] px-3 py-2.5 text-center text-xs font-medium text-[#41725A]">
                  <CheckCircle2
                    size={15}
                  />

                  {estado.mensagem}
                </div>
              )}

            {/* ERRO */}
            {erroExclusao && (
              <div className="relative mx-auto mt-4 max-w-[520px] rounded-xl bg-[#FDEDEA] px-3 py-2.5 text-center text-xs font-medium text-[#A64D3D]">
                {erroExclusao}
              </div>
            )}

            {/* ADICIONAR / TROCAR */}
            {podeAdicionar && (
              <button
                type="button"
                onClick={
                  abrirFormulario
                }
                className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#356EE8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#285BC7]"
              >
                <Plus
                  size={17}
                />

                {planoAtual
                  ? "Trocar plano"
                  : "Adicionar plano"}
              </button>
            )}
          </>
        )}

        {/* FORMULÁRIO */}
        {formularioAberto && (
          <form
            action={formAction}
            className="relative"
          >
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

            {/* CABEÇALHO DO FORMULÁRIO */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#356EE8] text-white shadow-sm">
                <ShieldCheck
                  size={22}
                />
              </div>

              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6681B3]">
                Plano de saúde
              </p>

              <h3 className="mt-1 text-lg font-black text-[#303A4A]">
                {planoAtual
                  ? "Trocar plano"
                  : "Adicionar plano"}
              </h3>

              <p className="mt-1 max-w-[420px] text-xs font-medium leading-5 text-[#8190A5]">
                {planoAtual
                  ? "Informe os dados do novo plano. O plano atual ficará preservado no histórico."
                  : "Informe os dados do plano de saúde deste paciente."}
              </p>

              <button
                type="button"
                onClick={
                  fecharFormulario
                }
                disabled={pendente}
                title="Fechar formulário"
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F1] bg-white text-[#8493AB] transition hover:bg-[#EEF3FA] disabled:opacity-50"
              >
                <X
                  size={17}
                />
              </button>
            </div>

            {/* CAMPOS */}
            <div className="mx-auto mt-5 max-w-[620px] space-y-3">
              <div>
                <label
                  htmlFor={`plano-nome-${pacienteId}`}
                  className="text-[10px] font-medium uppercase tracking-wider text-[#7587A5]"
                >
                  Nome do plano *
                </label>

                <input
                  id={`plano-nome-${pacienteId}`}
                  name="nome"
                  required
                  maxLength={120}
                  placeholder="Ex.: Petlove Saúde"
                  className="mt-1.5 w-full rounded-xl border border-[#DCE5F2] bg-white px-3 py-2.5 text-sm font-medium text-[#3C4657] outline-none transition placeholder:text-[#AAB5C7] focus:border-[#356EE8] focus:ring-4 focus:ring-[#356EE8]/10"
                />
              </div>

              <div>
                <label
                  htmlFor={`plano-carteirinha-${pacienteId}`}
                  className="text-[10px] font-medium uppercase tracking-wider text-[#7587A5]"
                >
                  Número da carteirinha
                </label>

                <input
                  id={`plano-carteirinha-${pacienteId}`}
                  name="numeroCarteirinha"
                  maxLength={120}
                  placeholder="Ex.: 123456789"
                  className="mt-1.5 w-full rounded-xl border border-[#DCE5F2] bg-white px-3 py-2.5 text-sm font-medium text-[#3C4657] outline-none transition placeholder:text-[#AAB5C7] focus:border-[#356EE8] focus:ring-4 focus:ring-[#356EE8]/10"
                />
              </div>

              <div>
                <label
                  htmlFor={`plano-observacoes-${pacienteId}`}
                  className="text-[10px] font-medium uppercase tracking-wider text-[#7587A5]"
                >
                  Observações
                </label>

                <textarea
                  id={`plano-observacoes-${pacienteId}`}
                  name="observacoes"
                  maxLength={1500}
                  rows={3}
                  placeholder="Ex.: categoria, coparticipação ou informações importantes..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#DCE5F2] bg-white px-3 py-2.5 text-sm font-medium text-[#3C4657] outline-none transition placeholder:text-[#AAB5C7] focus:border-[#356EE8] focus:ring-4 focus:ring-[#356EE8]/10"
                />
              </div>

              {!estado.ok &&
                estado.mensagem && (
                  <p className="rounded-xl bg-[#FDEDEA] px-3 py-2.5 text-center text-xs font-medium text-[#A64D3D]">
                    {
                      estado.mensagem
                    }
                  </p>
                )}

              {/* BOTÕES */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={
                    fecharFormulario
                  }
                  disabled={pendente}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#D7E0ED] bg-white px-3 py-3 text-xs font-semibold text-[#62728A] transition hover:bg-[#F1F5FA] disabled:opacity-50"
                >
                  <X
                    size={15}
                  />

                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pendente}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#356EE8] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#285BC7] disabled:cursor-wait disabled:opacity-60"
                >
                  <ShieldCheck
                    size={15}
                  />

                  {pendente
                    ? "Salvando..."
                    : planoAtual
                      ? "Salvar novo plano"
                      : "Salvar plano"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* MODAL DE EXCLUSÃO */}
      <ConfirmDialog
        open={
          modalExcluirAberto &&
          Boolean(planoAtual)
        }
        title="Excluir plano?"
        description="O plano deixará de aparecer como ativo para este paciente, mas continuará preservado no histórico do sistema."
        itemLabel="Plano selecionado"
        itemName={
          planoAtual?.nome ??
          null
        }
        confirmLabel="Excluir plano"
        loadingLabel="Excluindo..."
        loading={excluindo}
        onCancel={
          fecharExclusao
        }
        onConfirm={
          confirmarExclusao
        }
      />
    </>
  );
}