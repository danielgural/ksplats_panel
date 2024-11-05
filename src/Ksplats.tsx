import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { LRUCache } from "lru-cache";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MAX_SPLATS_IN_CACHE } from "./constants.ts";

export const Ksplats = React.memo(({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<GaussianSplats3D.Viewer>(null);
  // state to track if the viewer instance is initialized
  const [initialized, setInitialized] = useState(false);
  // state to track if .start() has been called on the viewer instance,
  // because after first .start() call, we call .open() instead of .start()
  const [started, setStarted] = useState(false);

  const firstSplatUrlRef = useRef<string | null>(null);
  const cacheRef = useRef<LRUCache<string, boolean>>();

  /**
   * This effect initializes the viewer instance. Same viewer instance is used to
   * open/close multiple splats.
   */
  useEffect(() => {
    viewerRef.current = new GaussianSplats3D.Viewer({
        'cameraUp': [0, -1, -0.6],
        'initialCameraPosition': [-1, -4, 6],
        'initialCameraLookAt': [0, 4, 0],
        'sharedMemoryForWorkers': false
    });
    const viewer = new GaussianSplats3D.Viewer({
        'cameraUp': [0, -1, -0.6],
        'initialCameraPosition': [-1, -4, 6],
        'initialCameraLookAt': [0, 4, 0],
        'sharedMemoryForWorkers': false
    });
    viewer.start();
    viewerRef.current.start();
    cacheRef.current = new LRUCache<string, boolean>({
      max: MAX_SPLATS_IN_CACHE,
      dispose: (_val, urlKey) => {
        try {
          viewerRef.current.close(urlKey);
        } catch (e) {
          console.error(`Couldn't close viewer for url ${url}`, e);
        }
      },
    });

    setInitialized(true);

    return () => {
      // todo: the following is throwing runtime error that looks like a bug
      // viewerRef.current?.stop();

      try {
        // close all open URLs
        cacheRef.current?.forEach((_value, urlKey) => {
          try {
            viewerRef.current.close(urlKey);
          } catch (e) {
            console.error(`Couldn't close viewer for url ${urlKey}`, e);
          }
        });
        viewerRef.current.stop();
      } catch (e) {
        console.error("Couldn't stop viewer", e);
      }
    };
  }, []);

  /**
   * This effect oepns the first splat file with .start()
   * and sets the `started` state to true.
   */
  useLayoutEffect(() => {
    if (started || !initialized || !containerRef.current) {
      return;
    }

    firstSplatUrlRef.current = url;

    console.log('First Splat URL:', url);

    let path = '/plugins/fiftyone-plugins/plugins/ksplats/assets/stump.ksplat';
    viewerRef.current.addSplatScene(path, {
        'splatAlphaRemovalThreshold': 5,
        'showLoadingUI': true,
        'position': [0, 1, 0],
        'rotation': [0, 0, 0, 1],
        'scale': [1.5, 1.5, 1.5],
        'format': 'ksplat'
    }).then(() => {
      viewerRef.current.start();
    });


    cacheRef.current?.set(url, true);

    setStarted(true);
  }, [url, started, initialized]);

  /**
   * This effect opens splat files using .open() depending on the URL.
   */
  useLayoutEffect(() => {
    if (!started || firstSplatUrlRef.current === url) {
      // yield to effect above which uses .start() API
      return;
    }

    viewerRef.current.open(url);

    cacheRef.current?.set(url, true);

    // no need to close the URL here, as the cache will handle it
  }, [url, started]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
});