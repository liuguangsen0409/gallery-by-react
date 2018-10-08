require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关数据
let imageDatas = require('../data/imageData.json');

// 利用自执行函数将图片名信息转成url路径信息
imageDatas = (function genImageURL (imageDataArr) {
  for (let i = 0; i < imageDataArr.length; i++) {
    let singleImgData = imageDataArr[i]

    singleImgData.imageURL = require('../images/' + singleImgData.fileName)

    imageDataArr[i] = singleImgData
  }
  return imageDataArr
})(imageDatas)

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
