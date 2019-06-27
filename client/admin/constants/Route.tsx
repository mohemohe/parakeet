import * as React from "react";
import Search from "@material-ui/icons/Search";
import { Index } from "../containers/page/Index";
import { LoginPage } from "../containers/page/auth/Login";
import { LogoutPage } from "../containers/page/auth/Logout";
import {User} from "../containers/page/User";

export interface IRouteInfo {
    name: string;
    path?: string;
    component?: any;
    showLeftNav: boolean;
    permission: number[];
    icon?: any;
    children?: IRouteInfo[];
    link?: boolean;
}

export const ROUTES: IRouteInfo[] = [
    // 全般
    {
        name: "Index",
        path: "/",
        component: Index,
        showLeftNav: true,
        permission: [],
    },
    {
        name: "ログイン",
        path: "/auth/login",
        component: LoginPage,
        showLeftNav: false,
        permission: [],
    },
    {
        name: "ログアウト",
        path: "/auth/logout",
        component: LogoutPage,
        showLeftNav: false,
        permission: [],
    },
    {
        name: "ユーザー",
        path: "/users",
        component: User,
        showLeftNav: true,
        permission: [],
    },
    {
        name: "外部リンク (Google)",
        path: "https://google.com",
        icon: <Search/>,
        showLeftNav: true,
        permission: [],
    },
];