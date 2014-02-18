var Driver = require('./index');

var d = new Driver({port : '/dev/tty.usbserial-A601EM9Z'});


d.open(function(err){
  if(err)
    return console.log('failed to open port');
    
  console.log('opened');

//  d.scanNetwork(function(err,nodes){
//    console.log(nodes);
//  });

});

d.on('packet',function(packet){
  console.log(packet)
});

