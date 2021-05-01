import React from "react";
import ReactDOM from 'react-dom';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from "prop-types";
import './goalRingStyles.scss';

const GoalRing = ({ currentFunding }) => {
  const currentFundingDecimal = currentFunding / 100; // funding to decimal value.
  const currentTier = React.useRef('Bronze'); // current tier.
  const [isGoalComplete, setIsGoalComplete] = React.useState(false); // boolean to check if the goal is reached.
  const gradientId = "contest-prize";
  const [barColor, setBarColor] = React.useState({
    start: '#40E0D0', end: '#CD7F32',
  });

  const tiers = {
    Bronze: { min: 0.00, max: 200.00 },
    Silver: { min: 201.00, max: 350.00 },
    Gold: { min: 351.00, max: 500 },
  }

  // iterates through the keys to select a tier.
  const getTier = () => Object.keys(tiers).find(key => currentFundingDecimal >= tiers[key].min && currentFundingDecimal <= tiers[key].max)

  React.useEffect(() => {
    if (currentFunding) {
      currentTier.current = getTier();

      // verify and update the gradient colors
      if (currentTier.current === 'Silver') {
        setBarColor({ start: '#CD7F32', end: '#C0C0C0'})
      } else if (currentTier.current === 'Gold') {
        setBarColor({ start: '#C0C0C0', end: '#D4AF37'})
      }
      
      // check if the goal has been completed.
      if (currentFunding / 100 === tiers[currentTier.current].max) {
        setIsGoalComplete(true);
      } else {
        setIsGoalComplete(false);
      }
    }
    return () => { }
  }, [currentFunding]);

  function calculateSepDegrees() {
    return ((currentFunding / tiers[currentTier.current].max) * 270) / 75
  }

  function calculateGradientDegrees() {
    const percentage = (currentFunding / tiers[currentTier.current].max);
    const rotation = (percentage * 180) / 100; 
    const offset = percentage <= 50 ? '100%' : '50%';
    return { rotation, offset }
  }

  return (
    <div className="ring-wrapper">
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={gradientId} gradientTransform={`rotate(${calculateGradientDegrees().rotation})`}>
            <stop offset="0%" stopColor={barColor.start} />
            <stop offset={calculateGradientDegrees().offset} stopColor={barColor.end} />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgressbarWithChildren
        value={currentFunding / tiers[currentTier.current].max}
        // text={Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentFundingDecimal)}
        strokeWidth={20}
        secondaryColor='transparent'
        fill='transparent'
        styles={{
          path: {
            stroke: `url(#${gradientId})`,
            width: '100%',
            strokeLinecap: 'butt',
            transform: 'rotate(0.5turn)',
            transformOrigin: 'center center',
            boxShadow: '4px 0 rgba(0, 0, 0, 0.25)'
          },
          background: {
            fill: '#000',
          },
          root: { filter: 'drop-shadow(0.5px 1px 2px rgba(0, 0, 0, 0.25))', },
          trail: {
            stroke: '#fafafa',
            strokeLinecap: 'butt',
          },
          text: {
            fill: 'rgba(0, 0, 0, 0.54)',
            fontSize: '10px',
          }
        }}
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
      {!isGoalComplete && <span class="top-banner">{`${currentTier.current} Goal`}</span>}
      <span style={isGoalComplete ? { color: '#38B7AA', marginTop: '20px'} : { color: 'black' }} class="goal-number">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tiers[currentTier.current].max)}</span>
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