import React from "react";
import {inject, observer} from "mobx-react";
import type {SettingsStore} from "../stores/SettingsStore";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {nord as prismTheme} from "react-syntax-highlighter/dist/esm/styles/prism";
import {style} from "typestyle";

interface IProps extends React.ComponentClass<HTMLDivElement> {
	SettingsStore?: SettingsStore;
	markdownClassName?: string;
	content: string;
}

interface IState extends React.ComponentState {
}

const styles = {
	markdown: style({
		lineHeight: 1.75,
		$nest: {
			"& [data-syntaxHighlighter]": {
				background: "inherit !important",
				padding: "0 !important",
				margin: "0 !important",
				fontSize: "1rem !important",
			},
		},
	}),
}

@inject("SettingsStore")
@observer
export class UnsafeMarkdown extends React.Component<IProps, IState> {
	constructor(props: IProps, state: IState) {
		super(props, state);
	}

	public render() {
		if (this.props.SettingsStore!.isSSR) {
			return <></>;
		}

		const scriptRegex = /<script>(.*?)<\/script>/gsi;

		let body = this.props.content;
		const scripts = [...(body as any).matchAll(scriptRegex)];

		if (scripts) {
			for (let i = 0; i < scripts.length; i++) {
				body = body.replace(scripts[i][0], "");
				const script = scripts[i][1];
				console.log(`script[${i+1}/${scripts.length}]`, script);
				try {
					(window as any).eval(script || "");
				} catch (e) {
					console.error("script evaluate error:", e);
				}
			}
		}
		return (
			<ReactMarkdown
				className={`side_content_body markdown-body ${styles.markdown} ${this.props.markdownClassName}`}
				children={body as any}
				remarkRehypeOptions={{
					allowDangerousHtml: true,
				}}
				components={{
					code({node, inline, className, children, ...props}) {
						const match = /language-(\w+)/.exec(className || '');
						console.log(match);
						return !inline && match ? (
							<SyntaxHighlighter
								children={String(children).replace(/\n$/, '')}
								style={prismTheme as any}
								language={match[1] === "sh" ? "bash" : match[1]}
								PreTag="div"
								{...props}
								data-syntaxHighlighter
							/>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						)
					}
				}}
				// @ts-ignore
				remarkPlugins={[remarkBreaks, remarkGfm]}
				// @ts-ignore
				rehypePlugins={[rehypeRaw]}
				{...this.props}
			/>
		);
	}
}
