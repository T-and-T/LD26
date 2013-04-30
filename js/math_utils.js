function fact(n){
    // compute the factorial of n.
    var r = 1;
    var i = 1
    for (; i <= n; i++)
	r *= i;
    return r;
}

function choose(n, k){
    return (fact(n)/(fact(k)*fact(n-k)));
}

function bin1_2(n){
    //chooses a random number between 0 and n
    //according to a binomial distribution
    //with p = 0.5
    var i = Math.floor(Math.random() * (Math.pow(2,n-1) + 1));
    var j = 0;
    var r = 0;
    while (i > 0 && j <= n-1) {
	r++;
	i -= choose(n-1, j);
	j++;
    }
    return r;
}

function scaled_sin(x) {
    return 0.5 * Math.sin(Math.PI * (x - 0.5)) + 0.5;
}

function circle_scale(x, y, w, h, factor) {
    var rx = x - w / 2;
    var ry = y - h / 2;

    var r = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2));

    var result =  (0.5 * Math.sin(-.5 * Math.PI + factor * 2 * Math.PI) + .5) * r * Math.abs(rx) / rx / 10;

    if (isNaN(result)) result = 0;
    return result;
}

function triangle(n) {
    return n*(n+1)/2;
}

function RGBtoHSV(rgb) { // from http://www.cs.rit.edu/~ncs/color/t_convert.html
    var hsv = {};

    var min, max, delta;

    min = Math.min(rgb.r, rgb.g, rgb.b);
    max = Math.max(rgb.r, rgb.g, rgb.b);
    hsv.v = max / 255;

    delta = max - min;

    if (max != 0)
        hsv.s = delta / max
    else {
        hsv.s = 0;
        hsv.h = -1;
        return hsv;
    }

    if (rgb.r == max)
        hsv.h = (rgb.g - rgb.b) / delta;
    else if (rgb.g == max)
        hsv.h = 2 + (rgb.b - rgb.r) / delta;
    else
        hsv.h = 4 + (rgb.r - rgb.g) / delta;

    hsv.h *= 60;
    if (hsv.h < 0)
        hsv.h += 360;

    return hsv;
}

function HSVtoRGB(hsv) { // from http://www.cs.rit.edu/~ncs/color/t_convert.html
    var rgb = {};
    var i, f, p, q, t;

    if (hsv.s == 0) {
        rgb.r = rgb.g = rgb.b = hsv.v * 255;
        return rgb;
    }

    hsv.h /= 60;
    i = Math.floor(hsv.h);
    f = hsv.h - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - hsv.s * f);
    t = hsv.v * (1 - hsv.s * (1 - f));

    switch (i) {
        case 0:
            rgb.r = hsv.v;
            rgb.g = t;
            rgb.b = p;
            break;
        case 1:
            rgb.r = q;
            rgb.g = hsv.v;
            rgb.b = p;
            break;
        case 2:
            rgb.r = p;
            rgb.g = hsv.v;
            rgb.b = t;
            break;
        case 3:
            rgb.r = p;
            rgb.g = q;
            rgb.b = hsv.v;
            break;
        case 4:
            rgb.r = t;
            rgb.g = p;
            rgb.b = hsv.v;
            break;
        default:
            rgb.r = hsv.v;
            rgb.g = p;
            rgb.b = q;
            break;
    }

    rgb.r = Math.round(rgb.r * 255);
    rgb.g = Math.round(rgb.g * 255);
    rgb.b = Math.round(rgb.b * 255);

    return rgb;
}