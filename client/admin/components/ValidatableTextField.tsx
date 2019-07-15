import * as React from "react";
import { style } from "typestyle/lib";
import { TextField } from "@material-ui/core";
import { StandardTextFieldProps } from "@material-ui/core/TextField";
import { COLORS } from "../constants/Style";

interface IValidator {
    errorText?: string;
    isValid: (text: string) => boolean;
}

interface IProps extends StandardTextFieldProps {
    value?: string;
    validators: IValidator[];
    onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isValid?: (isValid: boolean) => void;
}

interface IState extends React.ComponentState {
    didInitialValidate: boolean;
    helperText?: string;
}

const styles = {
    errorText: style({
        color: COLORS.DangerRed,
    }),
};

export class ValidatableTextField extends React.Component<IProps, IState> {
    constructor(props: IProps, state: IState) {
        super(props, state);

        this.onChangeTextField = this.onChangeTextField.bind(this);
        this.validate = this.validate.bind(this);
    }

    public state = {
        helperText: undefined,
        didInitialValidate: false,
    };

    public componentDidMount() {
        if (!this.state.didInitialValidate) {
            this.validate(this.props.value || "");
        }
    }

    public componentWillReceiveProps(props: IProps) {
        if (!this.state.didInitialValidate && props.value === "") {
            this.validate(props.value || "");
        } else if (!this.state.didInitialValidate && props.value !== "") {
            this.setState({
                didInitialValidate: true,
            }, () => {
                this.validate(props.value || "");
            });
        }
    }

    private onChangeTextField(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        this.validate(value);

        if (this.props.onChangeValue) {
            this.props.onChangeValue(event);
        }
    }

    private validate(text: string) {
        let isValid;
        for (const validator of this.props.validators) {
            isValid = validator.isValid(text);
            if (!isValid) {
                this.setState({
                    helperText: validator.errorText,
                }, () => {
                    if (this.props.isValid) {
                        this.props.isValid(false);
                    }
                });
                break;
            }
        }

        if (isValid) {
            this.setState({
                helperText: "",
            }, () => {
                if (this.props.isValid) {
                    this.props.isValid(true);
                }
            });
        }
    }

    public render() {
        return (
            <TextField
                helperText={<span className={styles.errorText}>{this.state.helperText}</span>}
                margin={this.props.margin || "normal"}
                onChange={this.onChangeTextField}
                {...this.props}
            />
        );
    }
}