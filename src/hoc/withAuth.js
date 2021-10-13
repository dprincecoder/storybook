import { withRouter } from "react-router";
import {useAuth} from '../customHooks'

//if user is signin and is valid then return the page else restrict them
const WithAuth = props => useAuth(props) && props.children;

export default withRouter(WithAuth)