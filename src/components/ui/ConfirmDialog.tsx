"use client";

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;

  title: string;

  description: string;

  itemName?: string | null;

  itemLabel?: string;

  confirmLabel?: string;

  loadingLabel?: string;

  cancelLabel?: string;

  loading?: boolean;

  onConfirm: () =>
    | void
    | Promise<void>;

  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  itemName,
  itemLabel = "Item selecionado",
  confirmLabel = "Confirmar exclusão",
  loadingLabel = "Excluindo...",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const body =
      document.body;

    const overflowAnterior =
      body.style.overflow;

    body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
          "Escape" &&
        !loading
      ) {
        onCancel();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    loading,
    onCancel,
  ]);

  if (!open) {
    return null;
  }

  async function confirmar() {
    if (loading) {
      return;
    }

    await onConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#16262B]/60 px-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !loading
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-[440px] overflow-hidden rounded-[28px] border border-white/70 bg-[#FBFCFA] shadow-[0_30px_90px_rgba(0,0,0,0.30)]"
      >
        {/* CONTEÚDO */}
        <div className="relative px-7 pb-6 pt-7">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Fechar"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-[#7D8C89] transition hover:bg-[#EDF2F0] hover:text-[#24343A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>

          {/* ÍCONE */}
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#FDEAE6] text-[#C76550]">
            <AlertTriangle
              size={28}
            />
          </div>

          <h2
            id="confirm-dialog-title"
            className="mt-5 pr-10 text-[23px] font-black leading-tight text-[#24343A]"
          >
            {title}
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-[#71817E]">
            {description}
          </p>

          {/* ITEM */}
          {itemName && (
            <div className="mt-5 rounded-2xl border border-[#E0E7E4] bg-[#F4F7F5] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#899793]">
                {itemLabel}
              </p>

              <div className="mt-2 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FCE9E5] text-[#C76550]">
                  <Trash2
                    size={16}
                  />
                </div>

                <p className="min-w-0 break-words pt-1.5 text-sm font-bold leading-5 text-[#374743]">
                  {itemName}
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-[#F1DFDA] bg-[#FFF6F3] px-4 py-3">
            <p className="text-xs font-medium leading-5 text-[#8B665D]">
              Confirme somente se tiver certeza de que deseja continuar.
            </p>
          </div>
        </div>

        {/* AÇÕES */}
        <div className="flex gap-3 border-t border-[#E4EAE7] bg-[#F6F9F7] px-7 py-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-[#D6E0DC] bg-white px-4 py-3 text-sm font-semibold text-[#586864] transition hover:bg-[#EDF3F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={confirmar}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C76550] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#B55340] disabled:cursor-wait disabled:opacity-60"
          >
            <Trash2
              size={16}
            />

            {loading
              ? loadingLabel
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}