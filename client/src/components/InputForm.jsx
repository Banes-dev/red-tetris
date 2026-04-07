import {useState, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";

export default function InputForm({title, fields, onSubmit, onCancel})
{
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: field.initialValue || "" }), {})
    );

    const handleChange = (e, name) => {
        setFormData({...formData, [name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

	// Opacity animation
	const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);

	return (
        <>
            <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isVisible ? "opacity-80" : "opacity-0"}`}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="w-11/12 md:w-1/3 p-6 rounded-lg bg-arcade-black border-4 border-neon-yellow animate-slide_in_up">
                    <h2 className="text-2xl font-bold text-neon-red font-arcade text-center mb-6">{title}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label className="text-neon-cyan font-arcade mb-1">{field.label}</label>
                                <div className="relative">
                                    <input
                                        type={field.type || "text"}
                                        value={formData[field.name]}
                                        onChange={(e) => handleChange(e, field.name)}
                                        placeholder={field.placeholder}
                                        className={`w-full px-4 py-2 ${field.icon ? "pl-12" : ""} bg-arcade-black/50 border-2 border-neon-purple rounded-lg text-neon-cyan font-arcade focus:outline-none focus:ring-2 focus:ring-neon-pink`}
                                    />
                                    {field.icon && (
                                        <FontAwesomeIcon icon={field.icon} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan text-xl"/>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center md:justify-end space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 bg-neon-red text-white font-arcade border-2 border-neon-red/70 rounded-lg hover:bg-neon-red/90 transition-all flex items-center"
                            ><FontAwesomeIcon icon={faTimes} className="mr-2"/>Cancel</button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-neon-green text-white font-arcade border-2 border-neon-green/70 rounded-lg hover:bg-neon-green/90 transition-all flex items-center"
                            ><FontAwesomeIcon icon={faCheck} className="mr-2"/>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
