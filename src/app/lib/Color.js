const LETTERS = ['r','g','b','a'];

const padLeft = function(str,pad,length){
    while (str.length<length)
        str = pad+str;
    return str;
};

const TYPES = ['rgb','int','float','hex'];
const clearTypes = function(notType){
    const p = this._private;
    TYPES.forEach(type=>{
        p[type+'Set'] = type==notType;
    });
};

const COLORS = {
    aliceBlue: "#F0F8FF",
    antiqueWhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedAlmond: "#FFEBCD",
    blue: "#0000FF",
    blueViolet: "#8A2BE2",
    brown: "#A52A2A",
    burlyWood: "#DEB887",
    cadetBlue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerBlue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkBlue: "#00008B",
    darkCyan: "#008B8B",
    darkGoldenRod: "#B8860B",
    darkGray: "#A9A9A9",
    darkGreen: "#006400",
    darkGrey: "#A9A9A9",
    darkKhaki: "#BDB76B",
    darkMagenta: "#8B008B",
    darkOliveGreen: "#556B2F",
    darkOrange: "#FF8C00",
    darkOrchid: "#9932CC",
    darkRed: "#8B0000",
    darkSalmon: "#E9967A",
    darkSeaGreen: "#8FBC8F",
    darkSlateBlue: "#483D8B",
    darkSlateGray: "#2F4F4F",
    darkSlateGrey: "#2F4F4F",
    darkTurquoise: "#00CED1",
    darkViolet: "#9400D3",
    deepPink: "#FF1493",
    deepSkyBlue: "#00BFFF",
    dimGray: "#696969",
    dimGrey: "#696969",
    dodgerBlue: "#1E90FF",
    fireBrick: "#B22222",
    floralWhite: "#FFFAF0",
    forestGreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostWhite: "#F8F8FF",
    gold: "#FFD700",
    goldenRod: "#DAA520",
    gray: "#808080",
    green: "#008000",
    greenYellow: "#ADFF2F",
    grey: "#808080",
    honeyDew: "#F0FFF0",
    hotPink: "#FF69B4",
    indianRed: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderBlush: "#FFF0F5",
    lawnGreen: "#7CFC00",
    lemonChiffon: "#FFFACD",
    lightBlue: "#ADD8E6",
    lightCoral: "#F08080",
    lightCyan: "#E0FFFF",
    lightGoldenRodYellow: "#FAFAD2",
    lightGray: "#D3D3D3",
    lightGreen: "#90EE90",
    lightGrey: "#D3D3D3",
    lightPink: "#FFB6C1",
    lightSalmon: "#FFA07A",
    lightSeaGreen: "#20B2AA",
    lightSkyBlue: "#87CEFA",
    lightSlateGray: "#778899",
    lightSlateGrey: "#778899",
    lightSteelBlue: "#B0C4DE",
    lightYellow: "#FFFFE0",
    lime: "#00FF00",
    limeGreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumAquaMarine: "#66CDAA",
    mediumBlue: "#0000CD",
    mediumOrchid: "#BA55D3",
    mediumPurple: "#9370DB",
    mediumSeaGreen: "#3CB371",
    mediumSlateBlue: "#7B68EE",
    mediumSpringGreen: "#00FA9A",
    mediumTurquoise: "#48D1CC",
    mediumVioletRed: "#C71585",
    midnightBlue: "#191970",
    mintCream: "#F5FFFA",
    mistyRose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajoWhite: "#FFDEAD",
    navy: "#000080",
    oldLace: "#FDF5E6",
    olive: "#808000",
    oliveDrab: "#6B8E23",
    orange: "#FFA500",
    orangeRed: "#FF4500",
    orchid: "#DA70D6",
    paleGoldenRod: "#EEE8AA",
    paleGreen: "#98FB98",
    paleTurquoise: "#AFEEEE",
    paleVioletRed: "#DB7093",
    papayaWhip: "#FFEFD5",
    peachPuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderBlue: "#B0E0E6",
    purple: "#800080",
    rebeccaPurple: "#663399",
    red: "#FF0000",
    rosyBrown: "#BC8F8F",
    royalBlue: "#4169E1",
    saddleBrown: "#8B4513",
    salmon: "#FA8072",
    sandyBrown: "#F4A460",
    seaGreen: "#2E8B57",
    seaShell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyBlue: "#87CEEB",
    slateBlue: "#6A5ACD",
    slateGray: "#708090",
    slateGrey: "#708090",
    snow: "#FFFAFA",
    springGreen: "#00FF7F",
    steelBlue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whiteSmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowGreen: "#9ACD32"
};

const rgb2float = function(){
    const p = this._private;
    p.rf = p.r/256;
    p.gf = p.g/256;
    p.bf = p.b/256;
    p.af = p.ai/256;
    p.floatSet = true;
};
const float2rgb = function(){
    const p = this._private;
    p.r = Math.round(p.rf*256);
    p.g = Math.round(p.rf*256);
    p.b = Math.round(p.rf*256);
    p.ai = Math.round(p.rf*256);
    p.rgbSet = true;
};

const prepRGB = function(){
    const p = this._private;
    if (p.rgbSet)
        return;

    if (p.floatSet)
        float2rgb.call(this);
    else {
        let a;
        if (p.hexSet)
            a = Color.hex2rgb(p.hex);
        else
            a = Color.int2rgb(p.int);
        p.r = a[0];
        p.g = a[1];
        p.b = a[2];
        if (a.length>3)
            p.ai = a[3];
    }
    p.rgbSet = true;
};

const prepHex = function(){
    const p = this._private;
    if (p.hexSet)
        return;

    if (p.rgbSet || p.floatSet) {
        if (!p.rgbSet)
            float2rgb.call(this);
        p.hex = Color.rgb2hex(p.r, p.g, p.b, p.aUsed ? p.ai : null);
    }
    else
        p.hex = Color.int2hex(p.int);
    p.hexSet = true;
};

const prepInt = function(){
    const p = this._private;
    if (p.intSet)
        return;

    if (p.rgbSet || p.floatSet) {
        if (!p.rgbSet)
            float2rgb.call(this);
        p.int = Color.rgb2int(p.r, p.g, p.b, p.aUsed ? p.ai : null);
    }
    else
        p.int = Color.hex2int(p.hex);
    p.intSet = true;
};

const prepFloat = function(){
    const p = this._private;
    if (p.floatSet)
        return;

    prepRGB.call(this);
    rgb2float.call(this);
    p.floatSet = true;
};

const prep = function(){
    const p = this._private;
    if (p.rgbSet)
        return;

    if (p.floatSet)
        float2rgb.call(this);
    else if (p.hexSet) {
        let a = Color.hex2rgb(p.hex);
        p.r = a[0];
        p.g = a[1];
        p.b = a[2];
        if (a.length>3)
            p.ai = a[3];
    }
    else if (p.intSet) {
        let a = Color.int2rgb(p.int);
        p.r = a[0];
        p.g = a[1];
        p.b = a[2];
        if (a.length>3)
            p.ai = a[3];
    }
    p.rgbSet = true;
};

export default class Color {
    constructor(r_int_hex_color=null,g_a=null,b=null,a=null){
        const p = this._private = {
            rf:0,
            gf:0,
            bf:0,
            af:0,
            r:0,
            b:0,
            g:0,
            ai:0,
            int:0,
            hex:'',
            aUsed:false,
            rgbSet:false,
            floatSet:false,
            intSet:false,
            hexSet:false
        };
        if (r_int_hex_color && typeof r_int_hex_color == 'object') {
            if (r_int_hex_color.a)
                a = r_int_hex_color.a;
            b = r_int_hex_color.b;
            g_a = r_int_hex_color.g;
            r_int_hex_color = r_int_hex_color.r;
        }
        if (typeof r_int_hex_color=='string') {
            if (COLORS[r_int_hex_color])
                this.hex = COLORS[r_int_hex_color];
            else
                this.hex = r_int_hex_color;
            if (g_a !== null)
                this['a'+(g_a>1?'i':'f')] = g_a;
        }
        else if (r_int_hex_color) {
            if (b===null) {
                this.int = r_int_hex_color;
                if (g_a !== null)
                    this['a'+(g_a>1?'i':'f')] = g_a;
            }
            else {
                const suffix = (r_int_hex_color<=1 && g_a<=1 && b<=1) ? 'f' : '';
                this['r'+suffix] = r_int_hex_color;
                p['g'+suffix] = g_a;
                p['b'+suffix] = b;
                if (a !== null)
                    this['a'+(a>1?'':'f')] = a;
            }
        }
    }

    get r(){
        prepRGB.call(this);
        return this._private.r;
    }
    get g(){
        prepRGB.call(this);
        return this._private.g;
    }
    get b(){
        prepRGB.call(this);
        return this._private.b;
    }
    get a(){
        prepRGB.call(this);
        return this._private.ai;
    }
    get rf(){
        prepFloat.call(this);
        return this._private.rf;
    }
    get gf(){
        prepFloat.call(this);
        return this._private.gf;
    }
    get bf(){
        prepFloat.call(this);
        return this._private.bf;
    }
    get af(){
        prepFloat.call(this);
        return this._private.af;
    }
    get hex(){
        prepHex.call(this);
        return this._private.hex;
    }
    get int(){
        prepFloat.call(this);
        return this._private.int;
    }

    set r(val){
        const p = this._private;
        p.r = val;
        clearTypes.call(this,'rgb');
    }
    set g(val){
        const p = this._private;
        p.g = val;
        clearTypes.call(this,'rgb');
    }
    set b(val){
        const p = this._private;
        p.b = val;
        clearTypes.call(this,'rgb');
    }
    set a(val){
        const p = this._private;
        p.ai = val;
        clearTypes.call(this,'rgb');
    }
    set rf(val){
        const p = this._private;
        p.rf = val;
        clearTypes.call(this,'float');
    }
    set gf(val){
        const p = this._private;
        p.gf = val;
        clearTypes.call(this,'float');
    }
    set bf(val){
        const p = this._private;
        p.bf = val;
        clearTypes.call(this,'float');
    }
    set af(val){
        const p = this._private;
        p.af = val;
        clearTypes.call(this,'float');
    }
    set hex(val){
        const p = this._private;
        p.hex = val.replace(/^#/,'');
        clearTypes.call(this,'hex');
    }
    set int(val){
        const p = this._private;
        p.int = int;
        clearTypes.call(this,'int');
    }

    clone(){
        return new Color(this.hex);
    }

    static addNamedColor(name,color) {
        if (!(color instanceof Color))
            color = new Color(color);
        COLORS[name] = color.hex;
    }

    static rgb2hex(r,g,b,a=null) {
        return '#'+r.toString(16)+g.toString(16)+b.toString(16)+(a===null?'':a.toString(16));
    }
    static hex2rgb(str,returnAsObject=false){
        str = str.replace(/^#/,'');
        const size = str.length<6?1:(str.length<12?2:4);
        const count = Math.min(4,Math.ceil(str.length/size));
        let ret = returnAsObject?{}:[];
        for (let i=0;i<count;i++) {
            if (returnAsObject)
                ret[LETTERS[i]] = parseInt(str.substr(i*size, size), 16);
            else
                ret.push(parseInt(str.substr(i, size), 16));
        }
        return ret;
    }
    static int2hex(int){
        let str = int.toString(16);
        const size = str.length<6?1:(str.length<12?2:4);
        str = padLeft(str,'0',str.length+(str.length%size));

        let ret = '';
        for (let i=-size;i>=-str.length;i-=size)
            ret+=str.substr(i,size)

        return ret;
    }
    static hex2int(str){
        const size = str.length<6?1:(str.length<12?2:4);

        let hex = '';
        for (let i=0;i<str.length;i+=size)
            hex = str.substr(i,size)+hex;

        return parseInt(hex,16);
    }
    static rgb2int(r,g,b,a=0){
        return a*Math.pow(256,3) + b*Math.pow(256,2) + g*256 + r;
    }
    static int2rgb(int,returnAsObject=false){
        let ret = returnAsObject?{}:[];
        let ind = 0;
        while (int>=256||!!ind) {
            let v = int%256;
            if (returnAsObject)
                ret[LETTERS[ind]] = v;
            else
                ret.push(v);
            ind++;
            int-=v;
            int/=256;
        }

        return ret;
    }
}