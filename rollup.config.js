import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve'

export default {
// 核心选项
input:"./src/main.js",   // 必须
output: {  // 必须 (如果要输出多个，可以是一个数组)
// 核心选项
    file:"./dist/bundle.js",    // 必须
    format:"umd",  // 必须
    name:'Creact'
},
watch:{
    include:'./src/**',
    exclude: 'node_modules/**'
},
plugins:[
    resolve(),
    babel({
      exclude: 'node_modules/**' 
    }),
    serve({
        open:true,
        openPage:'/index.html',
        host: 'localhost',
        port: 1220,
        // Folder to serve files from
        contentBase: '',
    })
]
}