## Nx Affected Tasks (Local Cache) (build) (pull_request)

Run npx nx affected -t build --parallel=3 --configuration=ci

 NX   No explicit --base argument provided, but found environment variable NX_BASE so using its value as the affected base: cd82509380cbe640a62f13c4eebf26788cd01ede


 NX   No explicit --head argument provided, but found environment variable NX_HEAD so using its value as the affected head: 135208dfe594f680f86a2cd9d9812c4305775257


 NX   Running target build for 5 projects:

- backend-proxy
- frontend
- api-client
- shared-types
- utils



✅ > nx run shared-types:build
  
  Compiling TypeScript files for project "shared-types"...
  Done compiling TypeScript files for project "shared-types".
✅ > nx run utils:build
  
  Compiling TypeScript files for project "utils"...
  Done compiling TypeScript files for project "utils".
❌ > nx run backend-proxy:build:ci
  
  Compiling TypeScript files for project "backend-proxy"...
  apps/backend-proxy/src/middleware/rateLimiter.ts:1:23 - error TS7016: Could not find a declaration file for module 'express-rate-limit'. '/home/runner/work/crypture/crypture/node_modules/express-rate-limit/lib/express-rate-limit.js' implicitly has an 'any' type.
    Try `npm i --save-dev @types/express-rate-limit` if it exists or add a new declaration (.d.ts) file containing `declare module 'express-rate-limit';`
  
  1 import rateLimit from 'express-rate-limit';
                          ~~~~~~~~~~~~~~~~~~~~
  apps/backend-proxy/tests/containers/testcontainers-setup.ts:1:65 - error TS2307: Cannot find module '@testcontainers/postgresql' or its corresponding type declarations.
  
  1 import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
                                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  apps/backend-proxy/tests/containers/testcontainers-setup.ts:2:55 - error TS2307: Cannot find module '@testcontainers/redis' or its corresponding type declarations.
  
  2 import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
                                                          ~~~~~~~~~~~~~~~~~~~~~~~
  
✅ > nx run api-client:build
✅ > nx run frontend:build:ci


 NX   Running target build for 5 projects failed

Failed tasks:

- backend-proxy:build:ci

Error: Process completed with exit code 1.

## NX Monorepo CI/CD (Local Cache) / NX Affected Tasks (Local Cache) (typecheck) (pull_request)

15s
Run npx nx affected -t typecheck --parallel=3 --configuration=ci

 NX   No explicit --base argument provided, but found environment variable NX_BASE so using its value as the affected base: cd82509380cbe640a62f13c4eebf26788cd01ede


 NX   No explicit --head argument provided, but found environment variable NX_HEAD so using its value as the affected head: 135208dfe594f680f86a2cd9d9812c4305775257


 NX   Running target typecheck for 5 projects and 2 tasks they depend on:

- backend-proxy
- frontend
- api-client
- shared-types
- utils



✅ > nx run shared-types:build
✅ > nx run shared-types:typecheck
❌ > nx run backend-proxy:typecheck
  
  > npm run typecheck
  
  
  > backend-proxy@1.0.0 typecheck
  > tsc --noEmit
  
  Error: src/middleware/rateLimiter.ts(1,23): error TS7016: Could not find a declaration file for module 'express-rate-limit'. '/home/runner/work/crypture/crypture/node_modules/express-rate-limit/lib/express-rate-limit.js' implicitly has an 'any' type.
    Try `npm i --save-dev @types/express-rate-limit` if it exists or add a new declaration (.d.ts) file containing `declare module 'express-rate-limit';`
  Error: tests/containers/testcontainers-setup.ts(1,65): error TS2307: Cannot find module '@testcontainers/postgresql' or its corresponding type declarations.
  Error: tests/containers/testcontainers-setup.ts(2,55): error TS2307: Cannot find module '@testcontainers/redis' or its corresponding type declarations.
  > npm run typecheck
  
  
  > backend-proxy@1.0.0 typecheck
  > tsc --noEmit
  
  Error: src/middleware/rateLimiter.ts(1,23): error TS7016: Could not find a declaration file for module 'express-rate-limit'. '/home/runner/work/crypture/crypture/node_modules/express-rate-limit/lib/express-rate-limit.js' implicitly has an 'any' type.
    Try `npm i --save-dev @types/express-rate-limit` if it exists or add a new declaration (.d.ts) file containing `declare module 'express-rate-limit';`
  Error: tests/containers/testcontainers-setup.ts(1,65): error TS2307: Cannot find module '@testcontainers/postgresql' or its corresponding type declarations.
  Error: tests/containers/testcontainers-setup.ts(2,55): error TS2307: Cannot find module '@testcontainers/redis' or its corresponding type declarations.
  Warning: command "npm run typecheck" exited with non-zero status code::endgroup::
✅ > nx run api-client:build
✅ > nx run api-client:typecheck
✅ > nx run utils:typecheck
✅ > nx run frontend:typecheck:ci


 NX   Running target typecheck for 5 projects and 2 tasks they depend on failed
