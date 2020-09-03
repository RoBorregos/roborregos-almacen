import './Footer.css';

import { Col, Container, Row } from 'react-bootstrap';
import { MEDIUM_WIDTH, MOBILE_WIDTH } from 'constants.js';
import React, { Component } from 'react';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';
import IconButton from '@material-ui/core/IconButton';
import WhatsappIcon from '@material-ui/icons/WhatsApp';
import logo from 'images/white_logo.png';

function sitemapLink(link, legend, big) {
  if(big){
    return (
      <span>
        <a href={ link } className='sitemap-link'>
          { legend }
        </a>
        <br />
      </span>
    );
  } else {
    return (
      <a href={ link } className='sitemap-link'>
        { legend }
      </a>
    );
  }
}

function sitemapIconButton(link, icon) {
  return (
    <a
      href={ link }
      className='icon-link'
    >
      { icon }
    </a>
  );
}

class Footer extends Component {
  constructor(props) {
    super(props);

    this.setSizeAtributes = this.setSizeAtributes.bind(this);
    this.largeView        = this.largeView.bind(this);
    this.smallView        = this.smallView.bind(this);
    this.goUp             = this.goUp.bind(this);

    this.members = props.members;

    this.state = {
      icon_size: (window.innerWidth >= MOBILE_WIDTH) ? 40 : 35,
      view_size_large: (window.innerWidth > MEDIUM_WIDTH) ? true : false,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.setSizeAtributes);
  }

  goUp() {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }

  setSizeAtributes(){
    this.setState({
      icon_size : (window.innerWidth >= MOBILE_WIDTH) ? 45 : 35,
      view_size_large: (window.innerWidth > MEDIUM_WIDTH) ? true : false,
    });
  }

  largeView() {
    return(
      <div className='footer-container'>
        <Row className='footer-row'>
          <Col lg='4' className='col-logo'>
            <img className='footer-logo' src={ logo } alt='logo' />
          </Col>
          <Col lg={{ span: 5, offset: 3 }}>
            <Row className= 'row-justify-right'>
              <div className='goback-button'>
                <IconButton
                  component='a'
                  onClick={ this.goUp }
                  color='inherit'
                  className='sitemap-link'
                >
                  <ExpandLessIcon style={{color: "#f083ab", width: 42, height: 42}} />
                  <div className='goback-text'>
                    Back to top
                  </div>
                </IconButton>
              </div>
            </Row>
            <Row className= 'row-justify-right'>
              <div className='row-socialMedia'>
                { sitemapIconButton('https://www.instagram.com/roborregos/', <WhatsappIcon style={{ fontSize: this.state.icon_size, color: "#4c6ef5" }} />) }
                { sitemapIconButton('https://www.facebook.com/RoBorregos/', <FacebookIcon style={{ fontSize: this.state.icon_size, color: "#4eb39b" }} />) }
                { sitemapIconButton('https://github.com/RoBorregos/', <GitHubIcon style={{ fontSize: this.state.icon_size - 5, color: "#4f72b8" }} />) }
                <div className='mark-text'>
                  <a className='roborregos-link' href = 'http://roborregos.com'>RoBorregos 2020</a>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  smallView() {
    return(
      <Container fluid className='footer-container'>
        <Row noGutters className='footer-row'>
          <Col xs={ 8 } className='col-logo'>
            <img src={ logo } className='footer-logo' alt='logo' />
          </Col>
          <Col xs={ 4 }>
            <Row noGutters className='goback-container'>
              <div className='goback-button'>
                <IconButton
                  component='a'
                  onClick={ this.goUp }
                  color='inherit'
                  className='sitemap-link'
                >
                  <ExpandLessIcon style={{color: "#f083ab"}}/>
                  <div className='goback-text'>
                    Back to top
                  </div>
                </IconButton>
              </div>
            </Row>
            <Row noGutters className='sitemap-container'>
              <div className='mark-text'>
                  <a className='roborregos-link' href = 'http://roborregos.com'>RoBorregos 2020</a>
              </div>
            </Row>
            <Row className='row-socialMedia'>
              { sitemapIconButton('https://www.instagram.com/roborregos/', <WhatsappIcon style={{ fontSize: this.state.icon_size, color: "#4c6ef5" }} />) }
              { sitemapIconButton('https://www.facebook.com/RoBorregos/', <FacebookIcon style={{ fontSize: this.state.icon_size, color: "#4eb39b" }} />) }
              { sitemapIconButton('https://github.com/RoBorregos/', <GitHubIcon style={{ fontSize: this.state.icon_size - 5, color: "#4f72b8" }} />) }
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  render() {
    return (this.state.view_size_large) ? this.largeView() : this.smallView();
  }
}

export default Footer;
