(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{277:function(t,e,o){var content=o(291);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(16).default)("43c73608",content,!0,{sourceMap:!1})},290:function(t,e,o){"use strict";o(277)},291:function(t,e,o){var r=o(15)(!1);r.push([t.i,".tategaki-wrapper{align-items:center}.tategaki,.tategaki-wrapper{display:flex;flex-flow:column}.tategaki{-ms-writing-mode:tb-rl;writing-mode:vertical-rl;height:50%;letter-spacing:.3em}.trimmed-wrapper span{padding:.3em}.trimmed-wrapper span:first-child{z-index:1;text-align:center;border-radius:50%;letter-spacing:0}.trimmed-wrapper span:nth-child(2){z-index:2;margin-top:-.9em;margin-bottom:-1.2em}.trimmed-wrapper span:nth-child(3){z-index:1;text-align:center;border-radius:50%;letter-spacing:0}.wrapper-content{border-radius:4px;background:#fff}#sokutore_button{border:.5px solid #3362a8;color:#3362a8;border-radius:8px}.is-size-6-sokutore,.is-size-7-sokutore,.is-size-8-sokutore{font-size:.5em;line-height:6em}",""]),t.exports=r},303:function(t,e,o){"use strict";o.r(e);var r=o(11),n=(o(60),o(189),o(101),o(45),o(72),{layout:"defaultContent",data:function(){return{bookTitle:"",body:"",trimmed:[],firstLetter:[],lastLetter:[],highlightStyle:[],intervalId:void 0,length:"",page:"",fontsize:"",speed:50}},mounted:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var o,r,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t.speed=t.$store.state.data.sokutoreSpeed,"small"===t.$store.state.data.fontsize?t.fontsize="is-size-8-sokutore":"medium"===t.$store.state.data.fontsize?t.fontsize="is-size-7-sokutore":t.fontsize="is-size-6-sokutore",o=t.$store.state.data.bookList.concat(t.$store.state.data.userBookList),r=t.$store.state.data.bookContent.concat(t.$store.state.data.userBookContent),t.bookTitle=o[t.$store.state.data.bookIndex],t.body=r[t.$store.state.data.bookIndex],t.$nuxt.$emit("updateRef","sokutore-top"),t.$nuxt.$emit("updateTitle",t.bookTitle),i=0;i<t.body.length/40;i++)i===Math.floor(t.body.length/40)?(t.firstLetter.push(t.body.charAt(40*i)),t.trimmed.push(t.body.slice(40*i+1,t.body.length-1)),t.lastLetter.push(t.body.charAt(t.body.length-1))):(t.firstLetter.push(t.body.charAt(40*i)),t.trimmed.push(t.body.slice(40*i+1,40*(i+1)-1)),t.lastLetter.push(t.body.charAt(40*(i+1)-1)));t.page=t.$store.state.data.bookPages[t.$store.state.data.bookIndex][1],t.length=Math.ceil(t.trimmed.length/3),t.highlight();case 12:case"end":return e.stop()}}),e)})))()},destroyed:function(){clearInterval(this.intervalId)},methods:{nextPage:function(){this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1]/3<this.length-1&&(this.$store.commit("data/changePage",1),this.page=this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1],this.highlight())},goTopPage:function(){clearInterval(this.intervalId),this.isPlay=!1,this.$store.commit("data/goTopPage",1),this.page=this.$store.state.data.bookPages[this.$store.state.data.bookIndex][1],this.highlight()},highlight:function(){var t=this,e=0,o=0;this.highlightStyle=[],clearInterval(this.intervalId);for(var i=0;i<3&&void 0!==this.firstLetter[this.page+i];i++)o+=2;for(var r=0;r<o;r++)this.highlightStyle.push({background:"none"});this.highlightStyle[0].background="yellow",this.intervalId=setInterval((function(){if(e<o-1){for(var r=0;r<o;r++)t.highlightStyle[r].background=r===e+1?"yellow":"none";e++}}),-100*this.speed+10100)}}}),l=(o(290),o(4)),component=Object(l.a)(n,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"columns is-mobile is-centered",staticStyle:{width:"100%",height:"80%",margin:"0"}},[o("div",{staticClass:"column is-4-tablet is-11-mobile"},[o("div",{staticClass:"columns is-mobile is-multiline is-centered is-vcentered"},[o("div",{staticClass:"column is-12 wrapper-content mb-5 tategaki-wrapper"},[o("div",{staticClass:"tategaki pt-3 pb-1",class:t.fontsize},t._l(3,(function(i){return o("div",{key:i,staticClass:"trimmed-wrapper"},[o("span",{style:t.highlightStyle[2*(i-1)]},[t._v(t._s(t.firstLetter[t.page+(i-1)]))]),t._v(" "),o("span",[t._v(t._s(t.trimmed[t.page+(i-1)]))]),t._v(" "),o("span",{style:t.highlightStyle[2*(i-1)+1]},[t._v(t._s(t.lastLetter[t.page+(i-1)]))])])})),0),t._v(" "),o("div",{staticClass:"is-size-7 has-text-centered"},[t._v(t._s(t.page/3+1+"/"+t.length))])]),t._v(" "),o("div",{staticClass:"column is-12 wrapper-content"},[o("div",{staticClass:"columns is-mobile is-vcentered"},[o("div",{staticClass:"column is-6 has-text-left"},[o("span",{staticClass:"p-2 is-size-7",attrs:{id:"sokutore_button"},on:{click:t.nextPage}},[t._v("< 次へ")])]),t._v(" "),o("div",{staticClass:"column is-6 has-text-right"},[o("span",{staticClass:"p-2 is-size-7",attrs:{id:"sokutore_button"},on:{click:t.goTopPage}},[t._v("最初に戻る >|")])])])])])])])}),[],!1,null,null,null);e.default=component.exports}}]);