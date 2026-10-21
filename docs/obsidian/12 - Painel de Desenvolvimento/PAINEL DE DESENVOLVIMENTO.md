# MRA Vet - Painel de Desenvolvimento

> Painel inicial baseado em inventario estrutural. Presenca de rota ou migration NAO comprova funcionamento, instalacao no banco nem testes.

## Visao geral

- Ultima coleta do inventario: **2026-10-21 10:11:46**
- Branch: `feature/usuarios-permissoes`
- Ultimo commit identificado: `90e9141d docs: adiciona memoria tecnica inicial do MRA Vet no Obsidian`
- Rotas listadas: **26**
- Pastas de migrations com nome datado: **17** (o inventario tambem lista `refs`, que nao e migration datada)
- Alteracoes rastreadas no momento da coleta: **36**

## Navegacao

- [[00 - PAINEL PRINCIPAL]]
- [[Mapa dos Modulos]]
- [[Problemas e Correcoes]]
- [[Proximas Implementacoes]]
- [[Protocolo de Continuidade]]
- [[RESUMO PARA CHATGPT]] (relatorio local)
- [[Diagnostico - Inventario Atual]] (relatorio local)

## Areas identificadas e validacao

| Area | Evidencia no inventario | Estado funcional |
|---|---|---|
| Acesso, usuarios e permissoes | 6 rota(s) relacionada(s) | Nao verificado |
| Pacientes e clientes | 5 rota(s) relacionada(s) | Nao verificado |
| Historico e patologias | 1 rota(s) relacionada(s) | Nao verificado |
| Documentos e anexos | 6 rota(s) relacionada(s) | Nao verificado |
| Midias e receitas | 5 rota(s) relacionada(s) | Nao verificado |
| Internacao | 1 rota(s) relacionada(s) | Nao verificado |

## Pendencias a validar

- [ ] Confirmar estado real da internacao (desenvolvimento anteriormente pausado).
- [ ] Validar documentos, permissoes e anexos em homologacao.
- [ ] Validar acentuacao e interface do site.
- [ ] Consultar resultados de testes existentes antes de marcar modulos como concluidos.
- [ ] Revisar os documentos permanentes antes de publica-los.

## Registro manual de verificacoes

| Data | Modulo | Evidencia/teste | Resultado | Responsavel |
|---|---|---|---|---|
| - | - | - | Pendente | - |

## Atualizar dados

No terminal do projeto: ``npm.cmd run memoria`` atualiza os relatorios automaticos.
Este painel e manual e NAO sera sobrescrito pelo atualizador. Revise as metricas quando necessario.

## Seguranca

Nao inserir credenciais, dados reais de clientes ou pacientes, tokens, senhas ou historicos sensiveis neste painel.
Nao executar git add . ou git push sem revisao.
