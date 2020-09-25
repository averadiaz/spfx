import * as React from "react";
import {
    Dropdown,
    IDropdownOption,
    PrimaryButton, 
    DefaultButton,
    CommandButton,
    TextField, 
    Label,
    DialogFooter,
    DialogContent,
    Dialog,
    DialogType,
    Toggle, 
    Spinner,
    SpinnerSize,
    Checkbox, 
    Icon
} from 'office-ui-fabric-react';
import { sp, IList, IListEnsureResult, IItemAddResult, IFieldAddResult  } from "@pnp/sp/presets/all";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IDialogContentState } from './IDialogContentState';
import { IDialogContentProps, IDialogModelProps } from './IDialogContentProps';
import { useBoolean } from '@uifabric/react-hooks';
import styles from './FormTiposProyectos.module.scss';

const dialogContentProps = {
    type: DialogType.largeHeader,
    title: 'Tipo Proyecto',
    //subText: '', 
};

const modelProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 500 } },
};

export class ContentIFDialog extends React.Component<IDialogContentProps, IDialogContentState > {
    public nombreTipo: string;
    constructor(props: IDialogContentProps) {
        super(props);

        this.state = {    
            //type: DialogType.largeHeader,
            hidden:false,     
            tipo: '',
            title: this.nombreTipo,
            status: null,
            loading: false,
            onSubmission:false
        };

        sp.setup({
            spfxContext: this.props.context
        });
    }

    public render(): JSX.Element {
        window['webPartContext']= this.props.context;

        if(this.props.tipo=="iframe"){
            return(<div>
                <DialogContent
                    title= {this.props.title}
                    onDismiss={this.props.close}
                    showCloseButton={true}
                ></DialogContent>
            </div>);
        }
        if(this.props.tipo=="Eliminar"){
            return(<div className={styles.TipoProyectoDialogRoot} style={{ width: this.props.width+"px", height: this.props.height+"px" }}>                
                <DialogContent
                    title= {this.props.title}
                    onDismiss={this.props.close}
                    showCloseButton={true}
                    type={DialogType.largeHeader}
                >
                    <div className={styles.TipoProyectoDialogContent}>
                        <div className="ms-Grid">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
                                    <div className="ms-borderBase ms-fontColor-themePrimary" />
                                        ¿Desea eliminar el tipo de proyecto y sus carpetas?
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <PrimaryButton onClick={() => this._eliminar(this.state)} text="Si" />
                        <DefaultButton onClick={() => this.props.close()} text="Cancelar" />
                    </DialogFooter>
                </DialogContent>
            </div>);
        }
        if(this.props.tipo=="Nuevo" || this.props.tipo=="Editar"){
            return(<div className={styles.TipoProyectoDialogRoot} style={{ width: this.props.width+"px", height: this.props.height+"px" }}>
                <DialogContent
                    title= {this.props.title}
                    onDismiss={this.props.close}
                    showCloseButton={true}
                    type={DialogType.largeHeader}
                >
                    <div className={styles.TipoProyectoDialogContent}>
                        <div className="ms-Grid">
                            <div className="ms-Grid-row">
                                <div style={{ width: "400px" }} >
                                    <TextField
                                        label="Tipos de Proyectos"
                                        required={true}
                                        value={this.state.title}
                                        onChange={(e, text) => this.handleTitle(text)}                                        
                                        iconProps={{ iconName: 'TextField' }}
                                    />
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <DialogFooter>
                        <PrimaryButton text='Guardar' title='Guardar' iconProps={{ iconName: 'SkypeCircleCheck' }} onClick={() => {
                            //this.setState({ loading: true, status: <Spinner size={SpinnerSize.large} label='Loading...' /> });
                            this._submit(this.state);
                        }} />
                        <CommandButton text='Cancel' title='Cancel' iconProps={{ iconName: 'StatusErrorFull' }}  onClick={this.props.close} />
                    </DialogFooter>
                </DialogContent>
            </div>);
        }
    }

    public async _submit(capturedDetails: IDialogContentState): Promise<void> {
        this.setState({ onSubmission : true });
        let allowCreate: boolean = true;
        if(capturedDetails.title.length < 1  )
        {
          allowCreate = false;
        } 
        if(allowCreate)
        {
            if(this.props.idElemento > 0){//Actualizar
                sp.web.lists.getByTitle("Tipos de Proyectos").select("*").items.getById(this.props.idElemento).update({
                    Title: capturedDetails.title
                }).then(() => {
                    this.props.submit(capturedDetails);
                }, (error: any): void => {  
                    console.log(error); 
                });
            }else{
                sp.web.lists.getByTitle("Tipos de Proyectos").select("*").items.add({
                    Title: capturedDetails.title                    
                }).then(() => {               
                    this.props.submit(capturedDetails);                       
                }, (error: any): void => {  
                    console.log(error);       
                });
            }
        }
    }

    private handleTitle(value: string): void {
        return this.setState({
            title: value
        });
    }

    private getData(idElemento){
        sp.web.lists.getByTitle("Tipos de Proyectos").items.getById(idElemento).select("*").get().then((data: any) => {
            this.nombreTipo = data.Title;
            console.log("nombreTipo ", this.nombreTipo);
            this.setState({
                title: this.nombreTipo
            });
        });
      }
    
    public async componentDidMount(): Promise<void> {
        if(this.props.tipo=="Editar"){
            this.getData(this.props.idElemento);
        }        
    }

    public _eliminar ( capturedDetails: IDialogContentState): void {
        if(this.props.idElemento > 0){
            sp.web.lists.getByTitle("Tipos de Proyectos").items.getById(this.props.idElemento).delete();
            console.log("Eliminar",capturedDetails);
            this.props.submit(capturedDetails);
        }
    }  
}