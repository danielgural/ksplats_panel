import { BuildOptions, PluginOption } from 'vite';
/**
 *
 * @param dir root directory where package.json and vite.config.js are located. Usually you'll just want to pass `__dirname`.
 * Or, if you're using modules, you'll want to pass `dirname(fileURLToPath(import.meta.url))`.
 *
 * @param opts.forceBundleDependencies an array of either exact package names or regex patterns that you want to force bundle.
 * Use this for any third-party dependencies that you introduce in your plugin that are not part of the global scope.
 *
 * @param opts.buildConfigOverride override the default build config with your own options.
 *
 * @param opts.plugins additional plugins to include in the Vite config.
 */
export declare function defineConfig(dir: string, opts?: {
    buildConfigOverride?: BuildOptions;
    forceBundleDependencies?: Array<string | RegExp>;
    plugins?: PluginOption[];
}): Promise<import('vite').UserConfig>;
