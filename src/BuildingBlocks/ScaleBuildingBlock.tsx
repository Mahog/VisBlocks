import * as React from 'react';
import { Scale } from 'vega';

import { plumbingProvider } from '../PlumbingProvider';
import BuildingBlock from './BuildingBlock';
import DropArea from './DropArea';
import FieldBuildingBlock from './FieldBuildingBlock';

import './ScaleBuildingBlock.css';

interface Props {
  id: string;
  className?: string;
  scale: Scale;
  disablePlumbing?: boolean;
  onFieldChanged?: (event: any) => void;
  onDelete?: (event: any) => void;
}

export default class ScaleBuildingBlock extends React.Component<Props, {}> {

  private onFieldDropped(event: any) {
    if (this.props.onFieldChanged === undefined) { return; }

    // dataset name is stored in the data-datasetName property
    const datasetName = event.drag.el.children[1].dataset.datasetname;
    const field = event.drag.el.children[1].dataset.fieldname;

    this.props.scale.domain = {
      data: datasetName,
      field
    };

    this.props.onFieldChanged(this.props.scale);
  }

  private onFieldDeleted() {
    if (this.props.onFieldChanged === undefined && this.props.scale.domain === undefined) {
      return false;
    }

    delete this.props.scale.domain;

    this.props.onFieldChanged(this.props.scale);
  }

  private renderDropArea() {
    if (this.props.onFieldChanged === undefined && this.props.scale.domain === undefined) {
      return false;
    }

    const domain: any = this.props.scale.domain;

    if (domain !== undefined) { return false; }

    return (
      <DropArea
        id={ `${this.props.id}DropArea` }
        className="scaledDomainDropArea"
        onDrop={ this.onFieldDropped.bind(this) }
        plumbing={ plumbingProvider.fieldPlumbing }
      />
    );
  }

  private renderScaleIcon() {
    let icon: string;
    let title: string;

    if (this.props.scale.type === 'linear') {
      icon = 'settings_ethernet';
      title = 'linear scale';
    } else if (this.props.scale.type === 'point') {
      icon = 'drag_indicator';
      title = 'point scale';
    } else if (this.props.scale.type === 'band') {
      icon = 'drag_indicator';
      title = 'band scale';
    } else if (this.props.scale.type === 'ordinal') {
      icon = 'drag_indicator';
      title = 'ordinal scale';
    }

    return <i className="material-icons icon" title={ title }>{ icon }</i>;
  }

  private renderNoScaledDomainNotice() {
    if (this.props.onFieldChanged === undefined && this.props.scale.domain === undefined) {
      return false;
    }

    const domain: any = this.props.scale.domain;

    if (domain !== undefined) { return false; }

    return <div className="noScaledDomainNotice">no domain</div>;
  }

  private renderScaledDomain() {
    if (this.props.onFieldChanged === undefined && this.props.scale.domain === undefined) {
      return false;
    }

    const domain: any = this.props.scale.domain;

    if (domain === undefined) { return; }
    if (domain.field === undefined) { return; }
    if (domain.field === '') { return; }
    if (domain.data === undefined) { return; }

    return (
      <FieldBuildingBlock
        field={ domain.field }
        datasetName={ domain.data }
        id={ `${this.props.id}ScaledField` }
        disablePlumbing={ this.props.disablePlumbing }
        onDelete={ this.onFieldDeleted.bind(this) }
      />
    );
  }

  private renderDomain() {
    return (
      <div className="scaledDomainGroup">
        { this.renderScaledDomain() }
        { this.renderDropArea() }
        { this.renderNoScaledDomainNotice() }
      </div>
    );
  }

  public render() {
    const domain: any = this.props.scale.domain;
    let field;
    if (domain !== undefined) { field = domain.field; }

    let name: string = this.props.scale.name;
    if (name.length > 20) { name = `${name.substr(0, 20)}...`; }

    return (
      <BuildingBlock
        id={ this.props.id }
        className={ `${this.props.className} scale` }
        disablePlumbing={ this.props.disablePlumbing }
        plumbing={ plumbingProvider.scalePlumbing }
        onDelete={ this.props.onDelete }>

        { this.renderScaleIcon() }
        <span data-fieldname={ field } data-scalename={this.props.scale.name} className="scaleName">
          { name }
        </span>
        { this.renderDomain() }
      </BuildingBlock>
    );
  }
}