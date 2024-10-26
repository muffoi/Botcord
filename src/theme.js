function applyColorVars() {
    let cssString = "body, #dialog {", el = document.getElementById("themeCSS");
    for(let i in theme) {
        if(i == _themeData.spec) continue;
        cssString += `--${i}: ${theme[i]};`
    }
    cssString += "}";
    el.textContent = cssString;
}
let _themeData = {
    durations: {
        tr1: 170,
        tr2: 350
    },
    spec: "_dat"
};
const theme = {
    [_themeData.spec]: _themeData.durations,
    bg: "#1e1f22",
    bgNi: "#2b2d31",
    fg: "#313338",
    fgNi: "#37393f",
    // bg: "#17181C",
    // bgNi: "#202024",
    // fg: "#252629",
    // fgNi: "#2E2F33",
    // fgNiNi: "#424245",

    color: "#dddddd",
    colorNi: "#868686",

    accentColor: "#e3c9ff",
    accentLight: "#9f5fff", // "#6b78ff",
    accentLightTransparent: "#9f5fff4d",
    accentExtraLight: "#b27aff",
    accent: "#701dff",// "#515cd3",
    accentTransparent: "#701dff4d",
    accentDark: "#491b98", // "#293297",

    error: "#ff4455",
    errorDark: "#96121d",

    shadow: "#00000066",
    abs: "#ffffff",
    absRgb: "255, 255, 255",

    trSmooth: _themeData.durations.tr1 + "ms",
    trLongEase: _themeData.durations.tr2 + "ms ease-in-out",
    iconFilter: "brightness(1.523)"
};

let isModule = false;
try {
   isModule = !module.children.length;
   if(window.forceNoModule) isModule = false;
} catch {}

if(isModule) {
    module.exports = theme;
} else applyColorVars();