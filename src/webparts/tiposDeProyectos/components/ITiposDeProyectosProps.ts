import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ITiposDeProyectosProps {
  description: string;
  siteUrl: string | number | undefined;
  context: WebPartContext;
}
