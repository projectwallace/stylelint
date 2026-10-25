/** @type {Map<string, Promise<import('stylelint').Rule>>} */
const ruleCache = new Map();

/**
 * One literal import() per rule, so bundlers can resolve it. Keep in sync
 * with `ruleNames` below.
 * @type {Record<string, () => Promise<{ default: import('stylelint').Rule }>>}
 */
const ruleLoaders = {
	'alpha-value-notation': () => import('./alpha-value-notation/index.mjs'),
	'annotation-no-unknown': () => import('./annotation-no-unknown/index.mjs'),
	'at-charset-rule-no-invalid': () => import('./at-charset-rule-no-invalid/index.mjs'),
	'at-rule-allowed-list': () => import('./at-rule-allowed-list/index.mjs'),
	'at-rule-descriptor-no-unknown': () => import('./at-rule-descriptor-no-unknown/index.mjs'),
	'at-rule-descriptor-value-no-unknown': () =>
		import('./at-rule-descriptor-value-no-unknown/index.mjs'),
	'at-rule-disallowed-list': () => import('./at-rule-disallowed-list/index.mjs'),
	'at-rule-empty-line-before': () => import('./at-rule-empty-line-before/index.mjs'),
	'at-rule-no-deprecated': () => import('./at-rule-no-deprecated/index.mjs'),
	'at-rule-no-unknown': () => import('./at-rule-no-unknown/index.mjs'),
	'at-rule-no-vendor-prefix': () => import('./at-rule-no-vendor-prefix/index.mjs'),
	'at-rule-prelude-no-invalid': () => import('./at-rule-prelude-no-invalid/index.mjs'),
	'at-rule-property-required-list': () => import('./at-rule-property-required-list/index.mjs'),
	'block-no-empty': () => import('./block-no-empty/index.mjs'),
	'block-no-redundant-nested-style-rules': () =>
		import('./block-no-redundant-nested-style-rules/index.mjs'),
	'color-function-alias-notation': () => import('./color-function-alias-notation/index.mjs'),
	'color-function-notation': () => import('./color-function-notation/index.mjs'),
	'color-hex-alpha': () => import('./color-hex-alpha/index.mjs'),
	'color-hex-length': () => import('./color-hex-length/index.mjs'),
	'color-named': () => import('./color-named/index.mjs'),
	'color-no-hex': () => import('./color-no-hex/index.mjs'),
	'color-no-invalid-hex': () => import('./color-no-invalid-hex/index.mjs'),
	'comment-empty-line-before': () => import('./comment-empty-line-before/index.mjs'),
	'comment-no-empty': () => import('./comment-no-empty/index.mjs'),
	'comment-pattern': () => import('./comment-pattern/index.mjs'),
	'comment-whitespace-inside': () => import('./comment-whitespace-inside/index.mjs'),
	'comment-word-disallowed-list': () => import('./comment-word-disallowed-list/index.mjs'),
	'container-name-pattern': () => import('./container-name-pattern/index.mjs'),
	'custom-media-pattern': () => import('./custom-media-pattern/index.mjs'),
	'custom-property-empty-line-before': () =>
		import('./custom-property-empty-line-before/index.mjs'),
	'custom-property-no-missing-var-function': () =>
		import('./custom-property-no-missing-var-function/index.mjs'),
	'custom-property-pattern': () => import('./custom-property-pattern/index.mjs'),
	'declaration-block-no-duplicate-custom-properties': () =>
		import('./declaration-block-no-duplicate-custom-properties/index.mjs'),
	'declaration-block-no-duplicate-properties': () =>
		import('./declaration-block-no-duplicate-properties/index.mjs'),
	'declaration-block-no-redundant-longhand-properties': () =>
		import('./declaration-block-no-redundant-longhand-properties/index.mjs'),
	'declaration-block-no-shorthand-property-overrides': () =>
		import('./declaration-block-no-shorthand-property-overrides/index.mjs'),
	'declaration-empty-line-before': () => import('./declaration-empty-line-before/index.mjs'),
	'declaration-no-important': () => import('./declaration-no-important/index.mjs'),
	'declaration-property-custom-property-allowed-list': () =>
		import('./declaration-property-custom-property-allowed-list/index.mjs'),
	'declaration-property-max-values': () => import('./declaration-property-max-values/index.mjs'),
	'declaration-property-unit-allowed-list': () =>
		import('./declaration-property-unit-allowed-list/index.mjs'),
	'declaration-property-unit-disallowed-list': () =>
		import('./declaration-property-unit-disallowed-list/index.mjs'),
	'declaration-property-value-allowed-list': () =>
		import('./declaration-property-value-allowed-list/index.mjs'),
	'declaration-property-value-disallowed-list': () =>
		import('./declaration-property-value-disallowed-list/index.mjs'),
	'declaration-property-value-keyword-no-deprecated': () =>
		import('./declaration-property-value-keyword-no-deprecated/index.mjs'),
	'declaration-property-value-no-unknown': () =>
		import('./declaration-property-value-no-unknown/index.mjs'),
	'display-notation': () => import('./display-notation/index.mjs'),
	'font-family-name-quotes': () => import('./font-family-name-quotes/index.mjs'),
	'font-family-no-duplicate-names': () => import('./font-family-no-duplicate-names/index.mjs'),
	'font-family-no-missing-generic-family-keyword': () =>
		import('./font-family-no-missing-generic-family-keyword/index.mjs'),
	'font-weight-notation': () => import('./font-weight-notation/index.mjs'),
	'function-allowed-list': () => import('./function-allowed-list/index.mjs'),
	'function-calc-no-unspaced-operator': () =>
		import('./function-calc-no-unspaced-operator/index.mjs'),
	'function-disallowed-list': () => import('./function-disallowed-list/index.mjs'),
	'function-linear-gradient-no-nonstandard-direction': () =>
		import('./function-linear-gradient-no-nonstandard-direction/index.mjs'),
	'function-name-case': () => import('./function-name-case/index.mjs'),
	'function-no-unknown': () => import('./function-no-unknown/index.mjs'),
	'function-url-no-scheme-relative': () => import('./function-url-no-scheme-relative/index.mjs'),
	'function-url-quotes': () => import('./function-url-quotes/index.mjs'),
	'function-url-scheme-allowed-list': () => import('./function-url-scheme-allowed-list/index.mjs'),
	'function-url-scheme-disallowed-list': () =>
		import('./function-url-scheme-disallowed-list/index.mjs'),
	'hue-degree-notation': () => import('./hue-degree-notation/index.mjs'),
	'import-notation': () => import('./import-notation/index.mjs'),
	'keyframe-block-no-duplicate-selectors': () =>
		import('./keyframe-block-no-duplicate-selectors/index.mjs'),
	'keyframe-declaration-no-important': () =>
		import('./keyframe-declaration-no-important/index.mjs'),
	'keyframe-selector-notation': () => import('./keyframe-selector-notation/index.mjs'),
	'keyframes-name-pattern': () => import('./keyframes-name-pattern/index.mjs'),
	'layer-name-pattern': () => import('./layer-name-pattern/index.mjs'),
	'length-zero-no-unit': () => import('./length-zero-no-unit/index.mjs'),
	'lightness-notation': () => import('./lightness-notation/index.mjs'),
	'max-nesting-depth': () => import('./max-nesting-depth/index.mjs'),
	'media-feature-name-allowed-list': () => import('./media-feature-name-allowed-list/index.mjs'),
	'media-feature-name-disallowed-list': () =>
		import('./media-feature-name-disallowed-list/index.mjs'),
	'media-feature-name-no-unknown': () => import('./media-feature-name-no-unknown/index.mjs'),
	'media-feature-name-no-vendor-prefix': () =>
		import('./media-feature-name-no-vendor-prefix/index.mjs'),
	'media-feature-name-unit-allowed-list': () =>
		import('./media-feature-name-unit-allowed-list/index.mjs'),
	'media-feature-name-value-allowed-list': () =>
		import('./media-feature-name-value-allowed-list/index.mjs'),
	'media-feature-name-value-no-unknown': () =>
		import('./media-feature-name-value-no-unknown/index.mjs'),
	'media-feature-range-notation': () => import('./media-feature-range-notation/index.mjs'),
	'media-query-no-invalid': () => import('./media-query-no-invalid/index.mjs'),
	'media-type-no-deprecated': () => import('./media-type-no-deprecated/index.mjs'),
	'named-grid-areas-no-invalid': () => import('./named-grid-areas-no-invalid/index.mjs'),
	'nesting-selector-no-missing-scoping-root': () =>
		import('./nesting-selector-no-missing-scoping-root/index.mjs'),
	'no-descending-specificity': () => import('./no-descending-specificity/index.mjs'),
	'no-duplicate-at-import-rules': () => import('./no-duplicate-at-import-rules/index.mjs'),
	'no-duplicate-selectors': () => import('./no-duplicate-selectors/index.mjs'),
	'no-empty-source': () => import('./no-empty-source/index.mjs'),
	'no-invalid-double-slash-comments': () => import('./no-invalid-double-slash-comments/index.mjs'),
	'no-invalid-position-at-import-rule': () =>
		import('./no-invalid-position-at-import-rule/index.mjs'),
	'no-invalid-position-declaration': () => import('./no-invalid-position-declaration/index.mjs'),
	'no-irregular-whitespace': () => import('./no-irregular-whitespace/index.mjs'),
	'no-unknown-animations': () => import('./no-unknown-animations/index.mjs'),
	'no-unknown-custom-media': () => import('./no-unknown-custom-media/index.mjs'),
	'no-unknown-custom-properties': () => import('./no-unknown-custom-properties/index.mjs'),
	'number-max-precision': () => import('./number-max-precision/index.mjs'),
	'property-allowed-list': () => import('./property-allowed-list/index.mjs'),
	'property-disallowed-list': () => import('./property-disallowed-list/index.mjs'),
	'property-layout-mappings': () => import('./property-layout-mappings/index.mjs'),
	'property-no-deprecated': () => import('./property-no-deprecated/index.mjs'),
	'property-no-unknown': () => import('./property-no-unknown/index.mjs'),
	'property-no-vendor-prefix': () => import('./property-no-vendor-prefix/index.mjs'),
	'relative-selector-nesting-notation': () =>
		import('./relative-selector-nesting-notation/index.mjs'),
	'rule-empty-line-before': () => import('./rule-empty-line-before/index.mjs'),
	'rule-nesting-at-rule-required-list': () =>
		import('./rule-nesting-at-rule-required-list/index.mjs'),
	'rule-selector-property-disallowed-list': () =>
		import('./rule-selector-property-disallowed-list/index.mjs'),
	'selector-anb-no-unmatchable': () => import('./selector-anb-no-unmatchable/index.mjs'),
	'selector-attribute-name-disallowed-list': () =>
		import('./selector-attribute-name-disallowed-list/index.mjs'),
	'selector-attribute-operator-allowed-list': () =>
		import('./selector-attribute-operator-allowed-list/index.mjs'),
	'selector-attribute-operator-disallowed-list': () =>
		import('./selector-attribute-operator-disallowed-list/index.mjs'),
	'selector-attribute-quotes': () => import('./selector-attribute-quotes/index.mjs'),
	'selector-class-pattern': () => import('./selector-class-pattern/index.mjs'),
	'selector-combinator-allowed-list': () => import('./selector-combinator-allowed-list/index.mjs'),
	'selector-combinator-disallowed-list': () =>
		import('./selector-combinator-disallowed-list/index.mjs'),
	'selector-disallowed-list': () => import('./selector-disallowed-list/index.mjs'),
	'selector-id-pattern': () => import('./selector-id-pattern/index.mjs'),
	'selector-max-attribute': () => import('./selector-max-attribute/index.mjs'),
	'selector-max-class': () => import('./selector-max-class/index.mjs'),
	'selector-max-combinators': () => import('./selector-max-combinators/index.mjs'),
	'selector-max-compound-selectors': () => import('./selector-max-compound-selectors/index.mjs'),
	'selector-max-id': () => import('./selector-max-id/index.mjs'),
	'selector-max-pseudo-class': () => import('./selector-max-pseudo-class/index.mjs'),
	'selector-max-specificity': () => import('./selector-max-specificity/index.mjs'),
	'selector-max-type': () => import('./selector-max-type/index.mjs'),
	'selector-max-universal': () => import('./selector-max-universal/index.mjs'),
	'selector-nested-pattern': () => import('./selector-nested-pattern/index.mjs'),
	'selector-no-deprecated': () => import('./selector-no-deprecated/index.mjs'),
	'selector-no-invalid': () => import('./selector-no-invalid/index.mjs'),
	'selector-no-qualifying-type': () => import('./selector-no-qualifying-type/index.mjs'),
	'selector-no-unmatchable': () => import('./selector-no-unmatchable/index.mjs'),
	'selector-no-vendor-prefix': () => import('./selector-no-vendor-prefix/index.mjs'),
	'selector-not-notation': () => import('./selector-not-notation/index.mjs'),
	'selector-pseudo-class-allowed-list': () =>
		import('./selector-pseudo-class-allowed-list/index.mjs'),
	'selector-pseudo-class-disallowed-list': () =>
		import('./selector-pseudo-class-disallowed-list/index.mjs'),
	'selector-pseudo-class-no-unknown': () => import('./selector-pseudo-class-no-unknown/index.mjs'),
	'selector-pseudo-element-allowed-list': () =>
		import('./selector-pseudo-element-allowed-list/index.mjs'),
	'selector-pseudo-element-colon-notation': () =>
		import('./selector-pseudo-element-colon-notation/index.mjs'),
	'selector-pseudo-element-disallowed-list': () =>
		import('./selector-pseudo-element-disallowed-list/index.mjs'),
	'selector-pseudo-element-no-unknown': () =>
		import('./selector-pseudo-element-no-unknown/index.mjs'),
	'selector-type-case': () => import('./selector-type-case/index.mjs'),
	'selector-type-no-unknown': () => import('./selector-type-no-unknown/index.mjs'),
	'shorthand-property-no-redundant-values': () =>
		import('./shorthand-property-no-redundant-values/index.mjs'),
	'string-no-newline': () => import('./string-no-newline/index.mjs'),
	'syntax-string-no-invalid': () => import('./syntax-string-no-invalid/index.mjs'),
	'time-min-milliseconds': () => import('./time-min-milliseconds/index.mjs'),
	'unit-allowed-list': () => import('./unit-allowed-list/index.mjs'),
	'unit-disallowed-list': () => import('./unit-disallowed-list/index.mjs'),
	'unit-layout-mappings': () => import('./unit-layout-mappings/index.mjs'),
	'unit-no-unknown': () => import('./unit-no-unknown/index.mjs'),
	'value-keyword-case': () => import('./value-keyword-case/index.mjs'),
	'value-keyword-layout-mappings': () => import('./value-keyword-layout-mappings/index.mjs'),
	'value-no-invalid': () => import('./value-no-invalid/index.mjs'),
	'value-no-vendor-prefix': () => import('./value-no-vendor-prefix/index.mjs'),
	'value-type-custom-property-required-list': () =>
		import('./value-type-custom-property-required-list/index.mjs'),
};

/**
 * Returns a cached Promise for the rule, avoiding async overhead for rules that
 * have already been loaded.
 *
 * @param {string} ruleName
 * @returns {Promise<import('stylelint').Rule>}
 */
function getCachedRule(ruleName) {
	let rule = ruleCache.get(ruleName);

	if (!rule) {
		const loader = ruleLoaders[ruleName];

		if (loader === undefined) {
			throw new Error(`"${ruleName}" is not a built-in rule.`);
		}

		rule = loader().then((m) => m.default);
		ruleCache.set(ruleName, rule);
	}

	return rule;
}

const ruleNames = [
	'alpha-value-notation',
	'annotation-no-unknown',
	'at-charset-rule-no-invalid',
	'at-rule-allowed-list',
	'at-rule-descriptor-no-unknown',
	'at-rule-descriptor-value-no-unknown',
	'at-rule-disallowed-list',
	'at-rule-empty-line-before',
	'at-rule-no-deprecated',
	'at-rule-no-unknown',
	'at-rule-no-vendor-prefix',
	'at-rule-prelude-no-invalid',
	'at-rule-property-required-list',
	'block-no-empty',
	'block-no-redundant-nested-style-rules',
	'color-function-alias-notation',
	'color-function-notation',
	'color-hex-alpha',
	'color-hex-length',
	'color-named',
	'color-no-hex',
	'color-no-invalid-hex',
	'comment-empty-line-before',
	'comment-no-empty',
	'comment-pattern',
	'comment-whitespace-inside',
	'comment-word-disallowed-list',
	'container-name-pattern',
	'custom-media-pattern',
	'custom-property-empty-line-before',
	'custom-property-no-missing-var-function',
	'custom-property-pattern',
	'declaration-block-no-duplicate-custom-properties',
	'declaration-block-no-duplicate-properties',
	'declaration-block-no-redundant-longhand-properties',
	'declaration-block-no-shorthand-property-overrides',
	'declaration-empty-line-before',
	'declaration-no-important',
	'declaration-property-custom-property-allowed-list',
	'declaration-property-max-values',
	'declaration-property-unit-allowed-list',
	'declaration-property-unit-disallowed-list',
	'declaration-property-value-allowed-list',
	'declaration-property-value-disallowed-list',
	'declaration-property-value-keyword-no-deprecated',
	'declaration-property-value-no-unknown',
	'display-notation',
	'font-family-name-quotes',
	'font-family-no-duplicate-names',
	'font-family-no-missing-generic-family-keyword',
	'font-weight-notation',
	'function-allowed-list',
	'function-calc-no-unspaced-operator',
	'function-disallowed-list',
	'function-linear-gradient-no-nonstandard-direction',
	'function-name-case',
	'function-no-unknown',
	'function-url-no-scheme-relative',
	'function-url-quotes',
	'function-url-scheme-allowed-list',
	'function-url-scheme-disallowed-list',
	'hue-degree-notation',
	'import-notation',
	'keyframe-block-no-duplicate-selectors',
	'keyframe-declaration-no-important',
	'keyframe-selector-notation',
	'keyframes-name-pattern',
	'layer-name-pattern',
	'length-zero-no-unit',
	'lightness-notation',
	'max-nesting-depth',
	'media-feature-name-allowed-list',
	'media-feature-name-disallowed-list',
	'media-feature-name-no-unknown',
	'media-feature-name-no-vendor-prefix',
	'media-feature-name-unit-allowed-list',
	'media-feature-name-value-allowed-list',
	'media-feature-name-value-no-unknown',
	'media-feature-range-notation',
	'media-query-no-invalid',
	'media-type-no-deprecated',
	'named-grid-areas-no-invalid',
	'nesting-selector-no-missing-scoping-root',
	'no-descending-specificity',
	'no-duplicate-at-import-rules',
	'no-duplicate-selectors',
	'no-empty-source',
	'no-invalid-double-slash-comments',
	'no-invalid-position-at-import-rule',
	'no-invalid-position-declaration',
	'no-irregular-whitespace',
	'no-unknown-animations',
	'no-unknown-custom-media',
	'no-unknown-custom-properties',
	'number-max-precision',
	'property-allowed-list',
	'property-disallowed-list',
	'property-layout-mappings',
	'property-no-deprecated',
	'property-no-unknown',
	'property-no-vendor-prefix',
	'relative-selector-nesting-notation',
	'rule-empty-line-before',
	'rule-nesting-at-rule-required-list',
	'rule-selector-property-disallowed-list',
	'selector-anb-no-unmatchable',
	'selector-attribute-name-disallowed-list',
	'selector-attribute-operator-allowed-list',
	'selector-attribute-operator-disallowed-list',
	'selector-attribute-quotes',
	'selector-class-pattern',
	'selector-combinator-allowed-list',
	'selector-combinator-disallowed-list',
	'selector-disallowed-list',
	'selector-id-pattern',
	'selector-max-attribute',
	'selector-max-class',
	'selector-max-combinators',
	'selector-max-compound-selectors',
	'selector-max-id',
	'selector-max-pseudo-class',
	'selector-max-specificity',
	'selector-max-type',
	'selector-max-universal',
	'selector-nested-pattern',
	'selector-no-deprecated',
	'selector-no-invalid',
	'selector-no-qualifying-type',
	'selector-no-unmatchable',
	'selector-no-vendor-prefix',
	'selector-not-notation',
	'selector-pseudo-class-allowed-list',
	'selector-pseudo-class-disallowed-list',
	'selector-pseudo-class-no-unknown',
	'selector-pseudo-element-allowed-list',
	'selector-pseudo-element-colon-notation',
	'selector-pseudo-element-disallowed-list',
	'selector-pseudo-element-no-unknown',
	'selector-type-case',
	'selector-type-no-unknown',
	'shorthand-property-no-redundant-values',
	'string-no-newline',
	'syntax-string-no-invalid',
	'time-min-milliseconds',
	'unit-allowed-list',
	'unit-disallowed-list',
	'unit-layout-mappings',
	'unit-no-unknown',
	'value-keyword-case',
	'value-keyword-layout-mappings',
	'value-no-invalid',
	'value-no-vendor-prefix',
	'value-type-custom-property-required-list',
];

const rules = /** @type {import('stylelint').PublicApi['rules']} */ ({});

for (const name of ruleNames) {
	Object.defineProperty(rules, name, {
		get() {
			return getCachedRule(name);
		},
		enumerable: true,
		configurable: true,
	});
}

export default rules;
