import { bindNavigationBlm } from "./blm/binder";
import { bindNavigationServices } from "./services";

export const NAVIGATION_MODULE_BINDERS = [
  bindNavigationBlm,
  bindNavigationServices,
];
