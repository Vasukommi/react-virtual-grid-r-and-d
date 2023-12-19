import { useNavigate } from "react-router-dom"

const Button = ({ name, link }: any) => {
    const navigate = useNavigate();
    const navigateToDestination = () => {
        navigate(link);
    }
    return (
        <div className="reusable-button-container">
            <button className="reusable-button" onClick={navigateToDestination}>{name}</button>
        </div>
    )
}
export default Button