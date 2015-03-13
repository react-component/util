var rcUtil=require('../');
function f1(){
  console.log(1);
}
function f2(){
  console.log(2);
}
function f3(){
  console.log(3);
}
rcUtil.createChainedFunction(f1,f2,f3)();
