import * as React from 'react';
import styles from './TiposDeProyectos.module.scss';
import { ITiposDeProyectosProps } from './ITiposDeProyectosProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import { IContextInfo } from "@pnp/sp/sites";
import { ITiposDeProyectosState, ITiposDeProyectosItems } from './ITiposDeProyectos';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { PrimaryButton,DefaultButton } from 'office-ui-fabric-react';
import iDialog from './IFDialogContent';

export default class TiposDeProyectos extends React.Component<ITiposDeProyectosProps, ITiposDeProyectosState> {
  private _selection: Selection;
  public sitio: any;
  public itemsTipos: ITiposDeProyectosItems[] = [];
  private _columns: IColumn[];

  constructor(props: ITiposDeProyectosProps, {}){
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    this._columns = [
      { key: 'cID', name: 'ID', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true, headerClassName: styles["ms-DetailsHeader"] },
      { key: 'cTitle', name: 'Nombre Tipo', fieldName: 'title', minWidth: 100, maxWidth: 200, isResizable: true, headerClassName: styles["ms-DetailsHeader"] },
    ];

    this.sitio = this.props.siteUrl;
    this.state = {
      items: this.itemsTipos,
      disabled: true,
      selectionDetails: this._getSelectionDetails()
    };
  }

  private getData(){
    sp.web.lists.getByTitle("Tipos de Proyectos").items.select("*").get().then((data) => {
      console.log("items tipos ", data);
      if(data.length > 0){
        for(var i = 0; i < data.length; i++){
          this.itemsTipos.push({
            key: data[i].Id,
            id: data[i].Id,
            title: data[i].Title
          });
        }
        this.setState({
          items: this.itemsTipos
        });        
      }
    });
  }

  public async componentDidMount(): Promise<void> {
    this.getData();
  }
  public render(): React.ReactElement<ITiposDeProyectosProps> { 
    const { items, selectionDetails, disabled } = this.state;
    console.log("state ", this.state);
    return (
      <Fabric>                
        <div className={ styles.tiposDeProyectos } style={{ width: "90%", display: "block", marginLeft:"70px",marginTop:"20px"  }}>
          <div style={{  display: "inline-block" }} >            
              <div className={ styles.btnbarra } style={{ marginRight:"5px" }}>
                <PrimaryButton text="Nuevo Tipo" onClick={() =>  this.showModal("Nuevo") } allowDisabledFocus />
              </div>
              <div className={styles.btnbarra} style={{ marginRight:"5px" }}>
                <PrimaryButton text="Editar Tipo" onClick={() =>  this.showModal("Editar") } allowDisabledFocus disabled={disabled}/>
              </div>
              <div className={styles.btnbarra} style={{ marginRight:"5px" }}>
                <DefaultButton text="Eliminar Tipo" onClick={() => this.showModal("Eliminar")} allowDisabledFocus disabled={disabled}  />
              </div>
            </div>
          </div>        
        <div style={{ width: "96%", display: "block",marginLeft:"30px" }}>
          <MarqueeSelection selection={this._selection}>
            <DetailsList
                items={ items }
                columns={this._columns}
                setKey="set"
                className="tiposDeProyectos"
                layoutMode={DetailsListLayoutMode.justified}
                selection={this._selection}
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="Row checkbox"
                //onItemInvoked={this._onItemInvoked}
              />
          </MarqueeSelection>
        </div>                
      </Fabric>
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();
    console.log("selectionCount ", selectionCount);
    switch (selectionCount) {
      case 0:
        this.setState({disabled:true});
        return '';
      case 1:
        this.setState({disabled:false});
        return '1 item seleccionado: ' + (this._selection.getSelection()[0] as ITiposDeProyectosItems).title;
      default:
        return `${selectionCount} items seleccionados`;
    }
  }

  public showModal(op): void{
    //console.log("itemIditemIditemId",itemId);
      let idElemento:number;
      if( op == "Eliminar" || op =="Editar"){
          idElemento = (this._selection.getSelection()[0] as ITiposDeProyectosItems).id;
          console.log(idElemento);
      }
      
      //if(op =="Editar"){
      //  idElemento = itemId;
      //}
    
      let opt = [];
      //opt.push({anos: this.modalOptions1,clientes: this.modalOptions2, paises: this.modalOptions3, portafolios:this.modalOptions4, tiposProyectos:this.modalOptions5})
      const dialog: iDialog = new iDialog("",op+"  Tipo Proyecto","270","500",op,"",idElemento, opt,this.props);
      dialog.context = this.props.context ;
      dialog.show();
    }

    public update(): void{
      this.getData();
    }
    private _onItemInvoked = (item: ITiposDeProyectosItems): void => {
      alert(`Item invoked: ${item.title}`);
    }
}
