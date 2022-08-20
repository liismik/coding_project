import React, {useEffect, useState} from "react";
import {default as axios} from "axios";
import {Link, useParams} from "react-router-dom";
import './UserLoginHistoryComponent.css';
import {Button} from "antd";

function UsersTableComponent() {
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const resultsPerPage = 10;

    const handlePageChange = async (changeToPage) => {
        if ((changeToPage === 'previous') && (currentPageNumber > 1)) {
            setCurrentPageNumber(currentPageNumber-1);
            await getPaginatedHistory({resultsPerPage, currentPageNumber: currentPageNumber-1});
        }
        if ((changeToPage === 'next') && (currentPageNumber < totalPages)) {
            setCurrentPageNumber(currentPageNumber+1);
            await getPaginatedHistory({resultsPerPage, currentPageNumber: currentPageNumber+1});
        }
    }

    async function getPaginatedHistory(params) {
        await axios.post(`/app/users/${id}/history/paginated`, { params })
            .then((response) => {
                setHistory(response.data.history);
                if(response.data.totalPages){
                    setTotalPages(response.data.totalPages);
                }
            })
    }

    useEffect( () => {
        getPaginatedHistory({resultsPerPage, currentPageNumber, state: 'initial'}).then();
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
            <div className='historyTable'>
                <table>
                    <tbody>
                        <tr>
                            <th>Login times</th>
                        </tr>
                        {history.map((loginOccurrence, i) => (
                            <tr>
                                <td key={i}>{new Date(loginOccurrence).toUTCString()}</td>
                            </tr>
                        ))

                        }
                    </tbody>
                </table>
            </div>
            <div className='paginationButtonsContainer'>
                <button onClick={() => handlePageChange('previous')}>{'<'}</button>
                <span>{currentPageNumber}</span>
                <button onClick={() => handlePageChange('next')}>{'>'}</button>
            </div>
        </div>
    )
}

export default UsersTableComponent