# frontend-mobile for EOS
---

# how it all of this is done
since react-native doesnt provide the crypto module that we desire the most and all of the packages are incompatible with react-native/sea, and so to get `sea.js` working we use a webview(react-native browser) and bridge the crypto module from that browser to the global `window` and thats exactly what `webview-crypto` does, thanks to [webview-crypto repo](https://github.com/saulshanabrook/webview-crypto), the webview-crypto provided in this repo is somewhat the same but modified to get it working and mostly compatible with sea/react-native (even though there is a polyfiller for that but it just doesnt work ;/).
