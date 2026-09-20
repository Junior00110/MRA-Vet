"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileImage,
  FileText,
  Loader2,
  Paperclip,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

type AnexoExistente = {
  id: number;
  nomeOriginal: string;
  mimeType: string;
  tamanhoBytes: number;
  profissionalNome?: string | null;
  createdAt?: string | null;
};

type PacienteExameAnexosProps = {
  exameId: number;
  pacienteId: number;
  anexos?: AnexoExistente[];
};

type StatusArquivo =
  | "AGUARDANDO"
  | "ENVIANDO"
  | "SUCESSO"
  | "ERRO";

type ArquivoSelecionado = {
  id: string;
  arquivo: File;
  status: StatusArquivo;
  mensagem?: string;
};

const TAMANHO_MAXIMO =
  25 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function PacienteExameAnexos({
  exameId,
  pacienteId,
  anexos = [],
}: PacienteExameAnexosProps) {
  const router =
    useRouter();

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    arquivos,
    setArquivos,
  ] = useState<
    ArquivoSelecionado[]
  >([]);

  const [
    arrastando,
    setArrastando,
  ] = useState(false);

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const [
    anexoParaExcluir,
    setAnexoParaExcluir,
  ] = useState<
    AnexoExistente | null
  >(null);

  const [
    excluindo,
    setExcluindo,
  ] = useState(false);

  const [
    erroExclusao,
    setErroExclusao,
  ] = useState<
    string | null
  >(null);

  function criarIdArquivo(
    arquivo: File,
    indice: number,
  ) {
    return [
      arquivo.name,
      arquivo.size,
      arquivo.lastModified,
      indice,
      crypto.randomUUID(),
    ].join("-");
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

  function adicionarArquivos(
    lista: FileList | File[],
  ) {
    const novos =
      Array.from(
        lista,
      ).map(
        (
          arquivo,
          indice,
        ): ArquivoSelecionado => {
          const erro =
            validarArquivo(
              arquivo,
            );

          return {
            id: criarIdArquivo(
              arquivo,
              indice,
            ),

            arquivo,

            status: erro
              ? "ERRO"
              : "AGUARDANDO",

            mensagem:
              erro ?? undefined,
          };
        },
      );

    setArquivos(
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

    setArrastando(false);

    if (
      enviando ||
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
    if (enviando) {
      return;
    }

    setArquivos(
      (atuais) =>
        atuais.filter(
          (item) =>
            item.id !== id,
        ),
    );
  }

  function atualizarArquivo(
    id: string,
    alteracoes: Partial<ArquivoSelecionado>,
  ) {
    setArquivos(
      (atuais) =>
        atuais.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  ...alteracoes,
                }
              : item,
        ),
    );
  }

  async function enviarArquivo(
    item: ArquivoSelecionado,
  ) {
    atualizarArquivo(
      item.id,
      {
        status:
          "ENVIANDO",
        mensagem:
          undefined,
      },
    );

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
            method: "POST",
            body: formData,
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
        atualizarArquivo(
          item.id,
          {
            status:
              "ERRO",

            mensagem:
              dados.mensagem ||
              "Não foi possível enviar o arquivo.",
          },
        );

        return false;
      }

      atualizarArquivo(
        item.id,
        {
          status:
            "SUCESSO",

          mensagem:
            "Arquivo anexado.",
        },
      );

      return true;
    } catch {
      atualizarArquivo(
        item.id,
        {
          status:
            "ERRO",

          mensagem:
            "Falha de comunicação durante o envio.",
        },
      );

      return false;
    }
  }

  async function enviarTodos() {
    if (enviando) {
      return;
    }

    const pendentes =
      arquivos.filter(
        (item) =>
          item.status ===
          "AGUARDANDO",
      );

    if (
      pendentes.length === 0
    ) {
      return;
    }

    setEnviando(true);

    let algumEnviado =
      false;

    try {
      for (
        const item of
        pendentes
      ) {
        const sucesso =
          await enviarArquivo(
            item,
          );

        if (sucesso) {
          algumEnviado =
            true;
        }
      }
    } finally {
      setEnviando(false);
    }

    if (algumEnviado) {
      setArquivos(
        (atuais) =>
          atuais.filter(
            (item) =>
              item.status !==
              "SUCESSO",
          ),
      );

      router.refresh();
    }
  }

  function abrirAnexo(
    anexoId: number,
  ) {
    window.open(
      `/api/paciente-exames/anexos/${anexoId}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function confirmarExclusao() {
    if (
      !anexoParaExcluir ||
      excluindo
    ) {
      return;
    }

    setExcluindo(true);
    setErroExclusao(null);

    try {
      const resposta =
        await fetch(
          `/api/paciente-exames/anexos/${anexoParaExcluir.id}`,
          {
            method:
              "DELETE",
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
        setErroExclusao(
          dados.mensagem ||
            "Não foi possível excluir o anexo.",
        );

        return;
      }

      setAnexoParaExcluir(
        null,
      );

      router.refresh();
    } catch {
      setErroExclusao(
        "Falha de comunicação ao excluir o anexo.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  const quantidadePendente =
    arquivos.filter(
      (item) =>
        item.status ===
        "AGUARDANDO",
    ).length;

  return (
    <>
      <section
        aria-labelledby={`titulo-anexos-exame-${exameId}`}
        aria-busy={enviando || excluindo}
        className="rounded-2xl border border-[#DDE6E2] bg-[#FBFCFA] p-4"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F1] text-[#55786D]">
            <Paperclip
              size={19}
            />
          </span>

          <div>
            <h3
              id={`titulo-anexos-exame-${exameId}`}
              className="text-sm font-black text-[#34423F]"
            >
              Anexos do exame
            </h3>

            <p className="mt-1 text-xs font-medium leading-relaxed text-[#71807C]">
              Laudos, resultados, imagens e outros documentos relacionados a este exame.
            </p>
          </div>
        </div>

        {anexos.length >
          0 && (
          <div className="mt-4 space-y-2">
            {anexos.map(
              (anexo) => (
                <AnexoExistenteItem
                  key={
                    anexo.id
                  }
                  anexo={
                    anexo
                  }
                  onAbrir={() =>
                    abrirAnexo(
                      anexo.id,
                    )
                  }
                  onExcluir={() => {
                    setErroExclusao(
                      null,
                    );

                    setAnexoParaExcluir(
                      anexo,
                    );
                  }}
                />
              ),
            )}
          </div>
        )}

        {anexos.length ===
          0 && (
          <div className="mt-4 rounded-xl border border-dashed border-[#D7E1DE] bg-white px-4 py-4 text-center">
            <Paperclip
              size={20}
              className="mx-auto text-[#9AA7A3]"
            />

            <p className="mt-2 text-sm font-bold text-[#60706B]">
              Nenhum anexo neste exame
            </p>

            <p className="mt-1 text-xs font-medium text-[#87938F]">
              Você pode adicionar PDFs ou imagens abaixo.
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          onChange={
            selecionarArquivos
          }
          disabled={enviando}
          className="sr-only"
          aria-label="Selecionar arquivos para anexar ao exame"
        />

        <div
          role="button"
          tabIndex={
            enviando
              ? -1
              : 0
          }
          aria-disabled={
            enviando
          }
          aria-describedby={`descricao-upload-exame-${exameId}`}
          onClick={() => {
            if (!enviando) {
              inputRef.current?.click();
            }
          }}
          onKeyDown={(
            event,
          ) => {
            if (
              enviando
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

              inputRef.current?.click();
            }
          }}
          onDragEnter={(
            event,
          ) => {
            event.preventDefault();

            if (
              !enviando
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
              !enviando
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
            enviando
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

          <p
            id={`descricao-upload-exame-${exameId}`}
            className="mt-3 text-[11px] font-bold text-[#8A9692]"
          >
            PDF, JPG, PNG ou WEBP • máximo de 25 MB por arquivo
          </p>
        </div>

        {arquivos.length >
          0 && (
          <div
            className="mt-4 space-y-2"
            aria-live="polite"
          >
            {arquivos.map(
              (item) => (
                <ArquivoItem
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  enviando={
                    enviando
                  }
                  onRemover={() =>
                    removerArquivo(
                      item.id,
                    )
                  }
                />
              ),
            )}
          </div>
        )}

        {quantidadePendente >
          0 && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-[#71807C]">
              {quantidadePendente ===
              1
                ? "1 arquivo aguardando envio."
                : `${quantidadePendente} arquivos aguardando envio.`}
            </p>

            <button
              type="button"
              onClick={
                enviarTodos
              }
              disabled={
                enviando
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-[#174A5B] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#123E4D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174A5B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Enviando...
                </>
              ) : (
                <>
                  <Upload
                    size={16}
                  />

                  Enviar anexos
                </>
              )}
            </button>
          </div>
        )}

        {erroExclusao && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border border-[#F0CDCF] bg-[#FFF1F2] px-4 py-3 text-sm font-bold text-[#A8444D]"
          >
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
            />

            <span>
              {erroExclusao}
            </span>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={
          anexoParaExcluir !==
          null
        }
        title="Excluir anexo"
        description="O anexo deixará de aparecer no prontuário, mas o arquivo será preservado para histórico e auditoria."
        itemLabel="Arquivo"
        itemName={
          anexoParaExcluir
            ?.nomeOriginal ??
          null
        }
        confirmLabel="Excluir anexo"
        loadingLabel="Excluindo..."
        cancelLabel="Cancelar"
        loading={
          excluindo
        }
        onConfirm={
          confirmarExclusao
        }
        onCancel={() => {
          if (
            excluindo
          ) {
            return;
          }

          setErroExclusao(
            null,
          );

          setAnexoParaExcluir(
            null,
          );
        }}
      />
    </>
  );
}

function AnexoExistenteItem({
  anexo,
  onAbrir,
  onExcluir,
}: {
  anexo: AnexoExistente;
  onAbrir: () => void;
  onExcluir: () => void;
}) {
  const ehImagem =
    anexo.mimeType.startsWith(
      "image/",
    );

  const tipo =
    anexo.mimeType ===
    "application/pdf"
      ? "PDF"
      : "Imagem";

  return (
    <div className="rounded-xl border border-[#DDE6E2] bg-white p-3">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4F1] text-[#55786D]">
          {ehImagem ? (
            <FileImage
              size={19}
            />
          ) : (
            <FileText
              size={19}
            />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-black text-[#34423F]"
            title={
              anexo.nomeOriginal
            }
          >
            {
              anexo.nomeOriginal
            }
          </p>

          <p className="mt-1 text-xs font-semibold text-[#7B8985]">
            {tipo}
            {" • "}
            {formatarTamanho(
              anexo.tamanhoBytes,
            )}
          </p>

          {(anexo.profissionalNome ||
            anexo.createdAt) && (
            <p className="mt-1 text-xs font-medium text-[#8A9692]">
              {anexo.profissionalNome
                ? `Anexado por ${anexo.profissionalNome}`
                : "Anexo"}

              {anexo.createdAt
                ? ` • ${formatarData(anexo.createdAt)}`
                : ""}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={
                onAbrir
              }
              className="flex items-center gap-1.5 rounded-lg border border-[#CFE0DA] bg-[#F6FAF8] px-3 py-1.5 text-xs font-black text-[#496D62] transition hover:bg-[#ECF5F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A]"
            >
              <ExternalLink
                size={13}
              />

              Abrir
            </button>

            <button
              type="button"
              onClick={
                onExcluir
              }
              className="flex items-center gap-1.5 rounded-lg border border-[#F0D0D3] bg-white px-3 py-1.5 text-xs font-black text-[#B44A54] transition hover:bg-[#FFF2F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D36B75]"
            >
              <Trash2
                size={13}
              />

              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArquivoItem({
  item,
  enviando,
  onRemover,
}: {
  item: ArquivoSelecionado;
  enviando: boolean;
  onRemover: () => void;
}) {
  const ehImagem =
    item.arquivo.type.startsWith(
      "image/",
    );

  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E0E7E4] bg-white p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F4F2] text-[#607C73]">
        {ehImagem ? (
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
            item.arquivo
              .name
          }
        </p>

        <p className="mt-0.5 text-xs font-medium text-[#82908C]">
          {formatarTamanho(
            item.arquivo
              .size,
          )}
        </p>

        <StatusArquivoVisual
          status={
            item.status
          }
          mensagem={
            item.mensagem
          }
        />
      </div>

      {item.status ===
        "AGUARDANDO" && (
        <button
          type="button"
          onClick={
            onRemover
          }
          disabled={
            enviando
          }
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#71807C] transition hover:bg-[#F1F4F3] hover:text-[#B44A54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FA89A] disabled:opacity-40"
          aria-label={`Remover ${item.arquivo.name} da lista`}
        >
          <X
            size={15}
          />
        </button>
      )}
    </div>
  );
}

function StatusArquivoVisual({
  status,
  mensagem,
}: {
  status: StatusArquivo;
  mensagem?: string;
}) {
  if (
    status ===
    "ENVIANDO"
  ) {
    return (
      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#55786D]">
        <Loader2
          size={13}
          className="animate-spin"
        />

        Enviando...
      </div>
    );
  }

  if (
    status ===
    "SUCESSO"
  ) {
    return (
      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#397057]">
        <CheckCircle2
          size={13}
        />

        {mensagem ||
          "Arquivo anexado."}
      </div>
    );
  }

  if (
    status ===
    "ERRO"
  ) {
    return (
      <div
        role="alert"
        className="mt-1.5 flex items-start gap-1.5 text-xs font-bold text-[#B44A54]"
      >
        <AlertCircle
          size={13}
          className="mt-0.5 shrink-0"
        />

        <span>
          {mensagem ||
            "Não foi possível enviar."}
        </span>
      </div>
    );
  }

  return (
    <p className="mt-1.5 text-xs font-semibold text-[#7B8985]">
      Aguardando envio
    </p>
  );
}

function formatarTamanho(
  bytes: number,
) {
  if (
    bytes < 1024
  ) {
    return `${bytes} B`;
  }

  const kb =
    bytes / 1024;

  if (
    kb < 1024
  ) {
    return `${kb.toFixed(
      1,
    )} KB`;
  }

  const mb =
    kb / 1024;

  return `${mb.toFixed(
    1,
  )} MB`;
}

function formatarData(
  valor: string,
) {
  const data =
    new Date(valor);

  if (
    Number.isNaN(
      data.getTime(),
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle:
        "short",
      timeStyle:
        "short",
    },
  ).format(data);
}