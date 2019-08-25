import React from 'react'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import styles from '../scss/imagesSlider.module.scss'
import { classNames } from './functions'

export default class Slider extends React.Component {

  state = {
    index: 0,
    images: [styles.frog, styles.eagle],
    translateValue: 0
  }

  goToPrevSlide = e => {
    if(e) {
      clearInterval(this.timer)
      this.timer = setInterval(this.goToNextSlide, 4500)
    }
    if (this.state.index === 0)
      return this.setState(prevState => ({
        index: prevState.images.length - 1,
        translateValue: -(this.slideWidth() * (prevState.images.length - 1))
      }))
    this.setState(prevState => ({
      index: prevState.index - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }))
  }

  goToNextSlide = e => {
    if(e) {
      clearInterval(this.timer)
      this.timer = setInterval(this.goToNextSlide, 4500)
    }
    if (this.state.index === this.state.images.length - 1)
      return this.setState({
        index: 0,
        translateValue: 0
      })

    this.setState(prevState => ({
      index: prevState.index + 1,
      translateValue: prevState.translateValue - this.slideWidth()
    }))
  }

  slideWidth = () => document.querySelector(`.${styles.slide}`).clientWidth

  componentDidMount() {
    this.timer = setInterval(this.goToNextSlide, 4500)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <div className={styles.slider}>
        <div className={styles['slider-wrapper']} style={{ transform: `translate(${this.state.translateValue}px)` }}>
          {this.state.images.map((image, index) => <Slide key={index} image={image}/>)}
        </div>
        <LeftArrow goToPrevSlide={this.goToPrevSlide}/>
        <RightArrow goToNextSlide={this.goToNextSlide}/>
      </div>
    )
  }
}

const Slide = ({ image }) => <div className={[styles.slide, image].join(' ')}/>

const RightArrow = props =>
  <div className={classNames([styles.arrow, styles['next-arrow']])} onClick={props.goToNextSlide}>
    <ArrowForwardIos aria-hidden={true}/>
  </div>

const LeftArrow = props =>
  <div className={classNames([styles.arrow, styles['back-arrow']])} onClick={props.goToPrevSlide}>
    <ArrowBackIos aria-hidden={true}/>
  </div>
