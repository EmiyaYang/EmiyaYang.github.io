var vm = new Vue({
    el: '#main',
    data: {
        constMsg: '一次性的，永不改动',
        htmlMsg: '<input type="text" placeholder="html数据">',
        message: '你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。',
        isBtnDisabled: false,
        clickNum: 0,
        question: '',
        answer: '你不说点什么的话，我还真没法回答你。',
        reverseClassObject: {
            'text-danger': true
        },
        history: [],
        //Vue 不能检测对象属性的添加或删除。 但可以使用 Vue.set(object, key, value) 方法向嵌套对象添加响应式属性。
        //添加多个属性，用两个对象的属性创建一个新的对象，再进行赋值
        // this.profile = Object.assign({}, this.profile, {
        // age: 27,
        // favoriteColor: 'Vue Green'
        // })
        profile: {
            name: 'Emiya',
            gender: 'male',
            age: 22
        }
    },
    // 计算属性基于它的依赖进行缓存，只有它的依赖更新了，才会进行重新求值。
    computed: {
        reversedMsg: {
            get: function () {
                return this.message.split('').reverse().join('');
            },
            set: function (newValue) {
                this.message = newValue.split('').reverse().join('');
            }
        }
    },
    //使用 watch 选项允许我们执行异步操作 (访问一个 API)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。
    watch: {
        // 如果 `question` 发生改变，这个函数就会运行
        question: function (newQuestion, oldQuestion) {
            this.answer = '等你打完字啦';
            this.debouncedGetAnswer()
        }
    },
    methods: {
        alert: function (msg, e) {
            alert(msg)
        },
        openUrl: function (url) {
            window.open(url);
        },
        addClickNum: function () {
            this.clickNum++;
        },
        getAnswer: function () {
            if (this.question.indexOf('?') === -1) {
                this.answer = 'Questions usually contain a question mark. ;-)';
                return
            }
            this.answer = 'Thinking...';
            var vm = this;
            axios.get('https://yesno.wtf/api')
                .then(function (response) {
                    vm.answer = _.capitalize(response.data.answer);
                    //push pop shift reverse sort splice等方法经过vue变异，均会触发视图更新
                    // 但以下操作并不会触发视图更新
                    // 当你利用索引直接设置一个项时，例如：vm.history[indexOfItem] = newValue
                    // 当你修改数组的长度时，例如：vm.history.length = newLength
                    // 解决方案： Vue.set(vm.items, indexOfItem, newValue)
                    // vm.items.splice(newLength)
                    vm.history.push({
                        q: vm.question,
                        a: vm.answer
                    });
                })
                .catch(function (error) {
                    vm.answer = 'Error! Could not reach the API. ' + error
                })
        }
    },
    //不要在此处使用箭头函数，否则this并非指向Vue实例
    created: function () {
        // Vue实例创建后，数据对象data初始化了，el还没
        console.assert(this.el);
        // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
        // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
        // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
        // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
        // 请参考：https://lodash.com/docs#debounce
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
    }
});

//Vue实例的一些成员可以通过添加$进行访问
console.log(vm.$el === document.getElementById('#main'));