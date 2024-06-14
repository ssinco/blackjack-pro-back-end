import { Link } from 'react-router-dom';
import { AuthedUserContext } from '../../App';
import { useContext } from 'react';
import styles from "./NavBar.module.css";

const NavBar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext);

  return (
    <div className={styles.navContainer}>
      <nav>
        <div className={styles.navLeft}>
          <p>LOGO</p>
        </div>
        

        {user ? (
          <div className={styles.navRight}>
            <div className={styles.userInfo}>
              <img src={user.profilePhotoUrl} />
              <h4>{user.username}</h4>
            </div>
            <ul>

              <li><Link to="/game/count-single">Single Card</Link></li>
              <li><Link to="/game/count-snapshot">Snapshot</Link></li>
              <li><Link to='/game/blackjack'>Full Game</Link></li>
              <li><Link to='' onClick={handleSignout}>Sign Out</Link></li>
            </ul>
          </div>
        ) : (
          <ul>
            <li>No links atm</li>
            <li>No links atm</li>
          </ul>
        )}
      </nav>
    </div>
  );
};
export default NavBar;
