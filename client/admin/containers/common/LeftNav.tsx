import * as React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import {Collapse, Divider, List, ListItem, ListItemText, Paper} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {style} from "typestyle";
import { COLORS, SIZES } from "../../constants/Style";
import { IRouteInfo, ROUTES } from "../../constants/Route";
import {RouterStore} from "mobx-react-router";
import { AuthStore } from "../../stores/AuthStore";
import { RouteHelper } from "../../helpers/RouteHelper";

const styles = {
    root: style({
        width: SIZES.LeftNav.width,
        maxWidth: SIZES.LeftNav.width,
        minWidth: SIZES.LeftNav.width,
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
    }),
    list: style({
        overflowY: "auto",
        flex: 1,
    }),
    menuText: {
        display: "flex",
        color: COLORS.EmotionalDarkGray,
    },
    collapse: {
        display: "flex",
    },
    selectedCollapse: {
        display: "flex",
        backgroundColor: COLORS.ExtraLightColor,
    },
    selectedCollapseText: {
        display: "flex",
        color: COLORS.EmotionalWhite,
    },
    selectedItem: {
        display: "flex",
    },
    selectedItemText: {
        display: "flex",
        color: COLORS.LightColor,
        fontWeight: "bold",
    },
    Link: {
        display: "flex",
        textDecoration: "none",
        color: COLORS.EmotionalWhite,
    },
};

interface IProps extends React.ClassAttributes<{}> {
    RouterStore?: RouterStore;
    AuthStore?: AuthStore;
}

interface IState extends React.ComponentState {
    collapse: any;
    selected: string;
}

@inject("RouterStore", "AuthStore")
@observer
export class LeftNav extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.listItemArray = [];
        this.listItemKey = 0;

        this.handleClick = this.handleClick.bind(this);
        this.onChangeSelectedItem = this.onChangeSelectedItem.bind(this);
    }

    public state: IState = {
        collapse: {},
        selected: "",
    };

    private listItemArray: any[];
    private listItemKey: number;

    public componentDidMount() {
        const visibleRoutes = ROUTES.filter((route) => route.showLeftNav);
        this.parseRoute(visibleRoutes, true);
    }

    private handleClick(event: React.SyntheticEvent<any>) {
        const target = event.currentTarget.dataset.target;
        const collapse = this.state.collapse;
        const selected = this.state.selected;

        const targetArray = target.split(",");
        if (targetArray.indexOf(selected) > -1) {
            return;
        }
        const targetParent = selected.split(".").shift();
        if (targetParent && targetParent === target) {
            return;
        }

        if (collapse[target]) {
            collapse[target] = !collapse[target];
        } else {
            collapse[target] = true;
        }

        this.setState({
            collapse,
        });
    }

    private generateListItem() {
        this.listItemArray = [];
        this.listItemKey = 0;

        const routes: IRouteInfo[] = Object.assign([], ROUTES).map((route: IRouteInfo) => {
            return route;
        });
        const visibleRoutes = RouteHelper.getRoute(routes, this.props.AuthStore!, true);
        this.listItemArray = this.parseRoute(visibleRoutes).listItemArray;

        return this.listItemArray;
    }

    private onChangeSelectedItem(event: React.SyntheticEvent<HTMLElement>) {
        this.setState({
            selected: event.currentTarget.dataset.name || "",
        });
    }

    private parseRoute(routes: IRouteInfo[], onMount: boolean = false, parent: IRouteInfo = {} as IRouteInfo) {
        const listItemArray: any[] = [];
        let selected = false;

        routes.forEach((route) => {
            if (route.children) {
                const childListItem = this.parseRoute(RouteHelper.getRoute(route.children, this.props.AuthStore!, true), onMount, route);

                if (route.link !== true && route.showLeftNav) {
                    const collapseKey = route.name;
                    const isCollapse = this.state.collapse[collapseKey] || childListItem.selected;

                    const collapse = this.state.collapse;
                    collapse[collapseKey] = isCollapse;
                    this.state.collapse = collapse;

                    listItemArray.push(
                        <div key={++this.listItemKey}>
                            <ListItem
                                button
                                onClick={this.handleClick}
                                data-target={collapseKey}
                                style={childListItem.selected ? styles.selectedCollapse : styles.collapse}>
								<span style={childListItem.selected ? styles.selectedCollapseText : styles.menuText}>
									{route.icon}
								</span>
                                <ListItemText
                                    inset
                                    primary={route.name}
                                    disableTypography={true}
                                    style={childListItem.selected ? styles.selectedCollapseText : styles.menuText}/>
                                <span style={childListItem.selected ? styles.selectedCollapseText : styles.menuText}>
										{this.state.collapse[collapseKey] || childListItem.selected ?
                                            <ExpandLess/> :
                                            <ExpandMore/>
                                        }
									</span>
                            </ListItem>
                            <Collapse
                                in={isCollapse}
                                timeout="auto"
                                unmountOnExit>
                                <List component={"div" as any} disablePadding>
                                    {childListItem.listItemArray}
                                </List>
                            </Collapse>
                        </div>,
                    );
                } else if (route.path && route.showLeftNav) {
                    const selectedPath = this.props.RouterStore!.location.pathname === route.path || this.props.RouterStore!.location.pathname.startsWith(`${route.path}/`);
                    if (selectedPath) {
                        selected = true;
                        this.state.selected = `${parent.name}.${route.name}`;
                    }

                    let listItem;
                    if (route.component) {
                        listItem = (
                            <Link to={route.path} style={styles.Link} key={++this.listItemKey}>
                                <ListItem button style={selectedPath ? styles.selectedItem : {}} onClick={this.onChangeSelectedItem} data-name={`${parent.name}.${route.name}`}>
									<span style={childListItem.selected ? styles.selectedItemText : styles.menuText}>
										{route.icon}
									</span>
                                    <ListItemText
                                        inset
                                        primary={route.name}
                                        disableTypography={true}
                                        style={selectedPath ? styles.selectedItemText : styles.menuText}/>
                                </ListItem>
                            </Link>
                        );
                    } else {
                        listItem = (
                            <a href={route.path} style={styles.Link} key={++this.listItemKey}>
                                <ListItem button style={selectedPath ? styles.selectedItem : {}} onClick={this.onChangeSelectedItem} data-name={`${parent.name}.${route.name}`}>
									<span style={selectedPath ? styles.selectedItemText : styles.menuText}>
										{route.icon}
									</span>
                                    <ListItemText
                                        inset
                                        primary={route.name}
                                        disableTypography={true}
                                        style={selectedPath ? styles.selectedItemText : styles.menuText}/>
                                </ListItem>
                            </a>
                        );
                    }

                    listItemArray.push(listItem);
                }
            } else if (route.path && route.showLeftNav) {
                const selectedPath = this.props.RouterStore!.location.pathname === route.path || this.props.RouterStore!.location.pathname.startsWith(`${route.path}/`);
                if (selectedPath) {
                    selected = true;
                    this.state.selected = `${parent.name}.${route.name}`;
                }

                let listItem;
                if (route.component) {
                    listItem = (
                        <Link to={route.path} style={styles.Link} key={++this.listItemKey}>
                            <ListItem button style={selectedPath ? styles.selectedItem : {}} onClick={this.onChangeSelectedItem} data-name={`${parent.name}.${route.name}`}>
								<span style={selectedPath ? styles.selectedItemText : styles.menuText}>
									{route.icon}
								</span>
                                <ListItemText
                                    inset
                                    primary={route.name}
                                    disableTypography={true}
                                    style={selectedPath ? styles.selectedItemText : styles.menuText}/>
                            </ListItem>
                        </Link>
                    );
                } else {
                    listItem = (
                        <a href={route.path} style={styles.Link} key={++this.listItemKey}>
                            <ListItem button style={selectedPath ? styles.selectedItem : {}} onClick={this.onChangeSelectedItem} data-name={`${parent.name}.${route.name}`}>
								<span style={selectedPath ? styles.selectedItemText : styles.menuText}>
									{route.icon}
								</span>
                                <ListItemText
                                    inset
                                    primary={route.name}
                                    disableTypography={true}
                                    style={selectedPath ? styles.selectedItemText : styles.menuText}/>
                            </ListItem>
                        </a>
                    );
                }

                listItemArray.push(listItem);
            } else if (route.showLeftNav) {
                listItemArray.push(
                    <ListItem button key={++this.listItemKey} onClick={this.onChangeSelectedItem} data-name={`${parent.name}.${route.name}`}>
                        {route.icon}
                        <ListItemText
                            inset primary={route.name}
                            disableTypography={true}
                            style={styles.menuText}/>
                    </ListItem>,
                );
            }
        });

        return {
            listItemArray,
            selected,
        };
    }

    public render() {
        return (
            <Paper
                className={styles.root}
                elevation={5}
                square={true}
            >
                <List className={styles.list}>{this.generateListItem()}</List>
                <div>
                    <Divider />
                    {this.props.children}
                </div>
            </Paper>
        );
    }
}