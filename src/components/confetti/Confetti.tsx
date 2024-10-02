import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import confettiSettings from './confetti-settings.json';

const Confetti = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadConfettiPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // @ts-ignore
  const options: ISourceOptions = useMemo(() => confettiSettings, []);

  return init && <Particles id="tsparticles" options={options} />;
};
export default Confetti;
