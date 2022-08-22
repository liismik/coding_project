import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {default as axios} from "axios";
import "./UsersTableComponent.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {toast} from "react-toastify";
import PaginationComponent from "../PaginationComponent/PaginationComponent";

function UsersTableComponent() {
    const navigate = useNavigate();
    const currentUserEmail = localStorage.getItem('email');
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const resultsPerPage = 10;
    let currentPageNumber = 1;
    const tableHeaders = ["Email", "Activity status", "Delete user"];

    const changeUsersPage = async (params) => {
        await getPaginatedUsers(params);
    };

    async function getPaginatedUsers(params) {
        await axios.post("/app/users/paginated", { params }, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }})
            .then((response) => {
                setUsers(response.data.paginatedData);
                if(response.data.totalPages){
                    setTotalPages(response.data.totalPages);
                }
            });
    }

    useEffect( () => {
        getPaginatedUsers({resultsPerPage, currentPageNumber, state: 'initial'}).then();
    }, []);

    const handleClick = (userId) => {
        confirmAlert(
            {
                title: "Confirm",
                message: "Are you sure you want to delete this user permanently? They will be notified of this action.",
                buttons: [
                    {
                        label: "Confirm deletion",
                        onClick: async () => {
                            await axios.post("/app/users/delete-user", {userId, currentUserEmail}, {
                                headers: {
                                    "x-access-token": localStorage.getItem("token"),
                                }})
                                .then((response) => {
                                    if(response.data.deletedOwnAccount) {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("email");
                                        navigate("/login");
                                    } else {
                                        toast.success(response, {position: "top-center"});
                                        getPaginatedUsers({resultsPerPage, currentPageNumber, state: 'initial'}).then();
                                    }
                                })
                                .catch((err) => {
                                    toast.error(err.response.data, {position: "top-center"});
                                })
                        }
                    },
                    {
                        label: "Cancel",
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
            <button>
                <Link to="/add-another-user" className="linkedButton">Add new user</Link>
            </button>
            <h1 className="title">Existing users</h1>
            <div className="usersTable">
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
                                    <Link to={`/users/${user._id}`} className="listItem">
                                        {user.email}
                                    </Link>
                                </td>
                                {(user.verified) ? (
                                    <td className="activityStatus">Active</td>
                                ) : (!user.verified) ? (
                                    <td className="activityStatus">Inactive</td>
                                ) : null
                                }
                                <td className="deleteButton" onClick={() => handleClick(user._id)}>Delete</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PaginationComponent
                resultsPerPage={resultsPerPage}
                totalPages={totalPages}
                changePage={changeUsersPage}
            />
        </>
    )
}

export default UsersTableComponent