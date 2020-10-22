import React from 'react';

var Filter = require('bad-words'),
    filter = new Filter();
 
console.log(filter.clean("Don't be an ash0le"));

const App = () => {
    return (
        <div>
            My plugin
        </div>
    )
}

export default App;