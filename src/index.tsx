import * as fop from "@fiftyone/plugins";
import * as futil from "@fiftyone/utilities";
import { KsplatsFileDescriptor, KsplatsViewer } from "./KsplatsPanel.tsx";

fop.registerComponent({
  name: "Ksplats",
  label: "Ksplats",
  component: KsplatsViewer,
  activator: (ctx) => {
    // only activate if schema has splat file
    return futil.doesSchemaContainEmbeddedDocType(
      ctx.schema,
      KsplatsFileDescriptor.EMBEDDED_DOC_TYPE
    );
  },
  type: fop.PluginComponentType.Panel,
  panelOptions: {
    surfaces: "modal",
    helpMarkdown: `Ksplats viewer for FiftyOne`,
  },
});