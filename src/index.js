import React from 'react';
import ReactDOM from 'react-dom';

import MainScreen from './components/Main';
import {StorageProvider} from "./components/StorageProvider";
import {LocationProvider} from "./components/LocationProvider";

ReactDOM.render((
    <StorageProvider>
        <LocationProvider>
            <MainScreen/>
        </LocationProvider>
    </StorageProvider>
), document.getElementById('app'));