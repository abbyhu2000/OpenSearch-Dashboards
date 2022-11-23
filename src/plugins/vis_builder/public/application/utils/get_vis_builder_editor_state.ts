import { SavedObject } from '../../../../../core/types';
import { Filter } from '../../../../data/public';
import { VisBuilderServices } from '../../types';
import { useTypedSelector } from '../utils/state_management';

export const getDefaultQuery = ({ data }: VisBuilderServices) => {
    return data.query.queryString.getDefaultQuery();
  };

export const visBuilderStateToEditorState = (
    instance,
    services: VisBuilderServices
) => {
    return {
        query: instance.searchSource?.getOwnField('query') || getDefaultQuery(services),
        filters: (instance.searchSource?.getOwnField('filter') as Filter[]) || [],
    }
}