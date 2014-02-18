var Driver = require('./index');

var d = new Driver({port : '/dev/tty.usbserial-A601EM9Z'});


d.open(function(err){
  if(err)
    return console.log('failed to open port');
    
  console.log('opened');

//  d.scanNetwork(function(err,nodes){
//    console.log(nodes);
//  });
  

  // Will fail becuase 0x1134 does not exist
  //d.write(0x1134,{},function(err){
  //  console.log('wrote')
  //  console.log(err);
  //})

  // Will not fail becuase 0x1234 exists in fake nodes
  //d.write(0x1134,{},function(err){
  //  console.log('wrote')
  //  console.log(err);
  //})

});

d.on('packet',function(packet){
  console.log(packet)
});

