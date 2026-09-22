ALTER TABLE "public"."pacientePatologia"
DROP CONSTRAINT "pacientePatologia_status_check_0fb0281a";

UPDATE "public"."pacientePatologia"
SET "status" = 'EM_ACOMPANHAMENTO'
WHERE "status" = 'CONFIRMADA';

UPDATE "public"."pacientePatologia"
SET "status" = 'TRATADA'
WHERE "status" = 'RESOLVIDA';

CREATE TABLE "public"."doencaVeterinaria" (
  "ativo" bool DEFAULT true NOT NULL,
  "categoria" text,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  "especie" text NOT NULL,
  "id" SERIAL NOT NULL,
  "nome" text NOT NULL,
  "sinonimos" text,
  "updatedAt" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "doencaVeterinaria_especie_check_992bef08"
    CHECK ("especie" IN ('CANINO', 'FELINO', 'AMBOS'))
);

ALTER TABLE "public"."pacientePatologia"
ADD COLUMN "doencaId" int4;

ALTER TABLE "public"."doencaVeterinaria"
ADD CONSTRAINT "doencaVeterinaria_nome_especie_key"
UNIQUE ("nome", "especie");

ALTER TABLE "public"."pacientePatologia"
ADD CONSTRAINT "pacientePatologia_status_check_1a591222"
CHECK (
  "status" IN (
    'SUSPEITA',
    'EM_ACOMPANHAMENTO',
    'TRATADA',
    'SEM_PROBLEMA_CLINICO'
  )
);

CREATE INDEX "pacientePatologia_doencaId_idx_09d96f81"
ON "public"."pacientePatologia" ("doencaId");

ALTER TABLE "public"."pacientePatologia"
ADD CONSTRAINT "pacientePatologia_doencaId_fkey"
FOREIGN KEY ("doencaId")
REFERENCES "public"."doencaVeterinaria" ("id");
