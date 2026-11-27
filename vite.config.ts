import { defineConfig, type ConfigEnv, type UserConfig } from 'vite';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isDevelopment: boolean = mode === 'development';

  return {
    base: isDevelopment ? '/' : '/berlin-guardians/',
    build: {
      sourcemap: isDevelopment,
      minify: !isDevelopment,
    },
  };
});
