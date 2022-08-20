import "./AccessDeniedComponent.css"

function AccessDeniedComponent() {
    return (
        <div className="componentContainer">
            <h1 className="text">YOU SHALL NOT PASS!</h1>
            <p>You don't have access to this page! Logging in might help.</p>
            <img className="gif" src="https://c.tenor.com/EgvXcIbZLqgAAAAM/gandalf-the-grey-lord-of-the-rings.gif" />
        </div>
    )
}

export default AccessDeniedComponent;