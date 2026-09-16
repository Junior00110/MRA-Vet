"use client";

import {
  useState,
  useTransition,
} from "react";

import { Trash2 } from "lucide-react";

import {
  removerExamePaciente,
} from "@/app/actions/paciente-exames";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type ExcluirExameButtonProps = {
  exameId: number;
  pacienteId: number;
  exameNome: string;
};

export default function ExcluirExameButton({
  exameId,
  pacienteId,
  exameNome,
}: ExcluirExameButtonProps) {
  const [aberto, setAberto] =
    useState(false);

  const [pending, startTransition] =
    useTransition();

  function confirmarExclusao() {
    startTransition(async () => {
      const formData =
        new FormData();

      formData.set(
        "exameId",
        String(exameId),
      );

      formData.set(
        "pacienteId",
        String(pacienteId),
      );

      await removerExamePaciente(
        formData,
      );

      setAberto(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setAberto(true)
        }
        disabled={pending}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0D0D3] bg-white text-[#B44A54] transition hover:bg-[#FFF2F3] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Excluir exame ${exameNome}`}
        title="Excluir exame"
      >
        <Trash2 size={14} />
      </button>

      <ConfirmDialog
        open={aberto}
        title="Excluir exame"
        description="Este exame será removido do histórico visível, mas o registro será preservado no banco."
        itemLabel="Exame"
        itemName={exameNome}
        confirmLabel="Excluir exame"
        loadingLabel="Excluindo..."
        cancelLabel="Cancelar"
        loading={pending}
        onConfirm={confirmarExclusao}
        onCancel={() =>
          setAberto(false)
        }
      />
    </>
  );
}
