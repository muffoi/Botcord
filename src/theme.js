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

let _v = variable => `var(--${variable})`;

const theme = {
    [_themeData.spec]: _themeData.durations,
    
    background: "#1E1F22",
    backgroundLight: "#292C2F",
    foreground: "#313338",
    foregroundLight: "#414347",

    color: "#dddddd",
    colorDark: "#868686",

    accentLightest: "#e3c9ff",
    accentLighter: "#b27aff",
    accentLight: "#9f5fff",
    accentLightTransparent: "#9f5fff4d",
    accent: "#701dff",
    accentTransparent: "#701dff4d",
    accentDark: "#470EAA",

    error: "#ff4455",
    errorDark: "#96121d",

    shadow: "#000000aa",
    absolute: "#ffffff",
    absoluteRgb: "255, 255, 255",

    trSmooth: _themeData.durations.tr1 + "ms",
    trLongEase: _themeData.durations.tr2 + "ms ease-in-out",
    iconFilter: "brightness(1.523)"
};

theme.shadowXs = _v("shadow") + " 0 0 8px";
theme.shadowSm = _v("shadow") + " 0 4px 8px";
theme.shadowMd = _v("shadow") + " 0 8px 16px";
theme.shadowLg = _v("shadow") + " 0 16px 32px";

let isModule = false;
try {
   isModule = !module.children.length;
   if(window.forceNoModule) isModule = false;
} catch {}

if(isModule) {
    module.exports = theme;
} else applyColorVars();