require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import classNames from 'classnames';
import  { findDOMNode } from 'react-dom';

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

// 图片组件
class ImgFigure extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  // imgFigure点击处理函数
  handleClick (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center()
    }
    e.stopPropagation()
    e.preventDefault()
  }

  render () {

    let styleObj = {};

    // 如果props属性制定了这张图片的位置则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并且不为0 添加旋转角度
    if (this.props.arrange.rotate) {
      ['MozTransform', 'MsTransform', 'WebkitTransform', 'transform'].forEach((value) => {
        styleObj[value] = `rotate(${this.props.arrange.rotate}deg)`
      })
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11
    }

    let figureClass = classNames({
      'img-figure': true,
      'is-inverse': this.props.arrange.isInverse // 反转样式
    });

    return (
      <figure className={figureClass} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.description}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

// 控制组件
class ControllerUnits extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  // 点击控制组件按钮
  handleClick (e) {
    console.log(this.props)
    // 点击的是当前正在选中态的按钮 则翻转图片 否则将对应图片居中
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center()
    }

    e.preventDefault();
    e.stopPropagation();
  }

  render () {
    let controllerUnitClassName = 'controller-unit'

    // 如果对应的是居中的图片 显示控制按钮的居中态
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center'
    
      // 如果同时对应的是翻转图片 显示翻转态
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse'
      }
    }
    

    return (
      <span className={controllerUnitClassName}  onClick={this.handleClick}></span>
    )
  }
}

class AppComponent extends React.Component {
  constructor (props) {
    super(props);

    this.Constant = {
      // 中心图片位置
      centerPos: {
        left: 0,
        right: 0
      },

      // 水平方向的取值范围
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },

      // 垂直方向的取值范围
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0, // 旋转角度
          isInverse: false, // 图片正反面 false正面 true反面
          isCenter: false // 图片是否居中
        }*/
      ]
    }
  }

  //  利用rearrange函数 居中对应index的图片
  center (index) {
    this.rearrange(index);
  }

  // 翻转图片
  inverse (index) {
    let { imgsArrangeArr } = this.state;
    imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
    this.setState({
        imgsArrangeArr
    })
  }

  // 获取区间内的一个随机值
  getRangeRandom (low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  // 获取0-30°之间的任意正负值
  get30DegRandom () {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
  }

  // 布局所有图片 centerIndex 指定居中排布哪个图片
  rearrange (centerIndex) {
    let {imgsArrangeArr} = this.state,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中centerIndex的图片
    // 居中的centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    });

    // 布局左右两侧的图片
    for (let i = 0, k = imgsArrangeArr.length / 2; i < imgsArrangeArr.length; i++) {
      let hPosRangeLORX = null;
      
      // 前半部分布局左边 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr
    })
  }

  // 组件加载后为每张图片计算其位置范围
  componentDidMount () {
    
    // 首先拿到舞台的大小
    let stageDom = findDOMNode(this.refs['stage']),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imgFigure的大小
    let imgFigureDom = findDOMNode(this.refs['imgFigure0']),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左右部分排布取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    
    // 计算上半部分排布取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render () {
    let controllerUnits = [], imgFigures = []

    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure ref={'imgFigure' + index} data={value} key={index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse.bind(this, index)}
        center={this.center.bind(this, index)} />)

      controllerUnits.push(<ControllerUnits key={index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse.bind(this, index)}
        center={this.center.bind(this, index)} />)
    })

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
