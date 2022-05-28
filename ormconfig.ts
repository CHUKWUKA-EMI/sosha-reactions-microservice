/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import * as fs from 'fs';

config();

const ORMCONFIG: TypeOrmModuleOptions = {
  type: 'postgres' || 'cockroachdb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  cert: fs.readFileSync('./root.crt').toString(),
  ssl: { rejectUnauthorized: false },
  extra: {
    options:
      process.env.NODE_ENV === 'production'
        ? '--cluster=sosha-reactions-2321'
        : '',
  },
  synchronize: false,
  logging: true,
  migrationsRun: false,
  entities: [Reaction],
  migrations: ['dist/src/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default ORMCONFIG;
