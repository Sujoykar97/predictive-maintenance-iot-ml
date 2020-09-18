const {spawn} = require('child_process');

function pyRun(callback){
 const python = spawn('python', ['./../SVM/svm_algorithm.py']);
 var dataToSend;

 python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    console.log(data.toString())
   dataToSend =  data.toString();
   
   
   });
   python.stderr.on('data', (data) => {
    console.log(`error:${data}`);
 });
   
   python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    
    return callback(dataToSend)
    
    });
   
  }

  module.exports = {
    pyRun
  }