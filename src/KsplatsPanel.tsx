import * as fos from "@fiftyone/state";
import { getFieldsWithEmbeddedDocType } from "@fiftyone/utilities";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { Ksplats } from "./Ksplats";
import { CustomErrorBoundary } from "./CustomErrorBoundary";
import { SplatIframeRenderer } from "./SplatIframeRenderer";
import KsplatsFresh from "./Ksplat_fresh";

// Change
export const KsplatsFileDescriptor = {
  EMBEDDED_DOC_TYPE: "fiftyone.utils.splats.SplatFile",
};

// Change
type KsplatsFieldDescriptor = {
  _cls: "SplatFile";
  filepath: string;
  version: string;
};

export const KsplatsViewer = React.memo((props) => {
  const currentSample = useRecoilValue(fos.modalSample);

  const schema = useRecoilValue(
    fos.fieldSchema({ space: fos.State.SPACE.SAMPLE })
  );

  const ksplatsFieldPath = useMemo(
    () =>
      getFieldsWithEmbeddedDocType(
        schema,
        KsplatsFileDescriptor.EMBEDDED_DOC_TYPE
      ).at(0)?.path,
    [schema]
  );

  const splatParams = useMemo(() => {
    if (!ksplatsFieldPath || !currentSample.urls) {
      return undefined;
    }
    //console.log(currentSample);
    const filePathAndVersion = currentSample?.sample?.[
      ksplatsFieldPath
    ] as unknown as KsplatsFieldDescriptor;

    const urlsStandardized = fos.getStandardizedUrls(currentSample.urls);

    const splatFilePath = urlsStandardized[`${ksplatsFieldPath}.filepath`];
    console.log(currentSample);
    console.log(splatFilePath);
    const url = fos.getSampleSrc(splatFilePath);
    console.log(url);
    return {
      url,
      version: filePathAndVersion?.version,
    };
  }, [currentSample, ksplatsFieldPath]);

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