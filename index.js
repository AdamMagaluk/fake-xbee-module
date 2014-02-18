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
    deviceId : 'Node 1'
  },
  {
    remote16 : 0x1235,
    deviceId : 'Node 2'
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
    setTimeout(self._emitFakeAssoc.bind(self,0),500);
    setTimeout(self._emitFakeAssoc.bind(self,1),2500);
  });
};

function checkNode(address){
  for(var i=0;i<fakeNodes.length;i++)
    if(fakeNodes[i].remote16 === address)
      return true;
  return false;
}

Driver.prototype.write = function(address,packet,callback){
  if(!checkNode(address))
    setTimeout(callback.bind(null,new Error('No Acknowledgement')),40);
  else
    setTimeout(callback.bind(null,null,{}),10);
};




