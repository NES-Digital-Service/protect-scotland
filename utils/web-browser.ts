import * as WebBrowser from 'expo-web-browser';

export const openBrowserAsync = (link: string) =>
  WebBrowser.openBrowserAsync(link, {
    enableBarCollapsing: true,
    showInRecents: true
  });
