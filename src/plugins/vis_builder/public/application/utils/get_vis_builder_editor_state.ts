import { CombinedState } from 'redux';
import { Filter } from '../../../../data/public';
import { VisBuilderServices } from '../../types';
import { useTypedSelector, VisualizationState } from '../utils/state_management';
import { MetadataState } from './state_management/metadata_slice';

export const getDefaultQuery = ({ data }: VisBuilderServices) => {
    return data.query.queryString.getDefaultQuery();
  };

export const visBuilderEditorState = (
    instance,
    services: VisBuilderServices,
    rootState: CombinedState<{
        style: any;
        visualization: VisualizationState;
        metadata: MetadataState;
    }>
) => {
    //const visualizationState = useTypedSelector((state) => state.visualization)
    //const styleState = useTypedSelector((state)=>state.style)

    return {
        visualizationState: rootState.visualization,
        styleState: rootState.style,
        query: instance.searchSource?.getOwnField('query') || getDefaultQuery(services),
        filters: (instance.searchSource?.getOwnField('filter') as Filter[]) || [],
    }
}