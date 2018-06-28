function lt1 (x, y) {
    return x + y;
}


function lt2 (x, y) {
    return x * y;
}

function lt3 (n) {
    let res = 1;
    for (let i = 1; i<=n; i++) {
        res *=i;
    }
    return res;
}

function lt4 (x, y) {
    return Math.pow(x, y);
}

function lt5 (x) {
    return x > 0 ? x - 1 : 0;
}

function lt6 (x, y) {
    return x > y ? x - y : 0;
}

function lt7 (x, y) {
    return lt6 (x, y) + lt6 (y, x);

    function lt6 (x, y) {
        return x > y ? x - y : 0;
    }
}

function lt8 (x) {
    return 1 > x ? 1 - x : 0;
}


function lt9 (arr) {
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        res += arr[i]
    }
    return res;
}

function lt10 (arr) {
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        res *= arr[i]
    }
    return res;
}

function lt11 (x, y) {

    return lt8(lt8(lt7(x, y)));

    function lt7 (x, y) {
        return lt6 (x, y) + lt6 (y, x);

        function lt6 (x, y) {
            return x > y ? x - y : 0;
        }
    }
    function lt8 (x) {
        return 1 > x ? 1 - x : 0;
    }
}

function lt12 (x, y) {
    return !(x === y);
}

function lt13 (x, y) {
    return x > y;
}

function lt14 (x, y) {
    return x <= y;
}

function lt15 (x, y) {
    return x % y === 0;
}

function lt16 (x, y) {
    return x / y;
}

/**
 * 判断x是否为素数
 * @param x
 * @returns {number}
 */
function lt17 (x) {
    if (x <= 1 || (x > 2 && x % 2 === 0)) return 0;
    let i = 3;
    let limit = Math.sqrt(x);
    while (i <= limit) {
        if (x % i === 0) return 0;
        i += 2;
    }
    return 1;
}

/**
 * 返回第i个素数
 * @param i
 * @returns {number}
 */
function lt18(i) {
    if (i < 0) return 0;
    if (i === 1) return 1;
    let count = 1;
    let j = 3;
    while (1) {
        if (lt17(j)) count++;
        if (count >= i) break;
        j += 2;
    }
    return j;

    function lt17 (x) {
        if (x <= 1 || (x > 2 && x % 2 === 0)) return 0;
        let i = 3;
        let limit = Math.sqrt(x);
        while (i <= limit) {
            if (x % i === 0) return 0;
            i += 2;
        }
        return 1;
    }
}

function lt19 (x, y) {
    return x % y;
}

/**
 * 返回正整数的素因子分解序列中非零指数的个数
 * @param num
 */
function lt20 (num) {
    let n = 0;

    for (let i = 2; i <= num;  i === 2? i++ : i+=2) {

        if(!lt17(i)) continue;

        if (num % i === 0) n++;

        while (num % i === 0) {
            num /= i;
        }
    }

    return n;
}

/**
 * 返回正整数的素因子分解序列中第i个素数的指数
 * @param num
 * @param j
 */
function lt21 (num, j) {
    let arr = [];

    for (let i = 2; i <= num; i === 2? i++ : i+=2) {
        if(!lt17(i)) continue;
        arr.push(0);
        while (num % i === 0) {
            num /= i;
            arr[arr.length - 1]++;
        }
    }

    return arr[j - 1];
}

/**
 * 返回正整数素因子分解序列非0指数的最大素数的序号
 * @param num
 */
function lt22 (num) {
    let arr = [];

    for (let i = 2; i <= num; i === 2? i++ : i+=2) {
        if(!lt17(i)) continue;
        arr.push(0);
        while (num % i === 0) {
            num /= i;
            arr[arr.length - 1]++;
        }
    }
    return arr.length;
}

/**
 * 判断正整数素因子分解序列元素指数是否都大于0
 * @param num
 */
function lt23 (num) {
    for (let i = 2; i <= num; i === 2? i++ : i+=2) {
        if(!lt17(i)) continue;
        if (num % i !== 0) return false;
        while (num % i === 0) {
            num /= i;
        }
    }
    return true;
}

/**
 * 返回正整数的素因子序列对应的giao数
 * @param num
 */
function lt24(num) {
    let arr = [];

    for (let i = 2; i <= num; i === 2? i++ : i+=2) {
        if(!lt17(i)) continue;
        arr.push(0);
        while (num % i === 0) {
            num /= i;
            arr[arr.length - 1]++;
        }
    }

    return arr;
}

/**
 * Giao乘
 * @param n1
 * @param n2
 */
function lt25 (n1, n2) {

    let arr1 = decompose(n1);
    let arr2 = decompose(n2);
    return arr1.concat(arr2);

    function decompose (num) {
        let arr = [];

        for (let i = 2; i <= num; i === 2 ? i++ : i+=2) {
            if(!lt17(i)) continue;
            arr.push(0);
            while (num % i === 0) {
                num /= i;
                arr[arr.length - 1]++;
            }
        }

        return arr;
    }
}

/**
 * 返回在num的素因子分解序列中指数为a的素因子的个数
 * @param num
 * @param a
 * @returns {int}
 */
function lt26 (num, a) {
    if (a < 0) {
        console.warn('指数不能小于0！');
        return NaN;
    }
    let flag = 0;
    let arr = [];

    for (let i = 2; i <= num; i === 2 ? i++ : i+=2) {
        if(!lt17(i)) continue;
        arr.push(0);
        while (num % i === 0) {
            num /= i;
            arr[arr.length - 1]++;
            if (num % i !== 0 && arr[arr.length - 1] === a) {
                flag++;
            }
        }
    }
    return flag;
}

/**
 * Cantor配对函数编码
 * @param x
 * @param y
 */
function lt27 (x, y) {
    return ( x + y ) * ( x + y + 1 ) / 2 + y;
}


/**
 * Cantor配对函数反编码求右部
 * @param z
 */
function lt28 (z) {
    if (z < 0) {
        console.warn('参数不能小于0！');
        return null;
    }
    let n = 0;
    let sum = 0;
    while (sum <= z) {
        n++;
        sum += n;
    }
    //由证明可知，x+y = n - 1，故z = n * (n - 1) / 2 + y。

    return z - n * (n - 1) / 2;

}

/**
 * Cantor配对函数反编码求左部
 *  * @param z
 * @returns {*}
 */
function lt29 (z) {
    if (z < 0) {
        console.warn('参数不能小于0！');
        return null;
    }
    let n = 0;
    let sum = 0;
    while (sum <= z) {
        n++;
        sum += n;
    }
    //由证明可知，x+y = n - 1，故z = n * (n - 1) / 2 + y。

    let y = z - n * (n - 1) / 2;
    return n - y - 1;

}

/**
 * 判断num是否为某个P-T程序的giao数
 * @param num
 */
function lt30 (num) {
    //求得num的giao数
    let giao = [];

    for (let i = 2; i <= num; i === 2 ? i++ : i+=2) {
        if(!lt17(i)) continue;
        giao.push(0);
        while (num % i === 0) {
            num /= i;
            giao[giao.length - 1]++;
        }
    }

    let tmp = {}; //用于判断唯一性

    //遍历giao
    for (let i = 0; i< giao.length; i++) {
        let c = getCantor(giao[i]);
        if(c.x !==0 && !tmp[c.x]) {
            tmp[c.x] = 1;
        }
        if (tmp[c.x] || c.y === 0) return false; //e对应配对函数的非零左部须取唯一值，右部不能为0
        if (c.x <= giao.length && giao[i] === 0) return false; //当左部小于或等于最大非指数零素因子的序号时，对应的指数不为0
    }
    return true;

    function getCantor (z) {
        let n = 0;
        let sum = 0;
        while (sum <= z) {
            n++;
            sum += n;
        }
        let y = z - n * (n - 1) / 2;
        let x =  n - y - 1;
        return {
            y: y,
            x: x
        }
    }
}