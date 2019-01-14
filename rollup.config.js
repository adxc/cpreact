import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
// 核心选项
input:"./src/main.js",   // 必须
output: {  // 必须 (如果要输出多个，可以是一个数组)
// 核心选项
    file:"./dist/bundle.js",    // 必须
    format:"umd",  // 必须
    name:'Creact'
},
plugins:[
    resolve(),
    babel({
      exclude: 'node_modules/**' 
    })
]
}