import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import {default as axios} from "axios";
import {Button} from 'antd';
import './UsersTableComponent.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {toast} from "react-toastify";

function UsersTableComponent() {
    const [users, setUsers] = useState([]);
    const tableHeaders = ['Email', 'Activity status', 'Delete user'];

    useEffect( () => {
        getAllUsers().then();
    }, []);

    async function getAllUsers() {
        const response = await axios.get('/app/users');
        setUsers(response.data);
    }

    const handleClick = (userId) => {
        confirmAlert(
            {
                title: 'Confirm',
                message: 'Are you sure you want to delete this user permanently? They will be notified of this action.',
                buttons: [
                    {
                        label: 'Confirm deletion',
                        onClick: async () => {
                            //TODO if id matches current user, route current user to register page after deletion
                            await axios.post('/app/users/delete-user', {userId})
                                .then((response) => {
                                    console.log('Front success', response);
                                    toast.success(response, {position: 'top-center'});
                                    getAllUsers().then();
                                })
                                .catch((err) => {
                                    console.log('Front fail', err.response.data);
                                    toast.error(err.response.data, {position: 'top-center'});
                                })
                        }
                    },
                    {
                        label: 'Cancel',
                        onClick: () => {}
                    }
                ],
                closeOnEscape: true,
                closeOnClickOutside: true,
                keyCodeForClose: [8, 32],
                willUnmount: () => {},
                onClickOutside: () => {},
                onKeypressEscape: () => {},
                overlayClassName: "overlay-custom-class-name"
            }
        );
    }

    return (
        <>
            <Button type='primary'>
                <Link to='/register'>Register new user</Link>
            </Button>
            <h1 className='title'>Existing users</h1>
            <div className='usersTable'>
                <table>
                    <tbody>
                        <tr>
                            {tableHeaders.map((header, i) => (
                                <th key={i}>{header}</th>
                            ))}
                        </tr>
                        {users.map((user, i) => (
                            <tr key={i}>
                                <td>
                                    <Link to={`/users/${user._id}`} className='listItem'>
                                        {user.email}
                                    </Link>
                                </td>
                                {(user.verified) ? (
                                    <td className='activityStatus'>Active</td>
                                ) : (!user.verified) ? (
                                    <td className='activityStatus'>Inactive</td>
                                ) : null
                                }
                                <td className='deleteButton' onClick={() => handleClick(user._id)}>Delete</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UsersTableComponent