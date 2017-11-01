const fs=require('fs');

//const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/politest', { useMongoClient: true });
//mongoose.Promise = global.Promise;


const Schemas = require('./schemas.js');

const userDB    = Schemas.user;
const serverDB  = Schemas.server;
const channelDB = Schemas.channel;

userDB.new = function(obj){
  let instance = new userDB;
  instance.id=obj.id;
  instance.tag=obj.tag;
  instance.name=obj.username;
  instance.save();
};

userDB.set = function(query,alter){
  if(['string','number'].includes(typeof query)){
    query = {'id':query.toString()};
  };
  if(!typeof alter) throw "Invalid Alter Object";
  return userDB.findOneAndUpdate(query,alter);
};




module.exports={



  getDirs : function getDirs(rootDir, cb) {
    fs.readdir(rootDir, function (err, files) {
        let dirs = [];
        for (let i = 0; i < files.length; ++i) {
            let file = files[i];
            if (file[0] !== '.') {
                let filePath = rootDir + '/' + file;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        dirs.push(this.file);
                    }
                    if (files.length === (this.index + 1)) {
                        return cb(dirs);
                    }
                }.bind({
                    index: i,
                    file: file
                }));
            }
        }
    })
 },










}
