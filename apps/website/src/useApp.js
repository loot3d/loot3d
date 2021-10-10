import { useCallback, useEffect, useRef, useState } from 'react';

import Viewer from './Viewer';
import lootData from '@loot3d/data/loot.json';

const MODEL_URL = 'https://cloudflare-ipfs.com/ipfs/QmS49F13FfeqgiBpvo6jEsfdQ4komFwZVHbmuT2mtUtwpV/';

export function useApp() {
  const viewerRef = useRef();
  const canvasRef = useRef();
  const [loading, setLoading] = useState(true);
  const [bagAsset, setBagAsset] = useState(null);
  const [bagNumber, setBagNumber] = useState(() => {
    const rs = window.location.search.match(/bagNumber=(\d+)/);

    return (rs ? ~~rs[1] : 0) || 1;
  });

  const handleRandom = useCallback(() => {
    setBagNumber(Math.floor(Math.random() * 8000));
  }, []);

  const handlePopState = useCallback((evt) => {
    console.log(evt);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewer = new Viewer({
      canvas,
      antialias: true,
      alpha: true,
    });
    viewer.autoRender = false;
    viewer.gltfLoader.setPath(MODEL_URL);
    viewer.run();

    viewerRef.current = viewer;

    if (process.env.NODE_ENV === 'development') {
      window.viewer = viewer;
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      viewer.dispose();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let newBagAsset = null;

    if(bagNumber > 0 && bagNumber <= 8000) {
      const bag = lootData[bagNumber-1][bagNumber];
      newBagAsset = {
        chest: bag.chest,
        foot: bag.foot,
        hand: bag.hand,
        head: bag.head,
        neck: bag.neck,
        ring: bag.ring,
        waist: bag.waist,
        weapon: bag.weapon,
      };

      const load = async (url) => {
        const viewer = viewerRef.current;
        try {
          setLoading(true);
          await viewer.load(url);
        } catch (e) {
          console.error(e);
          alert(`Failed to load the model: ${bagNumber}`);
        } finally {
          setLoading(false);
        }
      };
      load(`${bagNumber}.glb`);
    } else {
      console.log(`Invalid bag number: ${bagNumber}`);
    }

    setBagAsset(newBagAsset);

    window.history.pushState({}, '', `?bagNumber=${bagNumber}`);
  }, [bagNumber]);

  return [canvasRef, loading, bagNumber, setBagNumber, handleRandom, bagAsset];
}
