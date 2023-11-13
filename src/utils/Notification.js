import { Store } from 'react-notifications-component';
import 'animate.css/animate.min.css';

// Alternate way to use classes without prefix like `animated fadeIn`
import 'animate.css/animate.compat.css'



export const Notification  = ({message,type=null}) => {

  Store.addNotification({
    title: "Wonderful!",
    message: message,
    type: type || "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  });
}