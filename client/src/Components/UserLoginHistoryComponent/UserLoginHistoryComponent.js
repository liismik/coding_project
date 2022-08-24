import React, {useEffect, useState} from "react";
import {default as axios} from "axios";
import {Link, useParams} from "react-router-dom";
import "./UserLoginHistoryComponent.css";
import PaginationComponent from "../PaginationComponent/PaginationComponent";

function UsersLoginHistoryComponent() {
    const { id } = useParams();
    const [history, setHistory] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const resultsPerPage = 10;
    let currentPageNumber = 1;

    const changeHistoryPage = async (params) => {
        await getPaginatedHistory(params);
    };

    async function getPaginatedHistory(params) {
        await axios.post(`/app/users/${id}/history/paginated`, { params },
            {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
            .then((response) => {
                setHistory(response.data.paginatedData);
                if(response.data.totalPages){
                    setTotalPages(response.data.totalPages);
                }
            })
    }

    useEffect( () => {
        getPaginatedHistory({resultsPerPage, currentPageNumber, state: "initial"}).then();
    }, []);

    return (
        <div>
            <Link to="/register">
                <button>Register new user</button>
            </Link>
            <Link to="/users">
                <button>Users list</button>
            </Link>
            <h2 className="title">Selected user's login history</h2>
            <div className="historyTable">
                <table>
                    <tbody>
                        <tr>
                            <th>Login times</th>
                        </tr>
                        {(history.length > 0) ? (history.map((loginOccurrence, i) => (
                            <tr key={i}>
                                <td>{new Date(loginOccurrence).toUTCString()}</td>
                            </tr>
                        )))
                            :
                            <tr>
                                <td>No login history</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <PaginationComponent
                resultsPerPage={resultsPerPage}
                totalPages={totalPages}
                changePage={changeHistoryPage}
            />
        </div>
    )
}

export default UsersLoginHistoryComponent