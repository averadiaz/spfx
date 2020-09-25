import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDialogContentState } from './IDialogContentState';
export interface IDialogContentProps {
    context: WebPartContext;
    close: () => void;
    url: string;
    title: string;
    height: string;
    width: string;
    tipo: string;
    idElemento: number;
    iframeOnLoad?: (iframe: any) => void;
    submit: (capturedDetails: IDialogContentState) => void;
    options: any[];  
}

export interface IDialogModelProps {
    type: any;
    title: string;
}