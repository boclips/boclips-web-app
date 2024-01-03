import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type ISourceOptions } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import confettiSettings from './confetti-settings.json';

// heavily inspired by https://github.com/tsparticles/react
const Confetti = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // @ts-ignore
  const confettiOptions: ISourceOptions = useMemo(() => confettiSettings, []);

  return (
    <>{init && <Particles id="tsparticles" options={confettiOptions} />}</>
  );
};
export default Confetti;
