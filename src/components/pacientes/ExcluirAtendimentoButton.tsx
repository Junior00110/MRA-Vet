"use client";

import {
  useState,
} from "react";

import {
  Trash2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  removerAtendimentoPaciente,
} from "@/app/actions/paciente-atendimentos";

type ExcluirAtendimentoButtonProps = {
  atendimentoId: number;
  pacienteId: number;
};

export default function ExcluirAtendimentoButton({
  atendimentoId,
  pacienteId,
}: ExcluirAtendimentoButtonProps) {
  const router =
    useRouter();

  const [
    modalAberto,
    setModalAberto,
  ] = useState(false);

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState("");

  function abrirExclusao() {
    setErro("");
    setModalAberto(true);
  }

  function fecharExclusao() {
    if (excluindo) {
      return;
    }

    setModalAberto(false);
    setErro("");
  }

  async function confirmarExclusao() {
    if (excluindo) {
      return;
    }

    try {
      setExcluindo(true);
      setErro("");

      const formData =
        new FormData();

      formData.set(
        "atendimentoId",
        String(
          atendimentoId,
        ),
      );

      formData.set(
        "pacienteId",
        String(
          pacienteId,
        ),
      );

      await removerAtendimentoPaciente(
        formData,
      );

      setModalAberto(false);

      router.refresh();
    } catch {
      setErro(
        "Não foi possível excluir o atendimento. Tente novamente.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={abrirExclusao}
          disabled={excluindo}
          className="flex items-center gap-1.5 rounded-lg border border-[#E8C9C4] bg-[#FFF7F5] px-2.5 py-1.5 text-[10px] font-bold text-[#B65448] transition hover:border-[#DCA99F] hover:bg-[#FDEDE9] disabled:cursor-wait disabled:opacity-60"
        >
          <Trash2
            size={13}
          />

          {excluindo
            ? "Excluindo..."
            : "Excluir"}
        </button>

        {erro && (
          <p className="max-w-[240px] text-right text-[10px] font-semibold text-[#B65448]">
            {erro}
          </p>
        )}
      </div>

      <ConfirmDialog
        open={modalAberto}
        title="Excluir atendimento?"
        description="O atendimento deixará de aparecer no histórico do paciente, mas continuará preservado no banco de dados."
        itemLabel="Registro selecionado"
        itemName="Atendimento clínico"
        confirmLabel="Excluir atendimento"
        loadingLabel="Excluindo..."
        loading={excluindo}
        onCancel={fecharExclusao}
        onConfirm={
          confirmarExclusao
        }
      />
    </>
  );
}