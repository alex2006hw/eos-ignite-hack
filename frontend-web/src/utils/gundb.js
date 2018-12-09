import Gun from 'gun';
import 'gun/lib/path';
// import Cookies from './cookies';

const MY_OSS_TOKEN = require('uuid/v4')();

// console.log('0.eos initiated MY_OSS_TOKEN : ', MY_OSS_TOKEN);
// ---------------------------------------
Gun.log.squelch = true;
const gun = Gun({
  file: false,
  peers: 'https://alex.us-east.mybluemix.net/gun',
});

gun.on('out', { get: { '#': { '*': '' } } });

const localState = Gun();
const myState = localState.get(MY_OSS_TOKEN)
const myOSS = gun.get(MY_OSS_TOKEN)
const OSS = gun.get('oss')
const OSSchannels = gun.get('oss/channels')
const OSScontracts = gun.get('oss/contracts')
const OSSregister = gun.get('oss/register')


myOSS.path('oss').set(OSS)

myState.get('id').put(MY_OSS_TOKEN)
myState.get('tokens').set(myOSS)
myState.get('oss').set(OSS)

OSS.path(MY_OSS_TOKEN).set(myOSS)
OSS.path('tokens').set(myOSS)
OSS.path('channels').set(OSSchannels)
OSS.path('contracts').set(OSScontracts)
OSS.path('register').set(OSSregister)


export default {
  myState,
  myOSS,
  OSS
};
