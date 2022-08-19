import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import {default as axios} from "axios";
import {Button} from 'antd';
import './UsersTableComponent.css';

function UsersTableComponent() {
    const [users, setUsers] = useState([]);

    async function getAllUsers() {
        const response = await axios.get('/app/users');
        setUsers(response.data);
        console.log(response);
    }

    useEffect( () => {
        getAllUsers().then();
    }, []);

    return (
        <>
            <Button type='primary'>
                <Link to='/register'>Register new user</Link>
            </Button>
            <h1 className='title'>Existing users</h1>
            <div className='listContent'>
                {users.map((user, i) => (
                    <Link key={i} to={`/users/${user._id}`}>
                        <p className='listItem'>{user.email}</p>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default UsersTableComponent