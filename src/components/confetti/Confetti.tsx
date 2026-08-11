import React, { useMemo } from 'react';
import Particles, {
  ParticlesProvider,
  useParticlesProvider,
} from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';
import confettiSettings from './confetti-settings.json';

const ConfettiParticles = () => {
  const { loaded } = useParticlesProvider();

  // @ts-ignore
  const options: ISourceOptions = useMemo(() => confettiSettings, []);

  return loaded && <Particles id="tsparticles" options={options} />;
};

const Confetti = () => (
  <ParticlesProvider
    init={async (engine: Engine) => {
      await loadConfettiPreset(engine);
    }}
  >
    <ConfettiParticles />
  </ParticlesProvider>
);

export default Confetti;
