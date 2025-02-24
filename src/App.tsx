import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './components/Menu/Menu';
import Setting from './pages/Setting';
import Chat from './pages/Chat';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Details from './pages/Details';
import MenuAdmin from './components/Admin/MenuAdmin';
import AdminSettingPages from './pages/AdminSetting';
import NotFound from './pages/NotFoundPage';
import NewsRouter from './components/News/NewsRouter';
import NewsDetail from './components/News/NewsDetail';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/login"/>
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route component={Register} path="/register" exact />
        <Route component={Menu} path="/app" />
        <Route component={MenuAdmin} path="/admin"/>
        <Route component={Setting} path="/app/profile/setting" />
        <Route component={AdminSettingPages} path="/admin/profile/setting"/>
        <Route component={Chat} path="/app/chat"/>
        <Route component={NotFound} path="/notfound"/>
        <Route path='/app/news/:idNews' component={NewsDetail} />  
       
        {/*wildcard */}
        <Route render={() => {
          const storedUserData = localStorage.getItem('loggedInUser');
        
          if(storedUserData){
            const data = JSON.parse(storedUserData);
            console.log("data user from localStorage: ", data);

            return (data.role!=='Admin' ? <Redirect to="/app" /> : <Redirect to="/admin" />)
          }else{
            return <Redirect to="/login" />;
          }
        }} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
