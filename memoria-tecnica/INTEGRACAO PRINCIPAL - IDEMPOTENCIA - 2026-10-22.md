# MRA Vet — Integração da Idempotência no Principal

**Data:** 22/10/2026
**Situação:** Integração técnica concluída
**Ambiente:** Principal
**Banco:** mra_vet

## 1. Origem da implementação

A correção da idempotência foi desenvolvida e validada
na homologação isolada do MRA Vet.

Na Fase 3, os nove testes funcionais planejados foram
aprovados dentro dos seus respectivos escopos.

O teste 8 incluiu:
- Repetição da mesma operação.
- Conflito de chave: HTTP 409.
- Requisições concorrentes.
- Envios intencionais independentes.

## 2. Alterações integradas ao principal

Arquivos:
- src/app/api/paciente-documentos/route.ts
- src/components/pacientes/AnexarDocumentoSimples.tsx
- src/lib/documentos/idempotencia.ts

Banco:
- Nova tabela public.mra_documento_idempotencia.
- Índice e permissões de acesso configurados.
- Nenhum dado fictício da homologação foi importado.

## 3. Segurança PostgreSQL

Conta exclusiva da aplicação: mra_vet_app.

Validações:
- Conta sem superusuário.
- Sem criação de bancos ou usuários.
- Sem permissão CREATE no schema public.
- Acesso validado às 39 tabelas existentes.
- Acesso validado às 39 sequências existentes.
- Conexão Node.js confirmada no banco mra_vet.

O arquivo .env principal foi atualizado, com backup.

Nenhuma senha ou string de conexão é registrada
neste documento.

## 4. Backups

Banco principal:
%LOCALAPPDATA%\MRA-Vet\Backups\integracao-idempotencia\
mra-vet-antes-idempotencia-20261022-091001.dump

Código:
%LOCALAPPDATA%\MRA-Vet\Backups\integracao-idempotencia\
codigo-20261022-093222

.env:
%LOCALAPPDATA%\MRA-Vet\Backups\conexao-principal\
.env-antes-mra-vet-app-20261022-093114.bak

Observação: catálogo do backup PostgreSQL verificado.
Restauração completa ainda não foi ensaiada.

## 5. Validações do principal

- TypeScript aprovado.
- Build Next.js aprovado.
- Servidor principal reiniciado na porta 3000.
- Login funcionando.
- Lista de clientes funcionando.
- Ficha de paciente funcionando.
- Histórico clínico funcionando.
- Vacinas e exames funcionando.
- Nova tabela acessível por mra_vet_app.
- Registros iniciais de idempotência: 0.
- Requisição não autenticada à API: HTTP 401.

## 6. Limites da validação

A prevenção de duplicidade e a concorrência
foram testadas na homologação.

No banco principal não foi realizado upload fictício
para evitar modificações nos dados clínicos.

HTTP 401 comprova bloqueio de acesso não autenticado,
mas não comprova sozinho o comportamento de idempotência.

Permanecem pendentes:
- Teste de restauração completa do backup.
- Recuperação após interrupção abrupta de uploads.
- Revisão de outros formulários de documentos.
- Regressão ampliada antes de implantação externa.
- Correção do executor HTTP automatizado do teste 6.

## 7. Continuidade

A integração está ativa no ambiente principal local.
Não repetir migrações nem instaladores já concluídos.

A homologação permanece isolada na porta 3100.

O módulo de internação hospitalar permanece
pausado e incompleto, sem retomada autorizada.

Próxima etapa:
Prosseguir com o desenvolvimento planejado,
mantendo backups, homologação e testes por módulo.