"use strict";var vm=new Vue({el:"#main",data:{constMsg:"一次性的，永不改动",htmlMsg:'<input type="text" placeholder="html数据">',message:"你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。",isBtnDisabled:!1,clickNum:0,question:"",answer:"你不说点什么的话，我还真没法回答你。",reverseClassObject:{"text-danger":!0},history:[],profile:{name:"Emiya",gender:"male",age:22}},computed:{reversedMsg:{get:function(){return this.message.split("").reverse().join("")},set:function(e){this.message=e.split("").reverse().join("")}}},watch:{question:function(e,t){this.answer="等你打完字啦",this.debouncedGetAnswer()}},methods:{alert:function(n){function e(e,t){return n.apply(this,arguments)}return e.toString=function(){return n.toString()},e}(function(e,t){alert(e)}),openUrl:function(e){window.open(e)},addClickNum:function(){this.clickNum++},getAnswer:function(){if(-1!==this.question.indexOf("?")){this.answer="Thinking...";var t=this;axios.get("https://yesno.wtf/api").then(function(e){t.answer=_.capitalize(e.data.answer),t.history.push({q:t.question,a:t.answer})}).catch(function(e){t.answer="Error! Could not reach the API. "+e})}else this.answer="Questions usually contain a question mark. ;-)"}},created:function(){console.assert(this.el),this.debouncedGetAnswer=_.debounce(this.getAnswer,500)}});console.log(vm.$el===document.getElementById("#main"));