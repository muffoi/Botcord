function applyColorVars() {
    let cssString = 'body, #dialog {', el = document.getElementById('themeCSS');
    for(let i in theme) {
        if(i == _themeData.spec) continue;
        cssString += `--${i}: ${theme[i]};`
    }
    cssString += '}';
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
    bg: '#1e1f22',
    bgNi: '#2b2d31',
    fg: '#313338',
    fgNi: '#37393f',
    color: '#dddddd',
    colorNi: '#868686',
    accent: '#515cd3',
    accentLight: '#6b78ff',
    accentDark: '#293297',
    error: '#ff4455',
    errorDark: '#96121d',
    shadow: '#00000066',
    abs: '#ffffff',
    absRgb: '255, 255, 255',
    trSmooth: _themeData.durations.tr1 + 'ms',
    trLongEase: _themeData.durations.tr2 + 'ms ease-in-out',
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