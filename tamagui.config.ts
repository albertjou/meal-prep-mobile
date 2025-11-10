import { config } from '@tamagui/config/v3';
import { createTamagui } from '@tamagui/core';

/**
 * Tamagui configuration
 * Based on Tamagui v3 config with custom theme overrides
 */
const appConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      // Custom theme colors can be added here
      background: '#fff',
      backgroundHover: '#f5f5f5',
      color: '#11181C',
    },
    dark: {
      ...config.themes.dark,
      // Custom dark theme colors
      background: '#151718',
      backgroundHover: '#1f1f1f',
      color: '#ECEDEE',
    },
  },
  // Add custom tokens if needed
  tokens: {
    ...config.tokens,
  },
});

export default appConfig;

export type Conf = typeof appConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
