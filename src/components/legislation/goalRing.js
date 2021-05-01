import React from "react";
import ReactDOM from 'react-dom';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PropTypes from "prop-types";
import './goalRingStyles.scss';

const GoalRing = ({ currentFunding }) => {
  const currentFundingDecimal = currentFunding / 100;
  const currentTier = React.useRef('Bronze');
  const gradientId = "contest-prize";
  const [barColor, setBarColor] = React.useState({
    start: '#40E0D0', end: '#CD7F32',
  });

  const tiers = {
    Bronze: { min: 0.00, max: 200.00 },
    Silver: { min: 201.00, max: 350.00 },
    Gold: { min: 351.00, max: 500 },
  }

  const getTier = () => Object.keys(tiers).find(key => currentFundingDecimal >= tiers[key].min && currentFundingDecimal <= tiers[key].max)

  React.useEffect(() => {
    if (currentFunding) {
      currentTier.current = getTier();

      if (currentTier.current === 'Silver') {
        setBarColor({ start: '#CD7F32', end: '#C0C0C0'})
      } else if (currentTier.current === 'Gold') {
        setBarColor({ start: '#C0C0C0', end: '#D4AF37'})
      }
    }
    return () => { }
  }, [currentFunding]);

  function calculateSepDegrees() {
    return ((currentFunding / tiers[currentTier.current].max) * 270) / 75
  }

  return (
    <div className="ring-wrapper">
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={gradientId} gradientTransform="rotate(120)">
            <stop offset="0%" stopColor={barColor.start} />
            <stop offset="50%" stopColor={barColor.end} />
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
      <span class="banner">{`${currentTier.current} Goal`}</span>
      <span class="goal-number">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tiers[currentTier.current].max)}</span>
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