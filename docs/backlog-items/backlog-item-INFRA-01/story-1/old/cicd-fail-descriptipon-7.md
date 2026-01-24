we have 4 netlify cicd reported failures:
## failing checks
- Header rules - foliocryptoFailing after 34s — Deploy failed
- netlify/foliocrypto/deploy-preview — Deploy Preview failed.
- Pages changed - foliocryptoFailing after 33s — Deploy failed
- Redirect rules - foliocryptoFailing after 34s — Deploy failed

## Logs

### Header rules - foliocryptoFailing after 34s — Deploy failed

Deploy log
Why did it fail?




Maximize log
Initializing
Complete
Building
Failed
12:48:35 PM: Netlify Build                                                 
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: ❯ Version
12:48:35 PM:   @netlify/build 35.5.12
12:48:35 PM: ​
12:48:35 PM: ❯ Flags
12:48:35 PM:   accountId: 5fcf8a9d99dc7ae794e8f037
12:48:35 PM:   baseRelDir: true
12:48:35 PM:   buildId: 6974a3688457e30008d0db3c
12:48:35 PM:   deployId: 6974a3688457e30008d0db3e
12:48:35 PM: ​
12:48:35 PM: ❯ Current directory
12:48:35 PM:   /opt/build/repo
12:48:35 PM: ​
12:48:35 PM: ❯ Config file
12:48:35 PM:   /opt/build/repo/netlify.toml
12:48:35 PM: ​
12:48:35 PM: ❯ Context
12:48:35 PM:   deploy-preview
12:48:35 PM: ​
12:48:35 PM: build.command from netlify.toml                               
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: $ cd apps/frontend && npm install && npm run build:ci
12:48:36 PM: > frontend@0.0.0 prepare
12:48:36 PM: > husky install
12:48:36 PM: husky - install command is DEPRECATED
12:48:36 PM: .git can't be found
12:48:36 PM: up to date, audited 654 packages in 870ms
12:48:36 PM: 198 packages are looking for funding
12:48:36 PM:   run `npm fund` for details
12:48:36 PM: found 0 vulnerabilities
12:48:37 PM: > frontend@0.0.0 build:ci
12:48:37 PM: > tsc -b tsconfig.build.json && vite build
12:48:42 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:48:42 PM: src/services/coinGeckoApiService.ts(1,33): error TS2307: Cannot find module '@crypture/api-client' or its corresponding type declarations.
12:48:42 PM: src/services/coinGeckoApiService.ts(7,8): error TS2307: Cannot find module '@crypture/shared-types' or its corresponding type declarations.
12:48:42 PM: ​
12:48:42 PM: "build.command" failed                                        
12:48:42 PM: ────────────────────────────────────────────────────────────────
12:48:42 PM: ​
12:48:42 PM:   Error message
12:48:42 PM:   Command failed with exit code 2: cd apps/frontend && npm install && npm run build:ci (https://ntl.fyi/exit-code-2)
12:48:42 PM: ​
12:48:42 PM:   Error location
12:48:42 PM:   In build.command from netlify.toml:
12:48:42 PM:   cd apps/frontend && npm install && npm run build:ci
12:48:42 PM: ​
12:48:42 PM:   Resolved config
12:48:42 PM:   build:
12:48:42 PM:     base: /opt/build/repo
12:48:42 PM:     command: cd apps/frontend && npm install && npm run build:ci
12:48:42 PM:     commandOrigin: config
12:48:42 PM:     environment:
12:48:42 PM:       - REVIEW_ID
12:48:42 PM:       - VITE_COINGECKO_API_KEY
12:48:42 PM:       - NODE_VERSION
12:48:42 PM:       - NPM_VERSION
12:48:42 PM:     publish: /opt/build/repo/apps/frontend/dist
12:48:42 PM:     publishOrigin: config
12:48:42 PM:   redirects:
12:48:42 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:48:42 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:48:42 PM: Failing build: Failed to build site
12:48:43 PM: Finished processing build request in 33.048s

### netlify/foliocrypto/deploy-preview — Deploy Preview failed.
12:48:35 PM: Netlify Build                                                 
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: ❯ Version
12:48:35 PM:   @netlify/build 35.5.12
12:48:35 PM: ​
12:48:35 PM: ❯ Flags
12:48:35 PM:   accountId: 5fcf8a9d99dc7ae794e8f037
12:48:35 PM:   baseRelDir: true
12:48:35 PM:   buildId: 6974a3688457e30008d0db3c
12:48:35 PM:   deployId: 6974a3688457e30008d0db3e
12:48:35 PM: ​
12:48:35 PM: ❯ Current directory
12:48:35 PM:   /opt/build/repo
12:48:35 PM: ​
12:48:35 PM: ❯ Config file
12:48:35 PM:   /opt/build/repo/netlify.toml
12:48:35 PM: ​
12:48:35 PM: ❯ Context
12:48:35 PM:   deploy-preview
12:48:35 PM: ​
12:48:35 PM: build.command from netlify.toml                               
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: $ cd apps/frontend && npm install && npm run build:ci
12:48:36 PM: > frontend@0.0.0 prepare
12:48:36 PM: > husky install
12:48:36 PM: husky - install command is DEPRECATED
12:48:36 PM: .git can't be found
12:48:36 PM: up to date, audited 654 packages in 870ms
12:48:36 PM: 198 packages are looking for funding
12:48:36 PM:   run `npm fund` for details
12:48:36 PM: found 0 vulnerabilities
12:48:37 PM: > frontend@0.0.0 build:ci
12:48:37 PM: > tsc -b tsconfig.build.json && vite build
12:48:42 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:48:42 PM: src/services/coinGeckoApiService.ts(1,33): error TS2307: Cannot find module '@crypture/api-client' or its corresponding type declarations.
12:48:42 PM: src/services/coinGeckoApiService.ts(7,8): error TS2307: Cannot find module '@crypture/shared-types' or its corresponding type declarations.
12:48:42 PM: ​
12:48:42 PM: "build.command" failed                                        
12:48:42 PM: ────────────────────────────────────────────────────────────────
12:48:42 PM: ​
12:48:42 PM:   Error message
12:48:42 PM:   Command failed with exit code 2: cd apps/frontend && npm install && npm run build:ci (https://ntl.fyi/exit-code-2)
12:48:42 PM: ​
12:48:42 PM:   Error location
12:48:42 PM:   In build.command from netlify.toml:
12:48:42 PM:   cd apps/frontend && npm install && npm run build:ci
12:48:42 PM: ​
12:48:42 PM:   Resolved config
12:48:42 PM:   build:
12:48:42 PM:     base: /opt/build/repo
12:48:42 PM:     command: cd apps/frontend && npm install && npm run build:ci
12:48:42 PM:     commandOrigin: config
12:48:42 PM:     environment:
12:48:42 PM:       - REVIEW_ID
12:48:42 PM:       - VITE_COINGECKO_API_KEY
12:48:42 PM:       - NODE_VERSION
12:48:42 PM:       - NPM_VERSION
12:48:42 PM:     publish: /opt/build/repo/apps/frontend/dist
12:48:42 PM:     publishOrigin: config
12:48:42 PM:   redirects:
12:48:42 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:48:42 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:48:42 PM: Failing build: Failed to build site
12:48:43 PM: Finished processing build request in 33.048s

### Pages changed - foliocryptoFailing after 33s — Deploy failed

Building
Failed
12:48:35 PM: Netlify Build                                                 
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: ❯ Version
12:48:35 PM:   @netlify/build 35.5.12
12:48:35 PM: ​
12:48:35 PM: ❯ Flags
12:48:35 PM:   accountId: 5fcf8a9d99dc7ae794e8f037
12:48:35 PM:   baseRelDir: true
12:48:35 PM:   buildId: 6974a3688457e30008d0db3c
12:48:35 PM:   deployId: 6974a3688457e30008d0db3e
12:48:35 PM: ​
12:48:35 PM: ❯ Current directory
12:48:35 PM:   /opt/build/repo
12:48:35 PM: ​
12:48:35 PM: ❯ Config file
12:48:35 PM:   /opt/build/repo/netlify.toml
12:48:35 PM: ​
12:48:35 PM: ❯ Context
12:48:35 PM:   deploy-preview
12:48:35 PM: ​
12:48:35 PM: build.command from netlify.toml                               
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: $ cd apps/frontend && npm install && npm run build:ci
12:48:36 PM: > frontend@0.0.0 prepare
12:48:36 PM: > husky install
12:48:36 PM: husky - install command is DEPRECATED
12:48:36 PM: .git can't be found
12:48:36 PM: up to date, audited 654 packages in 870ms
12:48:36 PM: 198 packages are looking for funding
12:48:36 PM:   run `npm fund` for details
12:48:36 PM: found 0 vulnerabilities
12:48:37 PM: > frontend@0.0.0 build:ci
12:48:37 PM: > tsc -b tsconfig.build.json && vite build
12:48:42 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:48:42 PM: src/services/coinGeckoApiService.ts(1,33): error TS2307: Cannot find module '@crypture/api-client' or its corresponding type declarations.
12:48:42 PM: src/services/coinGeckoApiService.ts(7,8): error TS2307: Cannot find module '@crypture/shared-types' or its corresponding type declarations.
12:48:42 PM: ​
12:48:42 PM: "build.command" failed                                        
12:48:42 PM: ────────────────────────────────────────────────────────────────
12:48:42 PM: ​
12:48:42 PM:   Error message
12:48:42 PM:   Command failed with exit code 2: cd apps/frontend && npm install && npm run build:ci (https://ntl.fyi/exit-code-2)
12:48:42 PM: ​
12:48:42 PM:   Error location
12:48:42 PM:   In build.command from netlify.toml:
12:48:42 PM:   cd apps/frontend && npm install && npm run build:ci
12:48:42 PM: ​
12:48:42 PM:   Resolved config
12:48:42 PM:   build:
12:48:42 PM:     base: /opt/build/repo
12:48:42 PM:     command: cd apps/frontend && npm install && npm run build:ci
12:48:42 PM:     commandOrigin: config
12:48:42 PM:     environment:
12:48:42 PM:       - REVIEW_ID
12:48:42 PM:       - VITE_COINGECKO_API_KEY
12:48:42 PM:       - NODE_VERSION
12:48:42 PM:       - NPM_VERSION
12:48:42 PM:     publish: /opt/build/repo/apps/frontend/dist
12:48:42 PM:     publishOrigin: config
12:48:42 PM:   redirects:
12:48:42 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:48:42 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:48:42 PM: Failing build: Failed to build site
12:48:43 PM: Finished processing build request in 33.048s

### Redirect rules - foliocryptoFailing after 34s — Deploy failed

12:48:35 PM: Netlify Build                                                 
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: ❯ Version
12:48:35 PM:   @netlify/build 35.5.12
12:48:35 PM: ​
12:48:35 PM: ❯ Flags
12:48:35 PM:   accountId: 5fcf8a9d99dc7ae794e8f037
12:48:35 PM:   baseRelDir: true
12:48:35 PM:   buildId: 6974a3688457e30008d0db3c
12:48:35 PM:   deployId: 6974a3688457e30008d0db3e
12:48:35 PM: ​
12:48:35 PM: ❯ Current directory
12:48:35 PM:   /opt/build/repo
12:48:35 PM: ​
12:48:35 PM: ❯ Config file
12:48:35 PM:   /opt/build/repo/netlify.toml
12:48:35 PM: ​
12:48:35 PM: ❯ Context
12:48:35 PM:   deploy-preview
12:48:35 PM: ​
12:48:35 PM: build.command from netlify.toml                               
12:48:35 PM: ────────────────────────────────────────────────────────────────
12:48:35 PM: ​
12:48:35 PM: $ cd apps/frontend && npm install && npm run build:ci
12:48:36 PM: > frontend@0.0.0 prepare
12:48:36 PM: > husky install
12:48:36 PM: husky - install command is DEPRECATED
12:48:36 PM: .git can't be found
12:48:36 PM: up to date, audited 654 packages in 870ms
12:48:36 PM: 198 packages are looking for funding
12:48:36 PM:   run `npm fund` for details
12:48:36 PM: found 0 vulnerabilities
12:48:37 PM: > frontend@0.0.0 build:ci
12:48:37 PM: > tsc -b tsconfig.build.json && vite build
12:48:42 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:48:42 PM: src/services/coinGeckoApiService.ts(1,33): error TS2307: Cannot find module '@crypture/api-client' or its corresponding type declarations.
12:48:42 PM: src/services/coinGeckoApiService.ts(7,8): error TS2307: Cannot find module '@crypture/shared-types' or its corresponding type declarations.
12:48:42 PM: ​
12:48:42 PM: "build.command" failed                                        
12:48:42 PM: ────────────────────────────────────────────────────────────────
12:48:42 PM: ​
12:48:42 PM:   Error message
12:48:42 PM:   Command failed with exit code 2: cd apps/frontend && npm install && npm run build:ci (https://ntl.fyi/exit-code-2)
12:48:42 PM: ​
12:48:42 PM:   Error location
12:48:42 PM:   In build.command from netlify.toml:
12:48:42 PM:   cd apps/frontend && npm install && npm run build:ci
12:48:42 PM: ​
12:48:42 PM:   Resolved config
12:48:42 PM:   build:
12:48:42 PM:     base: /opt/build/repo
12:48:42 PM:     command: cd apps/frontend && npm install && npm run build:ci
12:48:42 PM:     commandOrigin: config
12:48:42 PM:     environment:
12:48:42 PM:       - REVIEW_ID
12:48:42 PM:       - VITE_COINGECKO_API_KEY
12:48:42 PM:       - NODE_VERSION
12:48:42 PM:       - NPM_VERSION
12:48:42 PM:     publish: /opt/build/repo/apps/frontend/dist
12:48:42 PM:     publishOrigin: config
12:48:42 PM:   redirects:
12:48:42 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:48:42 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:48:42 PM: Failing build: Failed to build site
12:48:43 PM: Finished processing build request in 33.048s


