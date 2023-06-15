import './FullpageLoading.css' 
import loadingImage from '../images/loading-1.svg'


const FullpageLoading = (props) => { 

   return (
     <div className={`fullpage-loading__container ${props.className}`}>
        <img src={loadingImage} alt='loading...' className='loading__image' />
        {props.messageToDisplay && <p className='loading-message'>{props.messageToDisplay}</p>}
     </div>
   )
}
export default FullpageLoading;