import React, { Component } from "react";
import styled from "styled-components";
import { Motion, TransitionMotion, spring } from "react-motion";

const RowWrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
  margin-top: 4%;
  height: 10vh;
  background: #dfdfdf;
  border-radius: 4px;
`;

const ButtonWrapper = styled.button`
  padding: 0.5% 1%;
  border: 1px solid #1f9f9f;
  display: block;
  margin: 0 auto;
  background: #1f9f9f;
  color: #fff;
  border-radius: 2px;
  font-size: 1rem;
  text-transform: uppercase;
  box-shadow: 0 0 8px 4px #dfdfdf;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

const BoxWrapper = styled.div`
  height: 100%;
  width: 70px;
  background: #1f9f9f;
  border-radius: 4px;
`;

const LabelWrapper = styled.label`
  display: block;
  text-align: center;
`;

const SliderWrapper = styled.input`
  display: block;
  margin: 0 auto;
  margin-bottom: 2%;
  width: 50%;
`;

const StaggerWrapper = styled.div`
  width: 95%;
  margin: 4% auto;
  border: 4px solid #dfdfdf;
  border-radius: 4px;
  height: 80vh;
  position: relative;
`;

const RippleWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  border: 1px solid #1f9f9f;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggled: false,
      configToggle: {
        stiffness: 127,
        damping: 17
      },
      configRipple: {
        stiffness: 60,
        damping: 15
      },
      mouse: [],
      now: `t0`
    };
  }
  handleToggle = () => {
    this.setState({ toggled: !this.state.toggled });
  };
  handleSlider = e => {
    let { stiffness, damping } = this.state.configToggle;
    let stiffnessRipple = this.state.configRipple.stiffness;
    let dampingRipple = this.state.configRipple.damping;

    if (e.target.id === "stiffness-toggle") {
      stiffness = e.target.value;
    } else if (e.target.id === "damping-toggle") {
      damping = e.target.value;
    } else if (e.target.id === "stiffness-ripple") {
      stiffnessRipple = e.target.value;
    } else {
      dampingRipple = e.target.value;
    }

    this.setState({
      configToggle: {
        stiffness,
        damping
      },
      configRipple: {
        stiffness: stiffnessRipple,
        damping: dampingRipple
      }
    });
  };
  handleMouseMove = ({ pageX, pageY }) => {
    this.setState(() => ({
      mouse: [pageX - 50, pageY - 600],
      now: `t${Date.now()}`
    }));
  };
  willLeave = styleCell => ({
    ...styleCell.style,
    opacity: spring(0, this.state.config),
    scale: spring(2, this.state.config)
  });
  render() {
    const {
      configToggle,
      configRipple,
      mouse: [mouseX, mouseY],
      now
    } = this.state;
    const styles =
      mouseX === null
        ? []
        : [
            {
              key: now,
              style: {
                opacity: spring(1),
                scale: spring(0),
                x: spring(mouseX),
                y: spring(mouseY)
              }
            }
          ];
    return (
      <div>
        <header>
          <h1 style={{ textAlign: "center" }}>React Motion Demo</h1>
        </header>
        <LabelWrapper htmlFor="stiffness-toggle">
          Stiffness: {configToggle.stiffness}
          <SliderWrapper
            onChange={this.handleSlider}
            id="stiffness-toggle"
            type="range"
            min="1"
            max="300"
            defaultValue="127"
          />
        </LabelWrapper>
        <LabelWrapper htmlFor="damping-toggle">
          Damping: {configToggle.damping}
          <SliderWrapper
            onChange={this.handleSlider}
            id="damping-toggle"
            type="range"
            min="1"
            defaultValue="17"
            max="100"
          />
        </LabelWrapper>
        <ButtonWrapper onClick={this.handleToggle}>Toggle</ButtonWrapper>
        <Motion style={{ x: spring(this.state.toggled ? 930 : 0, configToggle) }}>
          {({ x }) => (
            <RowWrapper>
              <BoxWrapper style={{ transform: `translate3d(${x}px, 0, 0)` }} />
            </RowWrapper>
          )}
        </Motion>
        <h2 style={{ textAlign: "center", marginTop: "3%" }}>Move your mouse to ripple</h2>
        <LabelWrapper htmlFor="stiffness-ripple">
          Stiffness: {configRipple.stiffness}
          <SliderWrapper
            onChange={this.handleSlider}
            id="stiffness-ripple"
            type="range"
            min="1"
            max="300"
            defaultValue="127"
          />
        </LabelWrapper>
        <LabelWrapper htmlFor="damping-ripple">
          Damping: {configRipple.damping}
          <SliderWrapper
            onChange={this.handleSlider}
            id="damping-ripple"
            type="range"
            min="1"
            defaultValue="17"
            max="100"
          />
        </LabelWrapper>
        <TransitionMotion willLeave={this.willLeave} styles={styles}>
          {circles => (
            <StaggerWrapper onMouseMove={this.handleMouseMove}>
              {circles.map(({ key, style: { opacity, scale, x, y } }) => (
                <RippleWrapper
                  key={key}
                  style={{ opacity, scale, transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` }}
                />
              ))}
            </StaggerWrapper>
          )}
        </TransitionMotion>
      </div>
    );
  }
}

export default App;
