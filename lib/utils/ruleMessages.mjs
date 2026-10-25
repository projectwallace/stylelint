/**
 * @type {import('stylelint').Utils['ruleMessages']}
 */
// @ts-expect-error -- TS2322: Type '... => RuleMessages' is not assignable to type '... => R'.
const ruleMessages = function ruleMessages(ruleName, messages) {
	/** @type {import('stylelint').RuleMessages} */
	const newMessages = {};

	for (const [messageId, messageText] of Object.entries(messages)) {
		if (typeof messageText === 'string') {
			newMessages[messageId] = `${messageText} (${ruleName})`;
		} else {
			newMessages[messageId] = (...args) => `${messageText(...args)} (${ruleName})`;
			Object.defineProperty(newMessages[messageId], 'length', { value: messageText.length });
		}
	}

	return newMessages;
};

export default ruleMessages;
