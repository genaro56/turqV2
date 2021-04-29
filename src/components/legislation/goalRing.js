import React from "react"
import { CircularProgressbar, CircularProgressbarWithChildren, RadialSeparators, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from "prop-types";
import './goalRingStyles.scss';

const GoalRing = ({ currentFunding }) => {
  const currentFundingDecimal = currentFunding / 100;
  const currentTier = React.useRef('Bronze');
  const [barColor, setBarColor] = React.useState('rgba(205, 127, 50, .7)');

  // const barColor = React.useRef('rgba');

  const tiers = {
    Bronze: { min: 0.00, max: 200.00 },
    Silver: { min: 251.00, max: 350.00 },
    Gold: { min: 351.00, max: 500.00 },
  }

  const getTier = () => Object.keys(tiers).find(key => currentFundingDecimal >= tiers[key].min && currentFundingDecimal <= tiers[key].max)

  React.useEffect(() => {
    if (currentFunding) {
      console.log('Tier', getTier());
      currentTier.current = getTier();


      if (currentTier.current === 'Silver') {
        setBarColor('rgba(192,192,192, .7)')
      } else if (currentTier.current === 'Gold') {
        setBarColor('rgba(255,215,0, .7)')
      }
    }
    return () => { }
  }, [currentFunding]);

  function calculateSepDegrees() {
    return ((currentFunding / tiers[currentTier.current].max) * 270) / 75
  }

  return (
    <div className="circle-wrapper">
      <CircularProgressbarWithChildren
        value={currentFunding / tiers[currentTier.current].max}
        // text={Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentFundingDecimal)}
        strokeWidth={14}
        styles={buildStyles({
          // Rotation of path and trail, in number of turns (0-1)
          rotation: 0.5,

          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: 'butt',

          // Text size
          textSize: '10px',

          // How long animation takes to go from one percentage to another, in seconds
          pathTransitionDuration: 0.5,

          // Can specify path transition in more detail, or remove it entirely
          // pathTransition: 'none',

          // Colors
          pathColor: barColor,
          textColor: 'rgba(0, 0, 0, 0.54)',
          trailColor: '#fafafa',
          backgroundColor: '#000',
        })}
      >
        <div
          className="separator"
          style={{
            transform: `rotate(${calculateSepDegrees()}deg)`
          }}
        >
          <div className="bar" />
        </div>
        <div className="marker" />
      </CircularProgressbarWithChildren>
      <label class="banner">{`${currentTier.current} Goal`}</label>
      <label class="goal-number">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tiers[currentTier.current].max)}</label>
    </div>
  )
}

export default GoalRing

GoalRing.propTypes = {
  currentFunding: PropTypes.number
}

GoalRing.defaultProps = {
  currentFunding: 0
}