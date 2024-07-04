let keyConfig = null;

// eslint-disable-next-line eqeqeq
if ('production' == process.env.NODE_ENV) {
  keyConfig = {
    rapidApi: '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
    mapKey: 'AIzaSyDrLKkpH8Hie1IooAbKo5n2v6Kz2V7xz-g',
  };
}
else {
  keyConfig = {
    rapidApi: '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
    // mapKey: 'AIzaSyDrLKkpH8Hie1IooAbKo5n2v6Kz2V7xz-g',
    mapKey: 'AIzaSyD-DxFifu1PRSbJZzPYZQVFChrsTEMwN74'
  };
}


export default keyConfig;
