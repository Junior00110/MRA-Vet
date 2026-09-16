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

import {
  removerVacinaPaciente,
} from "@/app/actions/paciente-vacinas";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

type ExcluirVacinaButtonProps = {
  vacinaId: number;
  pacienteId: number;
  vacinaNome: string;
};

export default function ExcluirVacinaButton({
  vacinaId,
  pacienteId,
  vacinaNome,
}: ExcluirVacinaButtonProps) {
  const router =
    useRouter();

  const [
    aberto,
    setAberto,
  ] = useState(false);

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState("");

  async function confirmarExclusao() {
    if (excluindo) {
      return;
    }

    setErro("");
    setExcluindo(true);

    try {
      const formData =
        new FormData();

      formData.set(
        "vacinaId",
        String(vacinaId),
      );

      formData.set(
        "pacienteId",
        String(pacienteId),
      );

      await removerVacinaPaciente(
        formData,
      );

      setAberto(false);

      router.refresh();
    } catch (error) {
      console.error(
        error,
      );

      setErro(
        "Não foi possível excluir esta vacinação.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErro("");
          setAberto(true);
        }}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E8C8C0] bg-[#FFF7F5] px-3 text-xs font-bold text-[#B45F4D] transition hover:border-[#DDAA9D] hover:bg-[#FFF0EC]"
      >
        <Trash2
          size={15}
        />

        Excluir
      </button>

      {erro && (
        <p className="mt-2 text-xs font-semibold text-[#B45F4D]">
          {erro}
        </p>
      )}

      <ConfirmDialog
        open={aberto}
        title="Excluir vacinação?"
        description="A vacinação deixará de aparecer no prontuário, mas o registro será preservado no banco de dados."
        itemLabel="Vacina"
        itemName={vacinaNome}
        confirmLabel="Excluir vacinação"
        loadingLabel="Excluindo..."
        cancelLabel="Cancelar"
        loading={excluindo}
        onConfirm={
          confirmarExclusao
        }
        onCancel={() => {
          if (
            excluindo
          ) {
            return;
          }

          setAberto(false);
          setErro("");
        }}
      />
    </>
  );
}