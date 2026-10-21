# Central de Controle — MRA Vet

> Consolidação inicial dos documentos técnicos recebidos em 21/10/2026. **Não é uma auditoria do código nem prova de funcionamento.**

## Prioridade atual

**Validar a Fase 3 piloto de permissões por unidade** antes de expandir as regras para outras APIs.

- [[PLANO DE VALIDACAO - PERMISSOES FASE 3]]
- [[ESTADO DOS MODULOS - CONSOLIDADO]]
- [[DECISOES E RISCOS - CONSOLIDADO]]
- [[CONTINUIDADE OPERACIONAL - MRA VET]]

## Indicadores da coleta (21/10/2026 10:11)

| Indicador | Registro |
|---|---|
| Branch observada | `feature/usuarios-permissoes` |
| Último commit na coleta | `90e9141d` (documentação inicial) |
| Rotas identificadas | 26 |
| Migrações datadas identificadas | 17 |
| Diretório adicional na lista de migrações | `refs` (não é uma migração datada) |
| Arquivos rastreados com alteração | 36 |

Estes números são um retrato histórico e podem estar desatualizados. Para atualizar o inventário local: `npm.cmd run memoria`.

## Acesso ao acervo

- [[PAINEL DE DESENVOLVIMENTO]] — painel manual existente, preservado
- [[Diagnostico - Inventario Atual]] — inventário local atualizado pelo comando
- [[RESUMO PARA CHATGPT]] — relatório local, precisa ser disponibilizado à conversa
- [[Protocolo de Continuidade]] — documento inicial versionado
- [[Mapa dos Modulos]] — mapa inicial versionado

## Regra de atualização

Registrar testes com data, ambiente, resultado e evidência anonimizada. Não marcar módulos como validados por existência de rotas, instalação relatada ou aprovação de TypeScript/ESLint.

## Segurança

Não publicar dados de pacientes, nomes reais, credenciais, `.env`, mídia clínica nem conteúdo bruto de backups. Antes de subir documentação ao GitHub, revisar manualmente os novos arquivos.
