import DataflowGraph from '../Model/DataFlowGraph/DataflowGraph';
import DatasetLink from '../Model/DataFlowGraph/DataflowLink';
import { DataflowNode } from '../Model/DataFlowGraph/DataflowNode';
import DatasetNode from '../Model/DataFlowGraph/DatasetNode';
import TransformNode from '../Model/DataFlowGraph/TransformNode';

export default class DefaultDataGraphFactory {
  public getDefaultNodeGraph() {
    const graph = new DataflowGraph([], []);
    // const defaultTransforms = this.getDefaultTransformNodes();
    const defaultTransforms: TransformNode[] = [];
    const defaultDatasets = this.getDefaultDatasetNodes(graph);

    const defaultNodes: DataflowNode[] = (defaultTransforms as DataflowNode[]).concat(defaultDatasets as DataflowNode[]);
    // let defaultNodes: DataflowNode[] = [];

    const defaultLinks = this.getDefaultLinks(defaultDatasets, defaultTransforms);

    graph.nodes = defaultNodes;
    // graph.links = defaultLinks;

    graph.nodes.forEach(node => node.graph = graph);

    return graph;
  }

  private getDefaultLinks(datasets: DatasetNode[], transforms: TransformNode[]) {
    const link1 = new DatasetLink();
    link1.source = datasets[0];
    link1.target = transforms[0];

    const transformLinks = transforms
      .map((transform, i) => {
        if (i === transforms.length - 1) { return null; }

        const newLink = new DatasetLink();
        newLink.source = transform;
        newLink.target = transforms[i + 1];

        return newLink;
      })
      .filter(d => d !== null);

    return transformLinks.concat(link1);
  }

  public getDefaultTransformNodes() {

    const formula = new TransformNode();
    formula.transform = {
      as: 'value',
      expr: '1',
      type: 'formula',
    };

    const fold = new TransformNode();
    fold.transform = {
      as: ['dimension', 'category'],
      fields:  ['Miles_per_Gallon', 'Cylinders', 'Displacement', 'Horsepower',
        'Weight_in_lbs',	'Acceleration', 'Year',	'Origin'],
      type: 'fold',
    };

    const aggregate = new TransformNode();
    aggregate.transform = {
      as: ['value'],
      fields: ['value'],
      groupby: ['dimension', 'category'],
      ops: ['sum'],
      type: 'aggregate',
    };

    const collect = new TransformNode();
    collect.transform = {
      sort: {
        field: 'category',
        order: 'descending'
      },
      type: 'collect',
    };

    const stack = new TransformNode();
    stack.transform = {
      field: 'value',
      groupby: ['dimension'],
      type: 'stack',
    };

    return [formula, fold, aggregate, collect, stack];
  }

  public getDefaultDatasetNodes(graph: DataflowGraph) {
    const cars = new DatasetNode();
    cars.graph = graph;
    cars.fields = ['Miles_per_Gallon', 'Cylinders', 'Displacement', 'Horsepower',
      'Weight_in_lbs',	'Acceleration', 'Year',	'Origin'];
    cars.data = {
      name: 'Cars',
      url: 'https://vega.github.io/vega-lite/data/cars.json'
    };

    return [cars];
  }
}