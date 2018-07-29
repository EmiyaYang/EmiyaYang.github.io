let testArr = [1,2,3,4,7,8];

/**
 * Created by Emiya on 2018/6/17.
 */
function swap (arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

/**
 * 输出一个集合充的全排列
 * @param list 这里暂用无重复元素的数组来代替集合
 * @param k
 */
function perm (list, k) {
    if (k === list.length) {
        console.log(list);
        return;
    }
    for (let i = k; i < list.length; i++) {
        swap(list, k, i);
        perm(list, k + 1);
        swap(list, k, i);
    }
}

/**
 * 递归方法求一个正整数的划分数
 * @param n 正整数
 * @param m 划分中不超过的数
 * @returns {number}
 */
function divide (n, m) {
    if (n < 1 || m < 1) return 0;
    if (n === 1 || m === 1) return 1;
    if (n < m) divide(n, n);
    if (n === m) return 1 + divide(n, n - 1);
    return divide(n, m - 1) + divide(n - m, m);
}


/**
 * hanoi塔问题
 * @param n 圆盘个数
 * @param a 起始圆柱
 * @param b 终点圆柱
 * @param c 中转圆柱
 */
function hanoi (n, a, b, c) {
    if (n > 0) {
        hanoi(n - 1, a, c, b); //将n - 1个圆盘经b转移到c上
        //move(a,b);  //将一个圆盘从a转移到b
        hanoi(n - 1, c, b, a); //将n - 1个圆盘经a转移到b上
    }
}

/**
 * 递归实现二分查找
 * @param arr
 * @param x
 * @param low 初始为0
 * @param high 初始为数组长度-1
 */
function binarySearch (arr, x, low, high) {
    if (low > high) return -1;
    let middle = Math.floor((low + high) / 2);

    if (x === arr[middle]) return middle;

    if (x < arr[middle]) {
        return binarySearch(arr, x, low, middle - 1);
    } else {
        return binarySearch(arr, x, middle + 1, high);
    }
}

/**
 * 非递归实现二分查找
 * @param arr
 * @param x
 */
function binarySearch2 (arr, x) {
    let low = 0;
    let high = arr.length - 1;
    while ( low <= high) { //如果不加等号就查不到数组最后一个元素了。
        let middle = Math.floor((low + high) / 2);
        if (x === arr[middle]) return middle;
        x < arr[middle] ?
            high = middle - 1 :
            low = middle + 1;
    }
    return -1;
}


let testArr2 = [3, 1 ,2];

/**
 * 打印集合的全部子集
 * @param set 输出一个数组作为集合，假定其无重复元素
 */
function showSubset (set) {

    //根据arr生成等长的全0数组

    track([], 0);

    //实质上就是个2的n次方遍历
    function track(arr, t) {
        if (t >= set.length) {
            let tmp = [];
            for (let i = 0; i < set.length; i++) {
                if (arr[i]) tmp.push(set[i]);
            }
            console.log(tmp);
        } else {
            for (let i = 0; i <= 1; i++) {
                arr[t] = i;
                track(arr, t + 1);
            }
        }
    }
}

/**
 * 打印一个集合的全部排列
 * @param arr 假定为一个无重复元素的集合
 */
function showArray (arr) {

    track (arr, 0);

    function track (arr, t) {
        if (t >= arr.length) {
            console.log(arr);
        } else {
            for (let i = t; i < arr.length; i++) {
                swap(t, i);
                track(arr, t + 1);
                swap(t, i);
            }
        }
    }

    function swap (i, j) {
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}

/**
 * 回溯解决01背包问题
 */
function backpackProblem () {
    //样例输入
    let w = [2,2,3,4,5,5,6];
    let v = [3,4,3,4,5,8,7];
    let C = 16;

    let max = 0;
    let arr = [];

    backtrack(arr, 0);
    //输出最大值
    console.log(max);

    function backtrack (arr, t) {
        if (t >= w.length) {
            count(arr);
        } else {
            for (let i = 0; i < 2; i++) {
                arr[t] = i;
                if (ifLegal(t)) {
                    let str = [];
                    for (let i = 0 ; i < t; i++) {
                        str.push(arr[i]);
                    }
                    console.log(str);
                    backtrack(arr, t + 1);
                }
            }
        }
    }

    function count (arr) {
        let value = 0;
        for (let i = 0; i < arr.length; i++) {
            value += v[i] * arr[i];
        }
        if (value > max) max = value;
    }

    function ifLegal (t) {
        let weight = 0;
        for (let i = 0; i <= t; i++) {
            weight += w[i] * arr[i];
        }
        return weight <= C;
    }
}

/**
 * 动规方法求解01背包问题
 * @returns {Array}
 */
function backpackProblem2 () {
    //样例输入，最优结果为22
    let w = [2,2,3,4,5,5,6];
    let v = [3,4,3,4,5,8,7];
    let C = 16;

    let bagMatrix = [new Array(C).fill(0)];

    for (let s = 0; s < C; s++) {
        bagMatrix[s] = [0];
        for (let j = 0; j < v.length; j++) {
            if (s === 0) {
                bagMatrix[s][j] = 0;
                continue;
            }
            if (w[j] > s) { //单个物品重于背包的承重量
                bagMatrix[s][j] = bagMatrix[s][j - 1] || 0;
                continue;
            }
            bagMatrix[s][j] = Math.max((bagMatrix[s - w[j]][j - 1] || 0) + v[j], bagMatrix[s][j - 1]  || 0);
        }
    }
    return bagMatrix;
}

/**
 * 合并排序
 * @param a
 */
function mergeSort(a) {

    track(0, a.length - 1);
    return a;

    function track (left, right) {
        if (left < right) {
            let m = Math.floor((left + right) / 2);
            track(left, m);
            track(m + 1, right);
            merge(left, m, right);
        }
    }

    function merge (left, m, right) { //由递归过程可知，[left, m], [m+1, right]分别有序
        let b = []; //中间数组
        let i = left,
            j = m + 1,
            k = left;

        while ((i <= m) && (j <= right)) {
            a[i] <= a[j] ? b[k++] = a[i++] : b[k++] = a[j++]
        }
        if (i > m) { //收尾
            for (let q = j; q <= right; q++) b[k++] = a[q];
        } else {
            for (let q = i; q <= m; q++) b[k++] = a[q];
        }

        for (let q = left; q <= right; q++) { //复制回原数组段
            a[q] = b[q];
        }
    }
}

/**
 * 快排
 * @param a
 */
function quickSort (a) {

    return track (0, a.length - 1);

    function track (left, right) {
        let index;
        if (a.length > 1) {
            index = partition(left, right);
            if (left < index - 1) track(left, index - 1);
            if (index < right) track(index, right);
        }
        return a;
    }

    function partition (left, right) {
        // 最基本的快排选取第一个或最后一个元素作为基准。但当待排序列有序时会出现最坏情况
        // const pivot = a[left];
        // 在待排序列随机选取基准，在整个数组数字全相等时，仍然是最坏情况，时间复杂度是O(n^2）。
        const pivot = a[randomInt(left, right)];
        //TODO 三数取中
        let i = left;
        let j = right;

        //划分序列为两个子序列，一个序列全部小于pivot，一个全部大于pivot
        while (i <= j) {
            while (a[i] < pivot) i++;
            while (a[j] > pivot) j--;
            if (i > j) break;
            swap(i++, j--);
        }
        return i;
    }

    function swap (i, j) {
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}

/**
 * LCS求最长递增子序列
 * LCS机理： http://web.jobbole.com/93803/
 * @param a
 */
function maxSubIncreaseArrary (a) {
    let b = JSON.parse(JSON.stringify(a)); //数组深拷贝
    b.sort(); //排序

    //构造LCS， dp[i][j]表示数组a的前i个元素与数组b的前j个元素的最长公共子序列的长度
    let dp = [new Array(a.length + 1).fill(0)]; //第一行全为0
    for (let i = 1; i <= a.length; i++) {
        dp[i] = [0]; // 第一列全为0
        for (let j = 1; j <= a.length; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1]; //反证可知
            else dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
        }
    }

    console.log(printLCS(a.length, b.length));

    function printLCS(i, j){//遍历，画个二维表格出来便于理解
        if (i === 0 || j === 0) return '';
        if( a[i-1] === b[j-1] )
            return printLCS(i-1, j-1) + a[i-1];
        else
            return (dp[i][j-1] > dp[i-1] [j]) ?
                printLCS(i, j - 1) :
                printLCS(i - 1, j);
    }
}

/**
 * 动规求集合的最长单调递增子序列的长度，算法复杂度为O(nlogn)
 * @param a
 */
function maxSubIncreaseArrary2 (a) {
   let k = 1;
   let b = [];
   b[1] = a[0];
   for (let i = 0; i < a.length; i++)
       a[i] > b[k] ?
           b[++k] = a[i] :
           b[binarySearch(i, k)] = a[i];

   console.log('最长单调递增子序列的长度为：',k);

   function binarySearch(i, k) {
       if (a[i] <= b[1]) return 1;

       let h = k;

       for (let l = 1; l < h - 1;)
           b[k = Math.floor( (l + h) / 2 )] <= a[i] ?
               l = k :
               h = k;

       return h;
   }
}

/**
 * 随机生成一个min到max之间的整数
 * @param min
 * @param max
 * @returns {*}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

