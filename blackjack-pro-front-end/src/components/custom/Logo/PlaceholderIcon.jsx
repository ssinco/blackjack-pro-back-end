import clsx from 'clsx';
import { useLocation } from 'react-router-dom'

function PlacholderIcon(props) {
  /*--------------- States/Hooks ---------------*/

  /*--------------- Return ---------------*/
  return (
    
      <img
        src="/assets/icons/placeholder_logo.png"
        alt="company-logo"
        className={clsx(location.pathname === '/' ? 'w-48' : 'w-24')}
      />
    
  );
}

export default PlacholderIcon;
