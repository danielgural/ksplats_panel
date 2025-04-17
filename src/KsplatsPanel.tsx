import * as fos from "@fiftyone/state";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { CustomErrorBoundary } from "./CustomErrorBoundary";
import KsplatsFresh from "./Ksplat_fresh";

// Change
export const isSplat = (mediaType: string): boolean => {
  return ["splat", "ksplat"].includes(mediaType);
};

export const KsplatsViewer = React.memo((props) => {
  const currentSample = useRecoilValue(fos.modalSample);

  const schema = useRecoilValue(
    fos.fieldSchema({ space: fos.State.SPACE.SAMPLE })
  );

  const ksplatsMediaType = useRecoilValue(fos.mediaType);



  const splatParams = useMemo(() => {
    if (!ksplatsMediaType) {
      return undefined;
    }
    if (!isSplat(ksplatsMediaType)) {
      return undefined;
    }
    console.log(currentSample);


    const urlsStandardized = fos.getStandardizedUrls(currentSample.urls);

    const splatFilePath = urlsStandardized[`filepath`];
    console.log(currentSample);
    console.log(splatFilePath);
    const url = fos.getSampleSrc(splatFilePath);
    console.log(url);
    return {
      url,
    };
  }, [currentSample]);

  if (!splatParams) {
    return <div>Loading...</div>;
  }

  return (
    <CustomErrorBoundary>
      {/* use iframe until versioned web viewer renderer is more stable, note: vite will not bundle any rerun deps */}
      {/* <RrdWebViewerRenderer url={rrdParams.url} version={rrdParams.version} /> */}
      {/* <SplatIframeRenderer url={splatParams.url} /> */}
      {/* <Ksplats url=""></Ksplats> */}
      <KsplatsFresh bounds={props.dimensions?.bounds} url={splatParams.url}></KsplatsFresh>
    </CustomErrorBoundary>
  );
});