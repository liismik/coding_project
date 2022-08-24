import './PaginationComponent.css'
import React, {useState} from "react";

function PaginationComponent(props) {
    const { resultsPerPage, totalPages } = props;
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const handlePageChange = async (changeToPage) => {
        if ((changeToPage === "previous") && (currentPageNumber > 1)) {
            setCurrentPageNumber(currentPageNumber-1);
            props.changePage({resultsPerPage, currentPageNumber: currentPageNumber-1})
        }
        if ((changeToPage === "next") && (currentPageNumber < totalPages)) {
            setCurrentPageNumber(currentPageNumber+1);
            props.changePage({resultsPerPage, currentPageNumber: currentPageNumber+1});
        }
    }
    return (
        <div className="paginationButtonsContainer">
            <button onClick={() => handlePageChange("previous")}>{"<"}</button>
            <span className="pageNumber">{currentPageNumber}/{totalPages}</span>
            <button onClick={() => handlePageChange("next")}>{">"}</button>
        </div>
    )
}

export default PaginationComponent;