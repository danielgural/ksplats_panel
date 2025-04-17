import * as fop from "@fiftyone/plugins";
import * as futil from "@fiftyone/utilities";
import { isSplat } from "./KsplatsPanel";
import { KsplatsViewer } from "./KsplatsPanel";


fop.registerComponent({
  name: "Ksplats",
  label: "Ksplats",
  component: KsplatsViewer,
  activator: (ctx) => {
    // only activate if schema has splat file
    return true;
  },
  type: fop.PluginComponentType.Panel,
  panelOptions: {
    surfaces: "modal",
    helpMarkdown: `Ksplats viewer for FiftyOne`,
  },
});
