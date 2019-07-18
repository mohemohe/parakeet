import {IRouteInfo} from "../constants/Route";
import {AuthStore} from "../../common/stores/AuthStore";

export class RouteHelper {
    public static getRoute(routes: IRouteInfo[], authStore: AuthStore, visibleOnly: boolean) {
        let visibleRoutes = routes.filter((route) => (
            (
                route.permission.length === 0 ||
                route.permission.indexOf(authStore.userInfo.role) > -1
            )
        ));

        if (visibleOnly) {
            visibleRoutes = visibleRoutes.filter((route) => (
                route.showLeftNav
            ));
        }

        return visibleRoutes;
    }
}