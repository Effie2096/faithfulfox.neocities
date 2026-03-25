const UNIT_MAP = {
	length: ["px", "em", "rem", "vh", "vw", "cm", "mm", "in"],
	time: ["ms", "s"],
	data: ["kb", "mb", "gb", "tb"],
	angles: ["deg", "rad"],
	percent: ["%"],
};

function buildUnits(input) {
	const units = input.flatMap((item) =>
		Array.isArray(item) ? item : UNIT_MAP[item] || [],
	);

	return [...new Set(units)].join("|");
}

const LANGUAGES = {
	sh: {
		string: `"(?:\\\\.|[^"\\\\])*"`,
		file: `[^<>:;"\\/\\\\?$()\\s]+(\\.[^<>:;"\\/\\\\?$()\\s]+)+`,
		flag: `-{1,2}[a-zA-Z][a-zA-Z0-9_-]*`,
		redirect: `((?<=\\d*)&?)[<>]{1,3}(&((\\d+)(?<=&))?)?`,
		number: `(?<!\\w)\\d+(?:\\.\\d+)?`,
		unit: `(?<=\\d(?:\\.\\d+)?)[a-zA-Z]+`,
		word: `[a-zA-Z0-9-+]+`,
		null: `\\/dev\\/null`,
		cont: `&&`,
		pipe: `\\|`,
		space: `\\s`,
		other: `.`,
	},
	nu: {
		string: `(?<!\\$)"(?:\\\\.|[^"\\\\])*"`,
		interpolated: `\\$["\`'].+?["\`']`,
		file: `[^<>:;"\\/\\\\?$()\\s]+(\\.[^<>:;"\\/\\\\?$()\\s]+)+`,
		flag: `-{1,2}[a-zA-Z][a-zA-Z0-9_-]*`,
		number: `(?<!\\w)\\d+(?:\\.\\d+)?`,
		unit: `(?<=\\d(?:\\.\\d+)?)[a-zA-Z]+`,
		var: `\\$[a-zA-Z]+(\\.[a-zA-Z0-9]+)*|(?<=\\|\\s*)[a-zA-Z]+(?=\\s*\\|)`,
		redirect: `(o(ut)?|e(rr)?)\\+?(o(ut)?|e(rr)?)?>`,
		null: `ignore`,
		cont: `;`,
		pipe: `\\|`,
		indent: `^[\\ |\\t]`,
		comment: `#`,
		word: `[a-zA-Z0-9-]+`,
		space: `\\s`,
		other: `.`,
	},
	html: {
		string: `"(?:\\\\.|[^"\\\\])*"`,
		attribute: `[a-z-]+(?=\\s*=\\s*)`,
		unit: `(?<=\\d)(?:${buildUnits([UNIT_MAP.length, UNIT_MAP.angles, UNIT_MAP.percent])})\\b`,
		number: `(?<=[-+]?)\\d+(\\.\\d+)?`,
		placeholder: `(\\.\\.\\.)`,
		comment: `<!--(.|\\n|\\r)*-->`,
		word: `[a-zA-Z-]+`,
		indent: `^[\\ |\\t]`,
		space: `\\s`,
		other: `.`,
	},
	css: {
		string: `"(?:\\\\.|[^"\\\\])*"`,
		class: `\\.[a-zA-Z][a-zA-Z0-9_-]+`,
		unit: `(?<=\\d)(?:${buildUnits([UNIT_MAP.length, UNIT_MAP.angles, UNIT_MAP.percent])})\\b`,
		number: `(?<=[-+]?)\\d+(\\.\\d+)?`,
		pseudo: `(?<=[\\.#]?[a-z-]\\s?)(?::{1,2})[a-z-]+(?:\\(.+\\))??`,
		// value: `(?<=[a-zA-Z-]+:\\s+(?:,)?)(\\s*((?:[^;"']|"[^"]*"|'[^']*')+))(?=;)`,
		property: `([a-zA-Z-]+)(?=:{1}\\s+.*;)`,
		combinator: `(?:\\s+)?([>+~&])(?:\\s+)?`,
		word: `[a-zA-Z-]+`,
		indent: `^[\\ |\\t]`,
		space: `\\s`,
		other: `.`,
	},

	simple: {
		string: `"(?:\\\\.|[^"\\\\])*"`,
		word: `[a-zA-Z]+`,
		space: `\\s`,
		other: `.`,
	},
};

function tokenize(input, regex) {
	const tokens = [];

	let match;

	while ((match = regex.exec(input)) !== null) {
		const type =
			Object.keys(match.groups).find((k) => match.groups[k] !== undefined) ||
			"other";

		tokens.push({ type, value: match[0] });
	}

	return tokens;
}

function assignRoles(tokens, lang) {
	switch (lang) {
		case "sh": {
			let expectExe = true; // start of line expects an exe
			for (const token of tokens) {
				if (token.type === "pipe" || token.type === "cont") {
					expectExe = true; // new command starts
					continue;
				}
				if (token.value === "\n") {
					expectExe = true;
					continue;
				}
				if (token.type === "word") {
					if (expectExe) {
						token.role = "exe";
						expectExe = false;
					} else {
						token.role = "word";
					}
					continue;
				} else {
					token.role = token.type;
				}
				if (token.type === "file") {
					if (expectExe) {
						token.role = "exe";
						expectExe = false;
					} else {
						token.role = "file";
					}
					continue;
				}
				if (token.type === "flag") {
					expectExe = false;
				}
			}
			break;
		}
		case "nu": {
			let expectExe = true;
			let atLineStart = true;
			let comment = false;

			for (const token of tokens) {
				if (token.value === "$") {
					expectExe = false;
					continue;
				}
				if (token.type === "comment") {
					comment = true;
					continue;
				}
				if (token.value === "\n") {
					atLineStart = true;
					expectExe = true;
					comment = false;
					continue;
				}
				if (comment) {
					token.role = "comment";
					continue;
				}
				if (atLineStart && token.type === "space") {
					token.role = "indent";
					continue;
				}
				if (token.type !== "space") {
					atLineStart = false;
				}

				if (token.type === "pipe" || token.type === "cont") {
					expectExe = true; // new command starts
					continue;
				}

				if (token.type === "word") {
					if (expectExe) {
						token.role = "exe";
						expectExe = false;
					} else {
						token.role = "word";
					}
					continue;
				} else {
					token.role = token.type;
				}
				if (token.type === "flag") {
					expectExe = false;
				}
			}
			break;
		}
		case "html": {
			let expectTag = false;
			let atLineStart = true;

			for (const token of tokens) {
				if (token.value === "<") {
					expectTag = true;
					continue;
				}

				if (token.value === "\n") {
					atLineStart = true;
					continue;
				}
				if (atLineStart && token.type === "space") {
					token.role = "indent";
					continue;
				}
				if (token.type !== "space") {
					atLineStart = false;
				}

				if (token.type === "word") {
					if (expectTag) {
						token.role = "tag";
						expectTag = false;
					} else {
						token.role = "word";
					}
				} else {
					token.role = token.type;
				}
			}

			break;
		}
		case "css": {
			let mode = "selector";
			let atLineStart = true;

			for (const token of tokens) {
				if (token.value === "\n") {
					atLineStart = true;
					continue;
				}
				if (atLineStart && token.type === "space") {
					token.role = "indent";
					continue;
				}
				if (token.type !== "space") {
					atLineStart = false;
					continue;
				}

				if (token.value === "{") {
					mode = "block";
				}

				if (mode === "selector" && token.type === "combinator") {
					token.role = "combinator";
				}
				if (mode === "selector" && token.type === "space") {
					token.role = "combinator";
				}
				if (mode === "selector" && token.type === "word") {
					token.role = "element";
				}

				if (token.value === "}") {
					mode = "selector";
				}
			}
			break;
		}
		default:
			for (const token of tokens) {
				token.role = token.type;
			}
	}

	return tokens;
}

function getTokenizer(lang = "sh") {
	const tokens = LANGUAGES[lang];
	const regex = buildRegex(tokens);

	return (input) => tokenize(input, regex);
}

function buildRegex(tokens) {
	return new RegExp(
		Object.keys(tokens)
			.map((name) => `(?<${name}>${tokens[name]})`)
			.join("|"),
		"g",
	);
}

function render(tokens, lang = "sh") {
	return tokens
		.map((t) => {
			if (t.role === "indent") {
				const cls = t.value === "\t" ? "tab" : "space";
				return `<span class="syntax ws indent ${cls}">${t.value}</span>`;
			}
			const cls = t.role || t.type;
			if (lang === "nu") {
				if (cls === "interpolated") {
					const langTokenizer = getTokenizer("nu");
					const innerTokens = assignRoles(
						langTokenizer(t.value.substring(2, t.value.length - 1), "nu"),
					);
					const innerSpans = innerTokens.map((innerToken) => {
						const inCls = innerToken.role || innerToken.type;
						if (inCls === "other" || inCls === "word") {
							return `<span class="syntax string">${innerToken.value}</span>`;
						}
						return `<span class="syntax ${inCls}">${innerToken.value}</span>`;
					});
					return `<span class="syntax ${cls}"><span class="syntax	string">${t.value.substring(0, 2)}</span>${innerSpans.join("")}<span class="syntax string">${t.value.substring(t.value.length - 1, t.value.length)}</span></span>`;
				}
			}
			if (lang === "html") {
				if (cls === "comment") {
					const comment_content = t.value.substring(4, t.value.length - 3);
					return `<span class="syntax comment">&lt;!--${comment_content}--&gt;</span>`;
				}
			}
			if (cls === "space") {
				if (t.value === " ") {
					return `<span class="syntax ws space"> </span>`;
				}
				if (t.value === "\t") {
					return `<span class="syntax ws tab">\t</span>`;
				}
				if (t.value === "\n") {
					return `<span class="syntax ws newline">\n</span>`;
				}
			}
			return `<span class="syntax ${cls}">${t.value}</span>`;
		})
		.join("");
}

function syntaxHighlight(element, lang = "sh") {
	var elementObj = document.getElementById(element) || element;
	var codeElement =
		elementObj.querySelector(":is(code, samp, var)") || elementObj;

	var elementText = codeElement.textContent;

	const langTokenizer = getTokenizer(lang);
	const tokens = assignRoles(langTokenizer(elementText), lang);
	codeElement.innerHTML = render(tokens, lang);
}
