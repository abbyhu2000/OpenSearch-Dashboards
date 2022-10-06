import { SavedObjectsFindOptions } from "../../../../../../core/server";
import { useOpenSearchDashboards } from "../../../../../opensearch_dashboards_react/public";
import { findObjects } from "../../../../../saved_objects_management/public/lib/find_objects"
import { WizardServices } from "../../../types";

export const useDashboards = async () => {
    const { services } = useOpenSearchDashboards<WizardServices>();
    const { http } = services;
    const findOptions: SavedObjectsFindOptions = {
        type: 'dashboard'
    }
    try{
        const resp = await findObjects(http, findOptions)
        console.log(resp.savedObjects)
    } catch (error) {

    }
}