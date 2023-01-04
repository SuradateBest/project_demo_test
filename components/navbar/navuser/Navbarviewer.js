import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom"
import 'firebase/firestore';
import { useUser } from "../../../auth/useUser";
import { app } from "../../../firebase";
import Dropdown from "../../DropDown/Dropdown";
import { AuthContext } from "../../auth/Auth";
import "../navuser/nav.css"
import DarkMode from "../../theme/DarkMode";

function NavbarViewer(props) {
    const { logout } = useUser();
    const [click, setClick] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [find, setFind] = useState();
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [filterTag, setFilterTag] = useState([]);
    const [tag, setTag] = useState([]);
    const [userId, setId] = useState();
    const [imageUser, setImage] = useState("");
    const [useName, setName] = useState("");
    const history = useHistory();
    const { currentUser } = useContext(AuthContext);

    const currentUserId = currentUser ? currentUser.uid : null;

    useEffect(() => {
        const fetchData = async () => {
            const data = await app.firestore().collection("Users").get();
            setContacts(data.docs.map((doc) => ({ ...doc.data(), key: doc.id })))
            const data1 = await app.firestore().collection("Image").get();
            setTag(data1.docs.map((doc) => ({ ...doc.data(), key: doc.id })))
        };
        fetchData();
    }, []);

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    useEffect(() => {
        var uniTag = []
        const t = tag.map(value => value.tag).map(tag => {
            if (tag.length > 1) {
                tag.map(hastag => {
                    uniTag.push(hastag)
                })
            } else {
                uniTag.push(tag[0])
            }

        })
        setFilterTag(uniTag.filter(onlyUnique).sort())
        const c = contacts.filter(
            (user) =>
                user.Name.toLowerCase().includes(search.toLowerCase())
        )
        const search1 = filterTag.filter(
            (hastag) =>
                hastag.toLowerCase().includes(search.toLowerCase())
        )
        setFind([])
        c.map(b => {
            setFind(find => [...find, b.Name])
        })
        search1.map(f => {
            setFind(find => [...find, f])
        })
        setFilteredContacts(c);
    }, [search, contacts]);

    ///////////////////////////////////////////////////////////////////////////// 

    const handleClick = () => setClick(!click);

    const closeMobileMenu = () => setClick(false);

    const onMouseEnter = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
        } else {
            setDropdown(true);
        }
    };

    const onMouseLeave = () => {
        if (window.innerWidth < 960) {
            setDropdown(false);
        } else {
            setDropdown(false);
        }
    };

    //////////////////////////////////////////////////////////////////////////////

    const docRef = app.firestore().collection("Users").doc(currentUserId)
    docRef.get().then((doc) => {
        if (doc.exists) {

            var Name = doc.data().Name;
            var Id = doc.id;
            var Imageuser = doc.data().ProfileImg;
            setImage(Imageuser.toString());
            setId(Id.toString());
            setName(Name.toString());

        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    /////////////////////////////////////////////////////////////////////////////

    const swapPage = (name) => {
        var s = name.substring(0, 1)
        if (s === "#") {
            var change = name.replace("#", "")
            history.push(`/showfilter/${change}`)
        } else {
            const key = contacts.filter(
                (user) =>
                    user.Name === name
            )
            history.push(`/profile/${key[0].key}`)
        }
        //    history.push(`/profile/${id}`)
        //       window.location.reload(false);

    }
    return (
        <div className="header" >
            <div className="container-nav">
                <nav className="navbar-view">
                    <div className="logo-container font-link">
                        <a href="/home">Gallery</a>
                    </div>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'gg-chevron-down' : 'fas fa-bars'} />

                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className="nav-item li">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="radius input-search ml-5"
                                style={{ width: "300px" }}
                                onChange={(e) => setSearch(e.target.value)}
                            >

                            </input>
                        </li>
                        <li className="nav-item li"
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            <div>
                                <img
                                    alt="Imge"
                                    src={imageUser}
                                    className=" max-w-40-px rounded-full border image"
                                />
                            </div>
                            <label className="nav-links font-name-head" onClick={() => { closeMobileMenu(); swapPage(userId) }}>
                                {useName}
                                <i className='fas fa-caret-down padding left 10px' />
                            </label>
                            {dropdown && <Dropdown />}
                        </li>

                        <li className="nav-item li">
                            <Link to="/" className="nav-links-mobile" onClick={() => { logout(); }}>

                                Log out
                            </Link>

                        </li>
                        <li className="nav-item li">
                            <DarkMode />
                        </li>
                    </ul>

                </nav>

                <div className="container-search">
                    {(search.length > 0 && find.length > 0) ? (
                        find.map((contact, key) =>
                            <div className="dataResult-view cursor-allowed" style={{ display: filteredContacts ? "block" : "none" }}
                                key={key} onClick={() => { swapPage(contact) }}>
                                <div className="font-name-main color-black mt-3 ml-3">
                                    <label> {contact}</label>
                                </div>

                            </div>)
                    ) : (
                        null
                    )}
                </div>
            </div>
        </div>
    );
}


export default NavbarViewer;