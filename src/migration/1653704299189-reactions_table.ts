import {MigrationInterface, QueryRunner} from "typeorm";

export class reactionsTable1653704299189 implements MigrationInterface {
    name = 'reactionsTable1653704299189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ReactionType" AS ENUM('THUMBSUP', 'HEART', 'CLAP', 'DISLIKE')`);
        await queryRunner.query(`CREATE TABLE "Reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."ReactionType" NOT NULL, "postId" uuid NOT NULL, "userId" uuid NOT NULL, "userFirstName" character varying NOT NULL, "userLastName" character varying NOT NULL, "userName" character varying NOT NULL, "userImageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e7a9226a42a2a796ce5993a5a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf2018739f90313e8f7b39c4b3" ON "Reactions" ("postId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cf2018739f90313e8f7b39c4b3"`);
        await queryRunner.query(`DROP TABLE "Reactions"`);
        await queryRunner.query(`DROP TYPE "public"."ReactionType"`);
    }

}
