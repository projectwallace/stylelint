import type { Plugin, Rule } from 'stylelint';

/**
 * Create a stylelint plugin rule definition.
 */
declare function createPlugin(ruleName: string, rule: Rule): Plugin;

export default createPlugin;
