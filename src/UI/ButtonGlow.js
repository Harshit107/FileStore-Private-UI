import './ButtonGlow.css' 


const ButtonGlow = (props) => { 

   return (
     <div className={`button-glow__container glow-on-hover`}>
       {props.children}
     </div>
   );
}
export default ButtonGlow;