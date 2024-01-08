import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import '../Tab/vertical.css';
import CryptoJS from 'crypto-js';
import { BiPencil } from 'react-icons/bi';
import { Modal } from 'antd';
import Editprofile from './Editprofile';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileUuid, setUserPhoto, setUserUuid } from '../../actions/authActions';
import { useCookies } from 'react-cookie';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileimg, setProfileimg] = useState({ userPhotoUrl: '' });
    const [cookies] = useCookies(['token']);
    const defaultImageUrl = 'https://robohash.org/yourtext.png';
    const dispatch = useDispatch();

    useEffect(() => {
        const encryptedUuid = cookies.token;

        if (encryptedUuid) {
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedUuid, 'ASDCFVBNLKMNBSDFVBNJNBCV');
            const uuid = decryptedBytes.toString(CryptoJS.enc.Utf8);
            dispatch(setUserUuid(uuid));
            fetchUserData(uuid);
        }
    }, [dispatch, cookies.token]);

    const uuid2 = useSelector(state => state.profileuuid.uuid);

    const fetchUserData = (uuid) => {
        fetch(`http://localhost:8080/users/${uuid}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Request failed');
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(data => {
                setUserData({
                    firstName: data.userProfile.firstName,
                    lastName: data.userProfile.lastName,
                    location: data.userProfile.location,
                });

                dispatch(setProfileUuid(data.userProfile.uuid));
            })
            .catch(e => {
                console.log(e);
            });
    };


    const featchuserPhoto = () => {
        fetch(`http://localhost:8080/profile/profilePhoto/${uuid2}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Request failed');
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(data => {

                setProfileimg({
                    userPhotoUrl: data.completeImageUrl,
                });

                dispatch(setUserPhoto(data.completeImageUrl));
            })
            .catch(e => {
                console.error(e);
            });
    };

    useEffect(() => {
        featchuserPhoto();
    }, [uuid2]);

    const handlePencilClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='profile overflow-y-scroll'>
            <MDBContainer className="col-lg-8 mx-auto">
                <MDBRow className="justify-content-start align-items-center h-100">
                    <MDBCol className='mx-auto'>
                        <MDBCard>
                            <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                                <div className="position-absolute top-0 end-0 p-3" style={{ cursor: 'pointer' }}>
                                    <BiPencil size={24} color="#fff" onClick={handlePencilClick} />
                                </div>

                                <Modal className='d-flex justify-content-start'
                                    visible={isModalOpen}
                                    onCancel={closeModal}
                                    title="Edit Profile"
                                    footer={null}
                                >
                                    <Editprofile />
                                </Modal>

                                <div className="ms-4 mt-5 d-flex flex-column abc" style={{ width: '150px' }}>

                                    <div className="position-relative">
                                        <MDBCardImage
                                            src={isProfileimg.userPhotoUrl || defaultImageUrl}
                                            alt="Default Profile Photo"
                                            className="mt-4 mb-2 img-thumbnail img-fluid"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        />
                                    </div>

                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    {userData && (
                                        <>
                                            <MDBTypography tag="h5">
                                                {userData.firstName} {userData.lastName}
                                            </MDBTypography>
                                            <MDBCardText>
                                                {userData.location}
                                            </MDBCardText>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex justify-content-end text-center py-1">
                                    <div>
                                        <MDBCardText className="mb-1 h5">253</MDBCardText>
                                        <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                                    </div>
                                    <div className="px-3">
                                        <MDBCardText className="mb-1 h5">1026</MDBCardText>
                                        <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                                    </div>
                                    <div>
                                        <MDBCardText className="mb-1 h5">478</MDBCardText>
                                        <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                                    </div>
                                </div>

                            </div>


                            <MDBCardBody className="text-black p-4">
                                <div className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                                        <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText>

                                    </div>
                                    <MDBRow>
                                        <MDBCol className="mb-2">
                                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                                                alt="image 1" className="w-100 rounded-3" />
                                        </MDBCol>
                                        <MDBCol className="mb-2">
                                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                                                alt="image 1" className="w-100 rounded-3" />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="g-2">
                                        <MDBCol className="mb-2">
                                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                                                alt="image 1" className="w-100 rounded-3" />
                                        </MDBCol>
                                        <MDBCol className="mb-2">
                                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                                                alt="image 1" className="w-100 rounded-3" />
                                        </MDBCol>
                                    </MDBRow>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}
