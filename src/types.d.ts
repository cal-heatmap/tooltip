import type dayjs from 'dayjs';
import type { IPlugin, PluginOptions } from 'cal-heatmap';

interface PopperOptions {
  placement: any;
  modifiers: any[];
  strategy: any;
  onFirstUpdate?: any;
}

interface TooltipOptions extends PluginOptions, PopperOptions {
  enabled: boolean;
  text: (timestamp: number, value: number, dayjsDate: dayjs.Dayjs) => string;
  text: (timestamp: number, value: number, dayjsDate: dayjs.Dayjs) => string;
}

export interface ITooltip extends IPlugin {
}

export default class Tooltip {
  static readonly VERSION: number;

  calendar: CalHeatmap;

  options: PluginOptions;

  root: any;

  setup: (calendar: CalHeatmap, options?: PluginOptions) => void;

  paint: () => Promise<unknown>;

  destroy: () => Promise<unknown>;
}
