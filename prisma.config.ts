import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // CI環境ではダミーURLを使用（prisma generateにはDB接続不要）
    url: process.env.DIRECT_URL || 'postgresql://dummy:dummy@localhost:5432/dummy',
  },
});
