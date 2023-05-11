export interface Config {
    header: string,
    postHeader: string,
    combos: string[],
    conditionalLayers: string[],
    behaviors: string[],
    macros: string[],
    keymap: Record<string, LayerConfig>
}

export interface ConfigParsed extends Config {
    keymap: Record<string, LayerConfigObject>
};

export interface Combo { keys: number[], binding: string }

export type LayerConfig = LayerConfigFunction | LayerConfigObject
export type LayerConfigFunction = (configLocal: ConfigParsed) => LayerConfigObject

export interface LayerConfigObject {
    keys: string[][],
    combos?: Combo[],
    sensor?: string,
}
