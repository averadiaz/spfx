import * as React from "react";
import * as ReactDOM from "react-dom";
import { BaseDialog, IDialogConfiguration } from "@microsoft/sp-dialog";
import { ContentIFDialog } from "./ContentIFDialog";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp, IList, IListEnsureResult, IItemAddResult, IFieldAddResult  } from "@pnp/sp/presets/all";
import { ITiposDeProyectosProps } from './ITiposDeProyectosProps';
import { IDialogContentState } from './IDialogContentState';
import TiposDeProyectos from "./TiposDeProyectos";
import { DialogType } from "office-ui-fabric-react";

export default class IFrameDialogContent extends BaseDialog {
    private url: string = "";
    private title: string = "";
    private height: string = "";
    private width: string = "";
    private tipo: string = "";
    public context: WebPartContext;
    public siteUrl: string;
    public idElemento: number;
    public  pro:ITiposDeProyectosProps = {context: this.context,siteUrl:"",description:""};
    public options: any[] = [];

    constructor(url: string,title: string, height: string, width: string, tipo: string,siteUrl: string, idElemento:number, options: any[], props: {} ) {
        super(props);
        this.url         = url;
        this.title       = title;
        this.height      = height;
        this.width       = width;
        this.tipo        = tipo;
        this.siteUrl     = siteUrl;
        this.idElemento  = idElemento;
        this.options     = options;
        
    }

    public render(): void {
        window.addEventListener("CloseDialog", () => { this.close(); });
        //window.addEventListener("Submit", () => { this._submit(); });
        ReactDOM.render(
            <ContentIFDialog                
                close={this.close}
                submit={this._submit}
                url={this.url}
                title={this.title}
                height={this.height}
                width={this.width}
                tipo={this.tipo}
                context={this.context}
                idElemento={this.idElemento}
                options={this.options}
                />, this.domElement);
    }

    private async _submit(capturedDetails:IDialogContentState): Promise<void> {
        location.reload();
        const tiposProyectos = new TiposDeProyectos(this.pro,{});
        tiposProyectos.update();
        this.close();
    }
}