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

    console.log("x: " + x + " y: " + y + " rx: " + rx + " ry: " + ry);

    var r = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2));

    return (0.5 * Math.sin(-.5 * Math.PI + factor * 2 * Math.PI) + .5) * r * Math.abs(rx) / rx / 10;
}