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

function getRandomInt(min, max) {
  // stolen from MDN
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bin1_2(n){
    //chooses a random number between 0 and n
    //according to a binomial distribution
    //with p = 0.5
    var i = getRandomInt(0, Math.pow(2,n-1));
    var j = 0;
    var r = 0;
    while (i > 0 && j <= n-1) {
	r++;
	console.log(choose(n-1,j));
	i -= choose(n-1, j);
	j++;
    }
    return r;
}