import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TiposDeProyectosWebPartStrings';
import TiposDeProyectos from './components/TiposDeProyectos';
import { ITiposDeProyectosProps } from './components/ITiposDeProyectosProps';
import { sp, IList, IListEnsureResult, IItemAddResult, IFieldAddResult,IItem,IItemUpdateResult  } from "@pnp/sp/presets/all";

export interface ITiposDeProyectosWebPartProps {
  description: string;
}

export default class TiposDeProyectosWebPart extends BaseClientSideWebPart<ITiposDeProyectosWebPartProps> {  

  public render(): void {
    sp.setup({ 
      spfxContext: this.context
    });
    const element: React.ReactElement<ITiposDeProyectosProps > = React.createElement(
      TiposDeProyectos,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
