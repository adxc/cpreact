const test = () => {
    let value = 3
    console.log(`1231312${value}123123`)
}
test()
async function test2 (){
    await new Promise((resolve,reject) => {
        console.log('abc')
        resolve()
    })
}
test2()