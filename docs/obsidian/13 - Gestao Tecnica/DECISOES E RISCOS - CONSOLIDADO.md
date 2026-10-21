# Decisões e Riscos — Consolidado

> Síntese de `DECISOES-TECNICAS.md` fornecido. Validar implementação real antes de assumir conformidade.

## Autorizações

- Decisão: permissão por **unidade + perfil + exceção individual + contexto**.
- Negar por padrão. Anexar prontuário não equivale a ler histórico, prescrever nem excluir.
- Master não pode contornar obrigações profissionais, rastreabilidade ou isolamento entre unidades.
- APIs e acesso a dados devem validar usuário, recurso, paciente e unidade.
- Risco principal: escalada de privilégios e acesso cruzado entre unidades.

## Internação e estoque

- Um leito não pode conter duas internações ativas; exigir transações/restrições no banco.
- Prescrição não deve reduzir estoque; a execução confirmada movimenta e cobra, com idempotência e auditoria.
- Kits de 24 horas são previsão e não baixa antecipada de estoque.
- Separar cadastro/estoque/kits administrativos de prescrição e execução clínica.
- Risco principal: dupla cobrança/baixa, concorrência e perda de rastreabilidade.

## Documentos e infraestrutura

- Verificar acentuação, fidelidade de PDFs e autorização; não simular assinatura certificada.
- Manter arquivos clínicos privados e exclusão lógica auditável.
- Antes de alterar contratos Prisma ou executar migrações, conferir arquivos reais e backup PostgreSQL.
- Não realizar Git destrutivo, commits/push automáticos ou inclusão de dados sensíveis em documentação.

## Pendências prioritárias

1. Executar plano piloto de permissões Fase 3 em homologação.
2. Verificar persistência/auditoria da Fase 2.
3. Revisar a separação administrativa/clínica da internação antes de retomá-la.
4. Validar documentação/PDFs/acentuação e isolamento de mídia.
