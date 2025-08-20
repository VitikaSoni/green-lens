import { defineConfig } from 'orval'

export default defineConfig({
  diy: {
    input: './openapi-schema.yaml',
    output: {
      target: './apis/gen/index.ts',
      schemas: './apis/gen',      
      client: 'swr',
      mode: 'tags-split',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: './configs/orval-mutator.ts',
          name: 'orvalMutator',
          default: true,
        },
      },
    },
  },
})
