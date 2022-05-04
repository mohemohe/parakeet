import React from "react";
import {inject, observer} from "mobx-react";
import type {SettingsStore} from "../stores/SettingsStore";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import type {Prism} from "react-syntax-highlighter";
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
			"pre": {
				padding: 0,
				background: "transparent",
			},
			["@media (prefers-color-scheme: dark)"]: {
				$nest: {
					"& [data-syntaxHighlighter]": {
						background: "inherit !important",
					},
				},
			},
			"& [data-syntaxHighlighter]": {
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

	private SyntaxHighlighter?: typeof Prism;

	public async componentDidMount() {
		if (!this.props.SettingsStore!.isSSR) {
			const rsh = await import ("react-syntax-highlighter");
			this.SyntaxHighlighter = rsh.Prism;
			this.forceUpdate();
		}
	}

	public render() {
		let body = this.props.content;
		if (!this.props.SettingsStore!.isSSR) {
			const scriptRegex = /<script>(.*?)<\/script>/gsi;
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
		}

		const SyntaxHighlighter = this.SyntaxHighlighter;

		return (
			<ReactMarkdown
				className={`side_content_body markdown-body ${styles.markdown} ${this.props.markdownClassName}`}
				children={body as any}
				remarkRehypeOptions={{
					allowDangerousHtml: true,
				}}
				components={SyntaxHighlighter ? {
					code: ({node, inline, className, children, ...props}) => {
						const match = /language-(\w+)/.exec(className || '');
						return !inline && match ? (
							<SyntaxHighlighter
								children={`${children}`.replace(/\n$/, '')}
								style={prismTheme as any}
								language={UnsafeMarkdown.migrateLanguage(match[1])}
								PreTag="div"
								showLineNumbers={true}
								lineNumberStyle={{minWidth: "2.25em"}}
								{...props}
								data-syntaxHighlighter
							/>
						) : (
							<code className={className} {...props}>
								{children}
							</code>
						)
					}
				} : undefined}
				// @ts-ignore
				remarkPlugins={[remarkBreaks, remarkGfm]}
				// @ts-ignore
				rehypePlugins={[rehypeRaw]}
				{...this.props}
			/>
		);
	}

	private static migrateLanguage(language: string) {
		switch (language) {
			case "sh":
				return "bash";
			default:
				return language;
		}
	}
}
