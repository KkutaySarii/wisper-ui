export const isValidChatLink = (link: string): boolean => {
  const chatLinkPattern = new RegExp(/^(http:\/\/|https:\/\/|www\.)[^\s]+$/);
  return chatLinkPattern.test(link);
};
