import { view } from '@fiftyone/state';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from 'three'


export default function KsplatsFresh(props) {
    const [started, setStarted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    console.log(props.url)
    useLayoutEffect(() => {
        if (started || !containerRef.current || !props.bounds) {
          return;
        }


        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(props.bounds.width, props.bounds.height);
        containerRef.current.appendChild(renderer.domElement);
        const viewer = new GaussianSplats3D.Viewer({
            'cameraUp': [0, -1, -0.6],
            'initialCameraPosition': [-1, -4, 6],
            'initialCameraLookAt': [0, 4, 0],
            'sharedMemoryForWorkers': false,
            'renderer': renderer,
        });
        let path = '/plugins/fiftyone-plugins/plugins/ksplats/assets/stump.ksplat';
        viewer.addSplatScene(props.url, {
            'splatAlphaRemovalThreshold': 5,
            'showLoadingUI': true,
            'position': [0, 1, 0],
            'rotation': [0, 0, 0, 1],
            'scale': [1.5, 1.5, 1.5],
            'progressiveLoad': true,
        }).then(() => {
            viewer.start();
        });
        setStarted(true);
    }, [containerRef.current, started]);
    return <div ref={containerRef}></div>;
        
}