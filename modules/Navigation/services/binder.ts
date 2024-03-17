import { Container } from "inversify";
import {
  INavigationService,
  NavigationService,
  NavigationServiceId,
} from "./NavigationService";

export const bindNavigationServices = (container: Container) => {
  container.bind<INavigationService>(NavigationServiceId).to(NavigationService);
};
