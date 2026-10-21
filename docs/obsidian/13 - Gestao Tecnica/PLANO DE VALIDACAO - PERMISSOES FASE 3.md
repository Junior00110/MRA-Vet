# Plano de Validação — Permissões Fase 3

**Objetivo:** validar `prontuario.anexo.criar` para recepção por unidade, mantendo negado o acesso clínico não autorizado. **Nenhum dos casos abaixo foi comprovado como executado no material enviado.** Usar apenas contas, pacientes e documentos fictícios em homologação.

| ID | Cenário | Resultado esperado | Estado |
|---|---|---|---|
| P3-01 | Recepção A sem permissão | Upload negado | Não executado |
| P3-02 | Master concede permissão à recepção A | Upload de PDF fictício do paciente fictício A autorizado | Não executado |
| P3-03 | Recepção A tenta anexar ao paciente B | Negado, sem vazamento | Não executado |
| P3-04 | Recepção A tenta ler histórico completo | Negado sem permissão clínica | Não executado |
| P3-05 | Recepção A tenta emitir receita | Negado sem autorização específica | Não executado |
| P3-06 | Master revoga a permissão | Nova requisição negada | Não executado |
| P3-07 | Concessão/revogação | Auditoria identifica autor, unidade, ação e horário | Não executado |
| P3-08 | Arquivo inválido/grande/MIME falso | Rejeição sem persistência | Não executado |
| P3-09 | Upload repetido/erro de rede | Sem registro parcial ou duplicação inesperada | Não executado |

## Regras de decisão

- Não conceder privilégios automaticamente.
- Verificar autorização na API e na camada de dados, não apenas na interface.
- Não liberar outras APIs antes de passar testes positivos e negativos deste piloto.
- Registrar data, ambiente, identificadores fictícios, resultado e evidência sem informações reais.

## Registro de execução

| Data | ID | Ambiente | Obtido | Evidência anonimizada | Decisão |
|---|---|---|---|---|---|
| — | — | — | Não executado | — | Pendente |
