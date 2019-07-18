import React from 'react';
import {Paper, Table, TableHead, TableBody, TableCell, TableRow, Button} from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import {PaperProps} from '@material-ui/core/Paper';

type Any = any;
interface ITableItem extends Any {
    _id: string;
}

export interface IProps extends PaperProps {
    items?: ITableItem[];
    order?: string[];
    replacer?: Map<string, string>;
    onClickBack?: () => void;
    onClickForward?: () => void;
    disableBackButton?: boolean;
    disableForwardButton?: boolean;
}

export class AutoTable extends React.Component<IProps, {}> {
    constructor(props: IProps, state: {}) {
        super(props, state);

        this.lastHeads = [];
    }

    private lastHeads: string[];

    private updateHeads() {
        const {items} = this.props;

        let keys = this.lastHeads;
        if (items && items.length !== 0) {
            keys = Object.keys(items[0]).filter((key) => key !== "id");
            this.lastHeads = keys;
        }
    }

    private generateHeads(): any[] {
        const {order, items, replacer} = this.props;

        let keys = this.lastHeads;
        if (items && items.length !== 0) {
            keys = Object.keys(items[0]).filter((key) => key !== "id");
            this.lastHeads = keys;
        }

        let reactUniqueKey = 0;
        let heads: any[] = [];
        if (order) {
            heads = order.map((targetKey) => {
                if (keys.indexOf(targetKey) > -1) {
                    return (
                        <TableCell key={++reactUniqueKey}>
                            <div>{replacer ? replacer!.get(targetKey) || targetKey : targetKey}</div>
                        </TableCell>
                    );
                } else {
                    return undefined;
                }
            });
        } else {
            heads = keys.map((key) => {
                return (
                    <TableCell key={++reactUniqueKey}>
                        <div>{key}</div>
                    </TableCell>
                );
            });
        }
        return heads;
    }

    private generateItems(): React.ReactElement<any, any>[] {
        const {order, items} = this.props;
        let keys = this.lastHeads;
        let reactUniqueKey = 0;
        let bodies: React.ReactElement<any, any>[] = [];
        if (items) {
            if (order) {
                bodies = items.map((row) => {
                    const cell = order.map((targetKey) => {
                        return (
                            <TableCell key={++reactUniqueKey}>
                                <div>{row[targetKey]}</div>
                            </TableCell>
                        );
                    });
                    return (
                        <TableRow key={row.id}>{cell}</TableRow>
                    );
                });
            } else {
                if (items) {
                    bodies = items.map((row) => {
                        const cell = keys.filter((key) => key !== "id").map((key) => {
                            return (
                                <TableCell key={++reactUniqueKey}>
                                    <div>{row[key]}</div>
                                </TableCell>
                            );
                        });
                        return (
                            <TableRow key={row.id}>{cell}</TableRow>
                        );
                    });
                }
            }
        }
        return bodies;
    }

    public render() {
        const {items} = this.props;

        if ((!items || items.length === 0) && this.lastHeads.length === 0) {
            return <div/>;
        }

        this.updateHeads();

        return (
            <Paper {...this.props}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {this.generateHeads()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.generateItems()}
                    </TableBody>
                    <Button onClick={this.props.onClickBack ? () => this.props.onClickBack!() : undefined} disabled={this.props.disableBackButton === true}><ArrowBack/></Button>
                    <Button onClick={this.props.onClickForward ? () => this.props.onClickForward!() : undefined} disabled={this.props.disableForwardButton === true}><ArrowForward/></Button>
                </Table>
            </Paper>
        );
    }
}