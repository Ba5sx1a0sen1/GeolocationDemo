const display = document.querySelector('#display')
const getGeo = document.querySelector('#getGeo')
const getGeoT = document.querySelector('#getGeoT')

const getGeoAsync = function() {
  return new Promise((resolve, reject) => {
    const geo = navigator.geolocation
    geo.getCurrentPosition((position) => {
      resolve(position)
    }, (err) => {
      reject(err)
    }, {
      enableHighAccuracy: true,
    })
  })
}

const getLocation = function() {
  return new Promise(function(resolve, reject) {
    //初始化高德地图插件,注意 GetLocation可以不对应html中的控件,但必须有值
    var mapObj = new AMap.Map('GetLocation');
    //加载定位插件
    mapObj.plugin('AMap.Geolocation', function () {
        const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition(); // 也可采取callback方法 与以下的事件监听方法二选一
        AMap.event.addListener(geolocation, 'complete', (data) => {
          resolve(data)
        });//返回定位信息
        AMap.event.addListener(geolocation, 'error', (error) => {
          reject(error)
        }); //返回定位出错信息
    });
  })
}

getGeo.addEventListener('click', async () => {
  try {
    display.innerHTML = '获取地理位置中...请稍后...'
    const positon = await getGeoAsync()
    console.log(positon)
    const {latitude, longitude} = positon.coords
    display.innerHTML = `地理位置: 纬度:${latitude} 经度:${longitude}`
  } catch(e) {
    display.innerHTML = `获取地理位置失败、请重试\n${e.message}`
    console.error(e)
  }
})

getGeoT.addEventListener('click', async () => {
  try {
    display.innerHTML = '获取地理位置中...请稍后...'
    const data = await getLocation()
    console.log(data)
    const {position} = data
    const { lat, lng } = position
    display.innerHTML = `地理位置: 纬度:${lat} 经度:${lng}`
  } catch(e) {
    display.innerHTML = `获取地理位置失败、请重试\n${e}`
    console.error(e)
  }
})