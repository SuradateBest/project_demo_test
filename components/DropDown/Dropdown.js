import React ,{useContext, useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useUser } from '../../auth/useUser';
import { app } from '../../firebase';
import { AuthContext } from '../auth/Auth';


function Dropdown() {
    const { logout } = useUser();
    const history = useHistory();
    const [userId, setId] = useState();
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;

    ///////////////////////////////////////////////////////////////////////////
    useEffect(() => {
    const docRef = app.firestore().collection("Users").doc(currentUserId)
    docRef.get().then((doc) => {
        if (doc.exists) {
            var Id = doc.id;
            setId(Id.toString());
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}, );
    /////////////////////////////////////////////////////////////////////////////

    const swapPage = (id) => {
        
        history.push(`/profile/${id}`);
     //   window.location.reload(false);
    }

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <>
            <ul onClick={handleClick} className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}>
                <li >
                    <label className="dropdown-link cursor-allowed"
                        onClick={() => {setClick(false);swapPage(userId)}}>
                        profile
                    </label>

                </li>
                <li>
                    <Link className="dropdown-link" to="/"
                        onClick={() => { setClick(false); logout(); }}
                    >
                        log out
                    </Link>

                </li>
            </ul>

        
        
        </>
    );
}
export default Dropdown;