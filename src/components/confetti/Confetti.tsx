import React, { useCallback, useMemo } from 'react';
import Particles from 'react-particles';
import type { Engine, ISourceOptions } from 'tsparticles-engine';
import { loadConfettiPreset } from 'tsparticles-preset-confetti';
import confettiSettings from './confetti-settings.json';

const Confetti = () => {
  const customInit = useCallback(async (engine: Engine) => {
    await loadConfettiPreset(engine);
  }, []);

  // @ts-ignore
  const options: ISourceOptions = useMemo(() => confettiSettings, []);

  return <Particles id="tsparticles" options={options} init={customInit} />;
};
export default Confetti;
