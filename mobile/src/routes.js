import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'; 

import Main from './pages/main';
import Profile from './pages/profile';

const Routes = createAppContainer(
    createStackNavigator({
        Main:{
            screen: Main,
            navigationOptions: {
                title: 'DevRadar'
            }
        },
        Profile:{
            screen: Profile,
            navigationOptions:{
                title: 'Github Profile'
            }
        }
    }, {
        defaultNavigationOptions:{
            headerTintColor: "#FFF",
            headerBackTitleVisible: false,
            headerStyle:{
                backgroundColor: '#786811'
            },
            headerTitleAlign: "center",
        }
    })
);

export default Routes;