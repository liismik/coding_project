import React, {useEffect, useState} from "react";
import {default as axios} from "axios";
import {Link, useParams} from "react-router-dom";
import './UserLoginHistoryComponent.css';
import {Button} from "antd";

function UsersTableComponent() {
    const { id } = useParams();

    const [history, setHistory] = useState([]);

    useEffect( () => {
        async function getAllUsers() {
            const response = await axios.get(`/app/users/${id}`);
            setHistory(response.data);
        }
        getAllUsers().then();
    }, []);

    return (
        <div>
            <Button type='primary'>
                <Link to='/register'>Register new user</Link>
            </Button>
            <Button type='primary'>
                <Link to='/users'>Users list</Link>
            </Button>
            <h2 className='title'>Selected user's login history</h2>
            <div className='listContainer'>
                {history.map((loginOccurrence,i) => (
                    <p key={i}>{loginOccurrence}</p>
                ))}
            </div>
        </div>
    )
}

export default UsersTableComponent