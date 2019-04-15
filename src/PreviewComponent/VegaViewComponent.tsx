import * as React from 'react';

import { Spec } from 'vega';
import Pattern from '../Model/Pattern/Pattern';
import VegaRenderer from '../Model/Renderer/VegaRenderer';
import VegaSpecBuilder from '../Model/VegaSpecBuilder';

import './VegaViewComponent.css';

interface Props {
  patternList: Pattern[]
}

export default class VegaViewComponent extends React.Component<Props, {}> {
  private vegaSpecBuilder: VegaSpecBuilder;

  constructor(props: Props) {
    super(props);

    this.vegaSpecBuilder = new VegaSpecBuilder();
  }

  private getID() {
    return this.props.patternList
      .map(pattern => pattern.id)
      .join('');
  }

  private renderPatternListInVega() {
    this.vegaSpecBuilder.patterns = this.props.patternList;
    const vegaSpec: Spec = this.vegaSpecBuilder.build();

    return (
      <VegaRenderer
        key={ this.getID() }
        id={ this.getID() }
        showExportOptions={ true }
        width={ 600 }
        height={ 400 }
        schema={ vegaSpec }
      />
    );
  }

  public render() {
    const uniqueKey = this.props.patternList
      .map(pattern => pattern.id)
      .join('##');

    return (
      <div key={ uniqueKey } className="patternGroup">
        { this.renderPatternListInVega() }
      </div>
    );
  }
}