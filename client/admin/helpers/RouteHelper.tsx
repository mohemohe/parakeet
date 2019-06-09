import {IRouteInfo} from "../constants/Route";
import AuthStore from "../stores/AuthStore";

export default class RouteHelper {
    public static getRoute(routes: IRouteInfo[], authStore: AuthStore, visibleOnly: boolean) {
        let visibleRoutes: IRouteInfo[];
        if (authStore.isRoot) {
            visibleRoutes = routes.filter((route) => (
                (
                    route.permission.length === 0 ||
                    route.permission.indexOf(0) > -1
                )
            ));
        } else {
            visibleRoutes = routes.filter((route) => (
                (
                    route.permission.length === 0 ||
                    route.permission.indexOf(1) > -1
                )
            ));
        }

        if (visibleOnly) {
            visibleRoutes = visibleRoutes.filter((route) => (
                route.showLeftNav
            ));
        }

        return visibleRoutes;
    }
}