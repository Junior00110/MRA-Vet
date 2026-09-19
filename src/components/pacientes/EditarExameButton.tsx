"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  FlaskConical,
  Save,
  X,
} from "lucide-react";

import {
  atualizarExamePaciente,
  type EstadoExame,
} from "@/app/actions/paciente-exames";

type StatusExame =
  | "SOLICITADO"
  | "REALIZADO"
  | "RESULTADO_DISPONIVEL"
  | "CANCELADO";

type EditarExameButtonProps = {
  exameId: number;
  pacienteId: number;

  nome: string;
  tipo?: string | null;
  status: StatusExame;

  laboratorio?: string | null;
  dataRealizacao?: string | null;
  dataResultado?: string | null;

  resultado?: string | null;
  observacoes?: string | null;
};

const estadoInicial: EstadoExame = {
  ok: false,
  mensagem: "",
};

function dataParaInput(
  valor?: string | null,
) {
  if (!valor) {
    return "";
  }

  const data = new Date(valor);

  if (
    Number.isNaN(
      data.getTime(),
    )
  ) {
    return "";
  }

  const ano =
    data.getUTCFullYear();

  const mes = String(
    data.getUTCMonth() + 1,
  ).padStart(2, "0");

  const dia = String(
    data.getUTCDate(),
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function EditarExameButton({
  exameId,
  pacienteId,
  nome,
  tipo,
  status,
  laboratorio,
  dataRealizacao,
  dataResultado,
  resultado,
  observacoes,
}: EditarExameButtonProps) {
  const [
    aberto,
    setAberto,
  ] = useState(false);

  const [
    statusAtual,
    setStatusAtual,
  ] = useState<StatusExame>(
    status,
  );

  const [
    estado,
    formAction,
    pending,
  ] = useActionState(
    atualizarExamePaciente,
    estadoInicial,
  );

  const botaoRef =
    useRef<HTMLButtonElement>(
      null,
    );

  const dialogRef =
    useRef<HTMLDivElement>(
      null,
    );

  const tituloRef =
    useRef<HTMLHeadingElement>(
      null,
    );

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
      window.clearTimeout(
        timer,
      );

      document.removeEventListener(
        "keydown",
        tratarTeclado,
      );
    };
  }, [aberto, pending]);

  useEffect(() => {
    if (!estado.ok) {
      return;
    }

    setAberto(false);

    window.setTimeout(() => {
      botaoRef.current?.focus();
    }, 50);
  }, [estado.ok]);

  function abrirModal() {
    setStatusAtual(
      status,
    );

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

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        onClick={abrirModal}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D6E2DE] bg-white text-[#45625A] transition hover:border-[#B9CCC6] hover:bg-[#F3F7F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] focus-visible:ring-offset-2"
        aria-label={`Editar exame ${nome}`}
        title="Editar exame"
        aria-haspopup="dialog"
        aria-expanded={aberto}
      >
        <Edit3
          size={14}
        />
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17282D]/45 p-3 backdrop-blur-[2px] sm:p-5"
          onMouseDown={(
            event,
          ) => {
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="editar-exame-titulo"
            aria-describedby="editar-exame-descricao"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-[#DDE6E2] bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E5EBE8] bg-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#C05B65]">
                  Prontuário clínico
                </p>

                <h2
                  ref={tituloRef}
                  id="editar-exame-titulo"
                  tabIndex={-1}
                  className="mt-1 text-xl font-black text-[#24343A] outline-none"
                >
                  Atualizar exame
                </h2>

                <p
                  id="editar-exame-descricao"
                  className="mt-1 text-sm font-medium text-[#71807C]"
                >
                  Atualize o andamento, resultado ou informações do exame.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fecharModal
                }
                disabled={pending}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDE5E2] bg-[#F7F9F8] text-[#64736F] transition hover:bg-[#EEF2F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fechar edição do exame"
              >
                <X size={17} />
              </button>
            </div>

            <form
              action={formAction}
              aria-busy={
                pending
              }
              className="p-4 sm:p-6"
            >
              <input
                type="hidden"
                name="exameId"
                value={exameId}
              />

              <input
                type="hidden"
                name="pacienteId"
                value={
                  pacienteId
                }
              />

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#F0D7DA] bg-[#FFF7F7] p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EB5965] text-white">
                  <FlaskConical
                    size={19}
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#B34D57]">
                    Exame
                  </p>

                  <p className="mt-0.5 truncate text-sm font-black text-[#34423F]">
                    {nome}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Campo>
                  <Label
                    htmlFor={`editar-exame-nome-${exameId}`}
                    obrigatorio
                  >
                    Nome do exame
                  </Label>

                  <input
                    id={`editar-exame-nome-${exameId}`}
                    name="nome"
                    type="text"
                    required
                    maxLength={200}
                    defaultValue={
                      nome
                    }
                    className={
                      inputClass
                    }
                  />
                </Campo>

                <Campo>
                  <Label
                    htmlFor={`editar-exame-tipo-${exameId}`}
                  >
                    Tipo / categoria
                  </Label>

                  <input
                    id={`editar-exame-tipo-${exameId}`}
                    name="tipo"
                    type="text"
                    maxLength={150}
                    defaultValue={
                      tipo ?? ""
                    }
                    placeholder="Ex.: Infectologia, Hematologia..."
                    className={
                      inputClass
                    }
                  />
                </Campo>

                <Campo>
                  <Label
                    htmlFor={`editar-exame-status-${exameId}`}
                    obrigatorio
                  >
                    Status
                  </Label>

                  <select
                    id={`editar-exame-status-${exameId}`}
                    name="status"
                    required
                    value={
                      statusAtual
                    }
                    onChange={(
                      event,
                    ) =>
                      setStatusAtual(
                        event.target
                          .value as StatusExame,
                      )
                    }
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

                  <StatusAjuda
                    status={
                      statusAtual
                    }
                  />
                </Campo>

                <Campo>
                  <Label
                    htmlFor={`editar-exame-laboratorio-${exameId}`}
                  >
                    Laboratório
                  </Label>

                  <input
                    id={`editar-exame-laboratorio-${exameId}`}
                    name="laboratorio"
                    type="text"
                    maxLength={200}
                    defaultValue={
                      laboratorio ??
                      ""
                    }
                    placeholder="Nome do laboratório"
                    className={
                      inputClass
                    }
                  />
                </Campo>

                <Campo>
                  <Label
                    htmlFor={`editar-exame-data-realizacao-${exameId}`}
                  >
                    Data da realização
                  </Label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#87938F]"
                    />

                    <input
                      id={`editar-exame-data-realizacao-${exameId}`}
                      name="dataRealizacao"
                      type="date"
                      defaultValue={dataParaInput(
                        dataRealizacao,
                      )}
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  <p className="mt-1 text-xs font-medium leading-relaxed text-[#7B8985]">
                    Se o status for Realizado e a data ficar vazia, o sistema registra automaticamente a data da atualização.
                  </p>
                </Campo>

                <Campo>
                  <Label
                    htmlFor={`editar-exame-data-resultado-${exameId}`}
                  >
                    Data do resultado
                  </Label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#87938F]"
                    />

                    <input
                      id={`editar-exame-data-resultado-${exameId}`}
                      name="dataResultado"
                      type="date"
                      defaultValue={dataParaInput(
                        dataResultado,
                      )}
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  <p className="mt-1 text-xs font-medium leading-relaxed text-[#7B8985]">
                    Se o status for Resultado disponível e a data ficar vazia, o sistema registra automaticamente a data da atualização.
                  </p>
                </Campo>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Campo>
                  <Label
                    htmlFor={`editar-exame-resultado-${exameId}`}
                  >
                    Resultado / laudo
                  </Label>

                  <textarea
                    id={`editar-exame-resultado-${exameId}`}
                    name="resultado"
                    rows={7}
                    maxLength={10000}
                    defaultValue={
                      resultado ??
                      ""
                    }
                    placeholder="Digite o resultado ou laudo do exame..."
                    className={`${inputClass} min-h-[170px] resize-y`}
                  />
                </Campo>

                <Campo>
                  <Label
                    htmlFor={`editar-exame-observacoes-${exameId}`}
                  >
                    Observações
                  </Label>

                  <textarea
                    id={`editar-exame-observacoes-${exameId}`}
                    name="observacoes"
                    rows={7}
                    maxLength={5000}
                    defaultValue={
                      observacoes ??
                      ""
                    }
                    placeholder="Observações adicionais..."
                    className={`${inputClass} min-h-[170px] resize-y`}
                  />
                </Campo>
              </div>

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
                  <div className="flex items-start gap-2">
                    {estado.ok && (
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0"
                      />
                    )}

                    <span>
                      {
                        estado.mensagem
                      }
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E7ECEA] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    fecharModal
                  }
                  disabled={
                    pending
                  }
                  className="rounded-xl border border-[#DCE4E1] bg-white px-5 py-2.5 text-sm font-bold text-[#5C6B67] transition hover:bg-[#F6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    pending
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#EB5965] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#DA4E5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5965] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save
                    size={16}
                  />

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

function StatusAjuda({
  status,
}: {
  status: StatusExame;
}) {
  if (
    status ===
    "SOLICITADO"
  ) {
    return (
      <p className="mt-1 text-xs font-semibold text-[#7B8985]">
        O exame foi solicitado e ainda aguarda realização.
      </p>
    );
  }

  if (
    status ===
    "REALIZADO"
  ) {
    return (
      <p className="mt-1 text-xs font-semibold text-[#6D8179]">
        O exame já foi realizado e pode estar aguardando laudo ou resultado.
      </p>
    );
  }

  if (
    status ===
    "RESULTADO_DISPONIVEL"
  ) {
    return (
      <p className="mt-1 text-xs font-semibold text-[#397057]">
        O resultado já está disponível para consulta no prontuário.
      </p>
    );
  }

  return (
    <p className="mt-1 text-xs font-semibold text-[#A05B61]">
      O exame foi cancelado.
    </p>
  );
}

function Campo({
  children,
}: {
  children:
    React.ReactNode;
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
    React.ReactNode;
  obrigatorio?: boolean;
}) {
  return (
    <label
      htmlFor={
        htmlFor
      }
      className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.1em] text-[#5F706B]"
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

const inputClass =
  "w-full rounded-xl border border-[#D7E1DE] bg-[#F9FBFA] px-3 py-2.5 text-sm font-semibold text-[#34423F] outline-none transition placeholder:font-medium placeholder:text-[#96A39F] hover:border-[#C7D4D0] focus:border-[#7FA89A] focus:bg-white focus:ring-2 focus:ring-[#7FA89A]/20 disabled:cursor-not-allowed disabled:bg-[#EEF2F0] disabled:text-[#84918D]";