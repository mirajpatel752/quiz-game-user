import React, {useState} from 'react';
import "./teams.scss";
import {Modal} from 'reactstrap';
import {useNavigate} from 'react-router-dom';

const Topics = () => {

    const [topic, setTopic] = useState(true)
    const navigate = useNavigate()
    const conform = (() => {
        navigate(-1)
        setTopic(false)
    })

    return (
        <div>
            <Modal className="topic-modal"
                autoFocus={true}
                centered={true}
                backdrop="static"
                isOpen={topic}>
                <div className="topic-user-wrapper">
                    <div className="close-icon-wrapper d-flex justify-content-end ">
                        <img onClick={conform}
                            src={
                                require("../../Assets/Img/close-icon.svg").default
                            }
                            alt=""
                            className="img-fluid"/>
                    </div>
                    <p className='your-access-text'>Your access has not been granted yet. We will inform you when it is done! Please stay tuned!</p>
                </div>
            </Modal>
        </div>
    )
}

export default Topics
