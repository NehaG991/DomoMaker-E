const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const strength = e.target.querySelector('#domoStrength').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    console.log(_csrf);

    if (!name || !age) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, strength, _csrf}, loadDomosFromServer);

    return false;
};

const deleteDomo = (e) => {

    e.preventDefault();
    helper.hideError();

    const _csrf = document.querySelector('#_csrf').value;
    const _id = e.target.querySelector('#_id').value;

    console.log(_csrf);

    helper.sendPost(e.target.action, {_id, _csrf}, loadDomosFromServer);
}

const DomoForm = (props) => {
    return ( 
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input type="text" id="domoName" name="name" placeholder="Domo Name" />

            <label htmlFor="age">Age: </label>
            <input type="number" id="domoAge" name="age" min="0" />

            <label htmlFor="strength">Strength: </label>
            <input type="number" id="domoStrength" name="strength" min="0" />
            
            <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 className='domoName'>Name: {domo.name} </h3>
                <h3 className='domoAge'>Age: {domo.age} </h3>
                <h3 className='domoStrength'>Strength: {domo.strength} </h3>

                <form 
                    action="/delete"
                    name="deleteButton"
                    method='POST'
                    onSubmit={deleteDomo}
                >
                    <input className="makeDomoSubmit" type="submit" value="Delete" />
                    <input type="hidden" id="_csrf" name="_csrf" value={props.csrf} />
                    <input type="hidden" id="_id" name='_id' value={domo._id} />
                </form>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={data.csrfToken} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
};

window.onload = init;

