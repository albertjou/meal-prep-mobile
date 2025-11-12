import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

/**
 * Tamagui configuration
 * Based on Tamagui v3 config with custom theme overrides
 */
const appConfig = createTamagui(config);

export default appConfig;

export type Conf = typeof appConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
