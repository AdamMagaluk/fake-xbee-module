var EventEmitter = require('events').EventEmitter
  , util = require('util')
  , extend = require('extend')
  , SerialPort = require('serialport').SerialPort;

module.exports = Driver;
function Driver(opts){

  EventEmitter.call(this);

  this.opts = {
    port : null,
    baud : 115200
  };

  this.ready = false;

  extend(this.opts,opts);
}

util.inherits(Driver, EventEmitter);

var fakeNodes = [
  {
    remote16 : 0x1234,
    deviceId : 'Light 1',
    services : ['light']
  },
  {
    remote16 : 0x1224,
    deviceId : 'Light 2',
    services : ['light']
  },
  {
    remote16 : 0x1235,
    deviceId : 'Switch 1',
    services : ['switch']
  }
];

Driver.prototype._emitFakeAssoc = function(idx){
  var data = { type : 0x3 };
  extend(data,fakeNodes[idx]);
  this.emit('packet',data);
};

Driver.prototype.scanNetwork = function(callback){
  if(!this.ready)
    return callback(new Error('Device not ready'));

  setTimeout(function(){
    callback(null,fakeNodes);
  },800);
};

Driver.prototype.open = function(callback){
  var self = this;
  this.serialport = new SerialPort(this.opts.port,this.opts,false);
  this.serialport.open(function(err){
    if(!err)
      self.ready = true;

    callback(err);

    for(var i=0;i<fakeNodes.length;i++){
      setTimeout(self._emitFakeAssoc.bind(self,i),500*(i+1) );
    }
  });
};

function checkNode(address){
  for(var i=0;i<fakeNodes.length;i++)
    if(fakeNodes[i].remote16 === address)
      return true;
  return false;
}

Driver.prototype.write = function(address,packet,callback){
  console.log('Xbee Driver: Write ('+address+') - ' + JSON.stringify(packet));
  if(!checkNode(address))
    setTimeout(callback.bind(null,new Error('No Acknowledgement')),40);
  else
    setTimeout(callback.bind(null,null,{}),10);
};




