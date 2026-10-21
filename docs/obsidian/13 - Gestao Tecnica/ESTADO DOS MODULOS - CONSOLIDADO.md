# Estado dos Módulos — Consolidado

> Base: `STATUS-MODULOS.md`, `CONTINUIDADE-MRA-VET.md` e inventário de 21/10/2026. Estados são **relatos documentais**, não resultado de testes executados agora.

| Módulo | Situação documentada | Validação pendente |
|---|---|---|
| Ficha do paciente e histórico | Implementação parcial | Persistência, edição, filtros, isolamento por unidade, responsividade |
| Atendimento, patologias e exames | Implementação parcial | Fluxos completos, integridade, permissões |
| Vacinas, pesos e anotações | Implementação parcial | Persistência, edição, histórico e estados de interface |
| Receita | Editor/PDF preparados segundo registro | Fidelidade do PDF, CRMV, autorização e histórico |
| Documentos | Editor/PDF preparados segundo registro | Templates, anexos, acentuação, exclusão lógica |
| Fotos | Formulário simplificado segundo registro | Upload múltiplo, visualização, exclusão e isolamento |
| Vídeos | Formulário simplificado segundo registro | Reprodução, range, upload e autorização |
| Internação/leitos/estoque/comanda | Incompleto | Separação clínica/administrativa, concorrência, movimentação e cobrança idempotentes |
| Resumo fixo do paciente | Captura visual relatada | Responsividade e ausência de sobreposição |
| Permissões Fase 1 | Instalação e testes relatados | Validação end-to-end atual |
| Permissões Fase 2 | Instalação e painel visual relatados | Persistência, auditoria, isolamento |
| Permissões Fase 3 — anexos | Instalação relatada, sem concessão automática | Testes positivos/negativos e por unidade (ver plano) |

## Critérios para mudar de estado

- **Preparado:** arquivos identificados ou implantação informada.
- **Instalado:** execução identificada com evidência no ambiente relevante.
- **Validado:** fluxo real testado e registrado com resultado esperado e obtido.
- **Apto a produção:** requer revisão de segurança, integridade clínica e critérios específicos; não inferir de testes superficiais.

## Arquivos de referência

- [[PLANO DE VALIDACAO - PERMISSOES FASE 3]]
- [[DECISOES E RISCOS - CONSOLIDADO]]
- [[PAINEL DE DESENVOLVIMENTO]]
