# Continuidade Operacional — MRA Vet

> Síntese preparada a partir dos documentos enviados em 21/10/2026. Não substitui consulta ao código atual.

## Ponto de retomada

Prioridade: **validar o piloto de permissões Fase 3** (`prontuario.anexo.criar`) em ambiente de homologação com dados fictícios, incluindo permissão concedida, negada, revogada e isolamento entre unidades. Não expandir para outras APIs até concluir essa validação.

## Estado e decisões

- Fase 1: instalação/testes relatados, sem equivaler à validação completa atual.
- Fase 2: instalação e painel visual relatados; persistência/auditoria ainda precisam de teste.
- Fase 3: instalação relatada, sem concessão automática; testes P3-01 a P3-09 pendentes.
- Internação: incompleta, requer controles de concorrência, segregação e consumo/cobrança idempotentes.
- Documentos, acentuação, fotos, vídeos e PDFs: validações pendentes.
- Parte da interface do paciente foi observada visualmente; não caracteriza aprovação de fluxo.

## Fontes

- [[CENTRAL DE CONTROLE - MRA VET]]
- [[ESTADO DOS MODULOS - CONSOLIDADO]]
- [[PLANO DE VALIDACAO - PERMISSOES FASE 3]]
- [[DECISOES E RISCOS - CONSOLIDADO]]
- [[Diagnostico - Inventario Atual]]

## Rotina de trabalho

1. Conferir branch, `git status` e diferenças locais antes de qualquer mudança.
2. Coletar arquivos necessários em uma única etapa e produzir backup de arquivos afetados.
3. Testar alterações antes de considerar prontas.
4. Anotar resultados e decisões em documentos permanentes revisados.
5. Executar `npm.cmd run memoria` para atualizar apenas os relatórios automáticos locais.
6. Revisar alterações e possíveis segredos antes de qualquer commit/push seletivo.

## Compartilhar com o ChatGPT

Fornecer esta nota, o resumo local atualizado e os documentos relevantes à tarefa. O Obsidian **não sincroniza automaticamente** todas as notas com o ChatGPT.
