import React, {useEffect, useState} from "react";
import {default as axios} from "axios";
import {Link, useParams} from "react-router-dom";
import "./UserLoginHistoryComponent.css";
import {Button} from "antd";
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
            <Button type="primary">
                <Link to="/register">Register new user</Link>
            </Button>
            <Button type="primary">
                <Link to="/users">Users list</Link>
            </Button>
            <h2 className="title">Selected user's login history</h2>
            <div className="historyTable">
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
            <PaginationComponent
                resultsPerPage={resultsPerPage}
                totalPages={totalPages}
                changePage={changeHistoryPage}
            />
        </div>
    )
}

export default UsersLoginHistoryComponent